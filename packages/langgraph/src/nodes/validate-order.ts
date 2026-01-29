import {
  CallIntakeStateType,
  ValidationResult,
  ValidationIssue,
  OrderPriority,
} from "../state";
import { createModel } from "../model";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const VALIDATION_PROMPT = `You are an order validation AI agent for a logistics company in Pakistan. 
Your job is to analyze extracted order data and identify issues that need human attention.

YOU DO NOT TALK TO CUSTOMERS. You provide validation feedback to the receptionist/dispatcher.

Analyze the order and respond with JSON containing:
1. issues: Array of problems found
2. priority: "urgent" | "normal" | "low"
3. priorityReason: Why this priority was assigned
4. summary: Brief summary for the receptionist

For each issue, provide:
- type: One of: "address_ambiguous", "address_impossible", "missing_customer_name", "missing_customer_phone", "missing_pickup_address", "missing_dropoff_address", "missing_items", "invalid_phone_format", "same_pickup_dropoff", "unclear_items"
- field: Which field has the issue (e.g., "pickupAddress", "customerPhone")
- message: Clear explanation of the problem
- suggestedQuestion: A question the receptionist should ask the customer
- severity: "error" (must fix) or "warning" (should verify)

VALIDATION RULES:
1. Address Validation:
   - "near the mosque" or "opposite X shop" without street/area = ambiguous (ERROR)
   - Only landmark references = ambiguous (ERROR)
   - Only area name without house/street = ambiguous (ERROR)
   - Same pickup and dropoff = impossible (ERROR)
   - Missing city/area = error

2. Phone Validation:
   - Pakistani format: 03XX-XXXXXXX or +92-3XX-XXXXXXX
   - Must be 10-11 digits (excluding country code)
   - Missing phone = error

3. Required Fields (ALL are REQUIRED - severity=error if missing):
   - Customer name: error if missing
   - Pickup address: error if missing
   - Dropoff address: error if missing
   - Items: error if missing or unclear

4. Priority Classification:
   - "urgent": Keywords like "urgent", "ASAP", "emergency", "immediately", medicine/medical items
   - "low": Keywords like "whenever", "no rush", "next week"
   - "normal": Everything else

CRITICAL: Respond with ONLY valid JSON. No markdown, no explanation:
{"issues":[{"type":"string","field":"string","message":"string","suggestedQuestion":"string","severity":"error|warning"}],"priority":"urgent|normal|low","priorityReason":"string","summary":"string"}`;

/**
 * Parse JSON response from LLM with robust error handling
 */
function parseValidationResponse(
  content: string,
): Omit<ValidationResult, "isValid"> {
  let jsonStr = content.trim();

  // Remove markdown code blocks if present
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // Extract JSON object
  const jsonStartIndex = jsonStr.indexOf("{");
  const jsonEndIndex = jsonStr.lastIndexOf("}");
  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    jsonStr = jsonStr.slice(jsonStartIndex, jsonEndIndex + 1);
  }

  // Fix common JSON issues from LLM
  // 1. Replace curly quotes with straight quotes
  jsonStr = jsonStr.replace(/[""]/g, '"');
  jsonStr = jsonStr.replace(/['']/g, "'");

  // 2. Remove trailing commas before } or ]
  jsonStr = jsonStr.replace(/,\s*([\]}])/g, "$1");

  // 3. Fix newlines within strings - replace with space
  jsonStr = jsonStr.replace(/\r?\n/g, " ");

  // 4. Collapse multiple spaces
  jsonStr = jsonStr.replace(/\s+/g, " ");

  try {
    return JSON.parse(jsonStr);
  } catch {
    console.error("[parseValidationResponse] Failed to parse, using fallback");
    // Return a default response instead of throwing
    return {
      issues: [],
      priority: "normal" as const,
      priorityReason: "Could not parse AI validation response",
      summary: "Validation parsing failed - using basic validation fallback",
    };
  }
}

/**
 * Validate order extraction and generate issues/follow-up questions
 */
