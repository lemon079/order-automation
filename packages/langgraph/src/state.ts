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

  // Output
  extraction: Annotation<OrderExtraction | null>({
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
