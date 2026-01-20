import { StateGraph, END, START, Annotation } from '@langchain/langgraph';
import {
    OrderResolutionStateType,
    createInitialState,
    WarehouseResultType,
    DriverResultType
} from './state';
import { resolveOrderNode } from './nodes/resolve-order';
import { checkWarehouseNode } from './nodes/check-warehouse';
import { assignDriverNode } from './nodes/assign-driver';
import { confirmDispatchNode } from './nodes/confirm-dispatch';

// Define state annotation for LangGraph
const OrderStateAnnotation = Annotation.Root({
    orderId: Annotation<string>(),
    orderDetails: Annotation<{
        customer: string;
        items: number;
        total: number;
        address: string;
    }>(),
    currentStep: Annotation<string>(),
    stepMessages: Annotation<Array<{
        step: string;
        message: string;
        timestamp: string;
    }>>({
        reducer: (current, update) => [...(current || []), ...(update || [])],
        default: () => [],
    }),
    warehouseResult: Annotation<WarehouseResultType | undefined>(),
    driverResult: Annotation<DriverResultType | undefined>(),
    error: Annotation<string | undefined>(),
    dispatchConfirmed: Annotation<boolean>(),
    estimatedDeliveryTime: Annotation<string | undefined>(),
});

type OrderState = typeof OrderStateAnnotation.State;

/**
 * Conditional edge to check if we should continue or handle error
 */
function shouldContinue(state: OrderState): string {
    if (state.currentStep === 'error') {
        return END;
    }
    return 'continue';
}

/**
 * Create and compile the order resolution workflow graph
 */
export function createOrderResolutionGraph() {
    const workflow = new StateGraph(OrderStateAnnotation)
        // Add nodes
        .addNode('resolveOrder', resolveOrderNode as any)
        .addNode('checkWarehouse', checkWarehouseNode as any)
        .addNode('assignDriver', assignDriverNode as any)
        .addNode('confirmDispatch', confirmDispatchNode as any)

        // Define edges (linear workflow)
        .addEdge(START, 'resolveOrder')
        .addConditionalEdges('resolveOrder', shouldContinue, {
            continue: 'checkWarehouse',
            [END]: END,
        })
        .addConditionalEdges('checkWarehouse', shouldContinue, {
            continue: 'assignDriver',
            [END]: END,
        })
        .addConditionalEdges('assignDriver', shouldContinue, {
            continue: 'confirmDispatch',
            [END]: END,
        })
        .addEdge('confirmDispatch', END);

    return workflow.compile();
}

/**
 * Execute the order resolution workflow
 */
export async function executeOrderResolution(
    orderId: string,
    orderDetails: OrderResolutionStateType['orderDetails']
): Promise<OrderResolutionStateType> {
    const graph = createOrderResolutionGraph();
    const initialState = createInitialState(orderId, orderDetails);

    const result = await graph.invoke(initialState as any);
    return result as unknown as OrderResolutionStateType;
}

// Re-export types and utilities
export { createInitialState } from './state';
export type { OrderResolutionStateType, WorkflowStepType } from './state';