export async function validateOrderNode(
  state: CallIntakeStateType,
): Promise<Partial<CallIntakeStateType>> {
  // Skip validation if no extraction
  if (!state.extraction) {
    return {
      currentStep: "validated",
      validation: {
        isValid: false,
        issues: [
          {
            type: "missing_pickup_address",
            field: "extraction",
            message: "Order extraction failed completely",
            suggestedQuestion:
              "Please ask the customer to provide their order details again.",
            severity: "error",
          },
        ],
        priority: "normal",
        priorityReason: "Extraction failed, needs manual processing",
        summary: "AI extraction failed. Manual order entry required.",
      },
    };
  }

  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = createModel();

      // Build context for validation
      const extractionContext = `
ORDER EXTRACTION TO VALIDATE:
- Customer Name: ${state.extraction.customerName || "[NOT PROVIDED]"}
- Customer Phone: ${state.extraction.customerPhone || "[NOT PROVIDED]"}
- Pickup Address: ${state.extraction.pickupAddress || "[NOT PROVIDED]"}
- Dropoff Address: ${state.extraction.dropoffAddress || "[NOT PROVIDED]"}
- Items: ${state.extraction.items?.length ? JSON.stringify(state.extraction.items) : "[NOT PROVIDED]"}
- Special Instructions: ${state.extraction.specialInstructions || "[NONE]"}
- AI Confidence Score: ${(state.extraction.confidenceScore * 100).toFixed(0)}%

ORIGINAL MESSAGE:
${state.transcript}
`;

      const response = await model.invoke([
        new SystemMessage(VALIDATION_PROMPT),
        new HumanMessage(extractionContext),
      ]);

      const content = response.content as string;
      console.log(
        "[validateOrderNode] Raw response:",
        content.substring(0, 300),
      );

      const parsed = parseValidationResponse(content);

      // Ensure arrays and defaults
      const issues: ValidationIssue[] = Array.isArray(parsed.issues)
        ? parsed.issues
        : [];
      const priority: OrderPriority = ["urgent", "normal", "low"].includes(
        parsed.priority,
      )
        ? (parsed.priority as OrderPriority)
        : "normal";

      // Determine if valid (no errors)
      const hasErrors = issues.some((issue) => issue.severity === "error");

      const validation: ValidationResult = {
        isValid: !hasErrors,
        issues,
        priority,
        priorityReason: parsed.priorityReason || "Standard delivery order",
        summary: parsed.summary || "Order validation completed",
      };

      return {
        currentStep: "validated",
        validation,
      };
    } catch (error) {
      console.error(
        `[validateOrderNode] Attempt ${attempt + 1} failed:`,
        error,
      );

      if (attempt === MAX_RETRIES) {
        // Return a basic validation based on extraction data
        return {
          currentStep: "validated",
          validation: performBasicValidation(state),
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return { currentStep: "error", error: "Unexpected validation failure" };
}

/**
 * Fallback basic validation without LLM
 */
function performBasicValidation(state: CallIntakeStateType): ValidationResult {
  const issues: ValidationIssue[] = [];
  const extraction = state.extraction!;

  // Check missing fields
  if (!extraction.customerName) {
    issues.push({
      type: "missing_customer_name",
      field: "customerName",
      message: "Customer name was not provided",
      suggestedQuestion: "May I have your name please?",
      severity: "error",
    });
  }

  if (!extraction.customerPhone) {
    issues.push({
      type: "missing_customer_phone",
      field: "customerPhone",
      message: "Customer phone number was not provided",
      suggestedQuestion: "What is your contact number?",
      severity: "error",
    });
  }

  if (!extraction.pickupAddress) {
    issues.push({
      type: "missing_pickup_address",
      field: "pickupAddress",
      message: "Pickup address was not provided",
      suggestedQuestion: "Where should we pick up the items from?",
      severity: "error",
    });
  }

  if (!extraction.dropoffAddress) {
    issues.push({
      type: "missing_dropoff_address",
      field: "dropoffAddress",
      message: "Delivery address was not provided",
      suggestedQuestion: "Where should we deliver the items?",
      severity: "error",
    });
  }

  if (!extraction.items || extraction.items.length === 0) {
    issues.push({
      type: "missing_items",
      field: "items",
      message: "No items specified for delivery",
      suggestedQuestion: "What items would you like us to deliver?",
      severity: "error",
    });
  }

  // Check for ambiguous addresses
  const ambiguousPatterns = [
    /near\s+(the\s+)?mosque/i,
    /opposite\s+\w+/i,
    /beside\s+\w+/i,
    /close\s+to\s+\w+/i,
  ];

  if (extraction.pickupAddress) {
    for (const pattern of ambiguousPatterns) {
      if (
        pattern.test(extraction.pickupAddress) &&
        extraction.pickupAddress.length < 50
      ) {
        issues.push({
          type: "address_ambiguous",
          field: "pickupAddress",
          message: `Pickup address "${extraction.pickupAddress}" is ambiguous`,
          suggestedQuestion:
            "Can you provide a more specific address or nearby landmark/street name?",
          severity: "error",
        });
        break;
      }
    }
  }

  if (extraction.dropoffAddress) {
    for (const pattern of ambiguousPatterns) {
      if (
        pattern.test(extraction.dropoffAddress) &&
        extraction.dropoffAddress.length < 50
      ) {
        issues.push({
          type: "address_ambiguous",
          field: "dropoffAddress",
          message: `Delivery address "${extraction.dropoffAddress}" is ambiguous`,
          suggestedQuestion:
            "Can you provide a more specific delivery address?",
          severity: "error",
        });
        break;
      }
    }
  }

  // Check same pickup/dropoff
  if (
    extraction.pickupAddress &&
    extraction.dropoffAddress &&
    extraction.pickupAddress.toLowerCase().trim() ===
      extraction.dropoffAddress.toLowerCase().trim()
  ) {
    issues.push({
      type: "same_pickup_dropoff",
      field: "addresses",
      message: "Pickup and delivery addresses are the same",
      suggestedQuestion:
        "The pickup and delivery addresses appear to be the same. Can you confirm the delivery location?",
      severity: "error",
    });
  }

  // Determine priority
  let priority: OrderPriority = "normal";
  let priorityReason = "Standard delivery order";
  const transcript = state.transcript?.toLowerCase() || "";

  if (
    transcript.includes("urgent") ||
    transcript.includes("asap") ||
    transcript.includes("emergency") ||
    transcript.includes("medicine") ||
    transcript.includes("medical")
  ) {
    priority = "urgent";
    priorityReason = "Customer indicated urgency or medical items";
  } else if (
    transcript.includes("no rush") ||
    transcript.includes("whenever") ||
    transcript.includes("next week")
  ) {
    priority = "low";
    priorityReason = "Customer indicated no urgency";
  }

  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    isValid: !hasErrors,
    issues,
    priority,
    priorityReason,
    summary: hasErrors
      ? `${issues.filter((i) => i.severity === "error").length} issue(s) require attention`
      : issues.length > 0
        ? `Order valid with ${issues.length} warning(s)`
        : "Order is complete and valid",
  };
}
