import { Annotation } from "@langchain/langgraph";

/**
 * Order extraction result from call transcript
 */
export interface OrderExtraction {
  customerName: string | null;
  customerPhone: string | null;
  pickupAddress: string | null;
  dropoffAddress: string | null;
  items: Array<{
    name: string;
    quantity: number;
    notes?: string;
  }>;
  specialInstructions: string | null;
  confidenceScore: number;
}

/**
 * Issue types that the validation agent can detect
 */
export type ValidationIssueType =
  | "address_ambiguous"
  | "address_impossible"
  | "missing_customer_name"
  | "missing_customer_phone"
  | "missing_pickup_address"
  | "missing_dropoff_address"
  | "missing_items"
  | "invalid_phone_format"
  | "same_pickup_dropoff"
  | "unclear_items";

/**
 * Priority classification for orders
 */
export type OrderPriority = "urgent" | "normal" | "low";

/**
 * A single validation issue detected by the agent
 */
export interface ValidationIssue {
  type: ValidationIssueType;
  field: string;
  message: string;
  suggestedQuestion: string;
  severity: "error" | "warning";
}

/**
 * Validation result from the validation agent
 */
export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  priority: OrderPriority;
  priorityReason: string;
  summary: string;
}

/**
 * Call Intake Agent State
 * Used by the LangGraph workflow to process call transcripts
 */
export const CallIntakeState = Annotation.Root({
  // Input
  transcriptId: Annotation<string>(),
  transcript: Annotation<string>(),

  // Processing
  currentStep: Annotation<string>({
    reducer: (_, update) => update,
    default: () => "idle",
  }),

  // Extraction Output
  extraction: Annotation<OrderExtraction | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),

  // Validation Output
  validation: Annotation<ValidationResult | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),

  // Error handling
  error: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
});

export type CallIntakeStateType = typeof CallIntakeState.State;
