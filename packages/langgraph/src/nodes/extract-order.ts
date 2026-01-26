import { CallIntakeStateType, OrderExtraction } from "../state";
import { createModel } from "../model";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const EXTRACTION_PROMPT = `You are an order extraction AI. Analyze the following message and extract order information.

Extract the following fields:
- customerName: The sender's name
- customerPhone: The sender's phone number  
- pickupAddress: Where to pick up items from
- dropoffAddress: Where to deliver items to
- items: Array of items with name and quantity (keep it simple)
- specialInstructions: Any special delivery instructions

If a field cannot be determined, set it to null.
Provide a confidence score between 0 and 1 based on how complete the information is.

CRITICAL: Respond with ONLY valid JSON. No markdown, no explanation, just pure JSON:
{"customerName":"string or null","customerPhone":"string or null","pickupAddress":"string or null","dropoffAddress":"string or null","items":[{"name":"string","quantity":1}],"specialInstructions":"string or null","confidenceScore":0.9}`;

/**
 * Clean and parse JSON from LLM response
 */
function parseJsonResponse(content: string): OrderExtraction {
  let jsonStr = content.trim();

  // Remove markdown code blocks if present
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // Remove any leading/trailing non-JSON characters
  const jsonStartIndex = jsonStr.indexOf("{");
  const jsonEndIndex = jsonStr.lastIndexOf("}");
  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    jsonStr = jsonStr.slice(jsonStartIndex, jsonEndIndex + 1);
  }

  // Fix common JSON issues
  // Replace single quotes with double quotes (common LLM mistake)
  jsonStr = jsonStr.replace(/'/g, '"');

  // Remove trailing commas before } or ]
  jsonStr = jsonStr.replace(/,\s*([\]}])/g, "$1");

  // Try to parse
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // Log the problematic JSON for debugging
    console.error(
      "[parseJsonResponse] Failed to parse:",
      jsonStr.substring(0, 500),
    );
    throw e;
  }
}

/**
 * Extract order information from call transcript using Gemini
 */
export async function extractOrderNode(
  state: CallIntakeStateType,
): Promise<Partial<CallIntakeStateType>> {
  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = createModel();

      const response = await model.invoke([
        new SystemMessage(EXTRACTION_PROMPT),
        new HumanMessage(`Message to extract from:\n${state.transcript}`),
      ]);

      const content = response.content as string;
      console.log(
        "[extractOrderNode] Raw response:",
        content.substring(0, 300),
      );

      const extraction = parseJsonResponse(content);

      // Validate required fields exist
      if (typeof extraction.confidenceScore !== "number") {
        extraction.confidenceScore = 0.5; // Default if missing
      }
      if (!Array.isArray(extraction.items)) {
        extraction.items = [];
      }

      return {
        currentStep: "extracted",
        extraction,
      };
    } catch (error) {
      console.error(`[extractOrderNode] Attempt ${attempt + 1} failed:`, error);

      if (attempt === MAX_RETRIES) {
        // Return a fallback extraction on final failure
        return {
          currentStep: "extracted",
          extraction: {
            customerName: null,
            customerPhone: null,
            pickupAddress: null,
            dropoffAddress: null,
            items: [],
            specialInstructions: `[AI Extraction Failed] Original message: ${state.transcript?.substring(0, 200)}...`,
            confidenceScore: 0.1,
          },
        };
      }

      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // This should never be reached, but TypeScript needs it
  return { currentStep: "error", error: "Unexpected extraction failure" };
}
