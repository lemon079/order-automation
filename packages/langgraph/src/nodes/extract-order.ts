import { CallIntakeStateType, OrderExtraction } from "../state";
import { createModel } from "../model";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const EXTRACTION_PROMPT = `You are an order extraction AI. Analyze the following call transcript and extract order information.

Extract the following fields:
- customerName: The caller's name
- customerPhone: The caller's phone number
- pickupAddress: Where to pick up items from
- dropoffAddress: Where to deliver items to
- items: Array of items with name, quantity, and optional notes
- specialInstructions: Any special delivery instructions

If a field cannot be determined from the transcript, set it to null.
Provide a confidence score between 0 and 1 based on how clear the information was.

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "customerName": "string or null",
  "customerPhone": "string or null",
  "pickupAddress": "string or null",
  "dropoffAddress": "string or null",
  "items": [{"name": "string", "quantity": number, "notes": "string or undefined"}],
  "specialInstructions": "string or null",
  "confidenceScore": number
}`;

/**
 * Extract order information from call transcript using Gemini
 */
export async function extractOrderNode(
  state: CallIntakeStateType,
): Promise<Partial<CallIntakeStateType>> {
  try {
    const model = createModel();

    const response = await model.invoke([
      new SystemMessage(EXTRACTION_PROMPT),
      new HumanMessage(`Transcript:\n${state.transcript}`),
    ]);

    // Parse the JSON response
    const content = response.content as string;

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const extraction: OrderExtraction = JSON.parse(jsonStr);

    return {
      currentStep: "extracted",
      extraction,
    };
  } catch (error) {
    console.error("[extractOrderNode] Error:", error);
    return {
      currentStep: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
