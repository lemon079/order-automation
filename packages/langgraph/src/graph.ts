import { StateGraph, END, START } from "@langchain/langgraph";
import { CallIntakeState, CallIntakeStateType } from "./state";
import { extractOrderNode } from "./nodes/extract-order";

/**
 * Create and compile the call intake workflow graph
 *
 * Flow: START -> extractOrder -> END
 */
export function createCallIntakeGraph() {
  const workflow = new StateGraph(CallIntakeState)
    .addNode("extractOrder", extractOrderNode)
    .addEdge(START, "extractOrder")
    .addEdge("extractOrder", END);

  return workflow.compile();
}

/**
 * Execute the call intake workflow
 */
export async function executeCallIntake(
  transcriptId: string,
  transcript: string,
): Promise<CallIntakeStateType> {
  const graph = createCallIntakeGraph();

  const result = await graph.invoke({
    transcriptId,
    transcript,
    currentStep: "idle",
    extraction: null,
    error: null,
  });

  return result as CallIntakeStateType;
}

// Re-export types
export type { CallIntakeStateType, OrderExtraction } from "./state";
