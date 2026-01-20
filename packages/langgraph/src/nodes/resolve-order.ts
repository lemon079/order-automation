import { OrderResolutionStateType } from '../state';

/**
 * Initial node - Start resolving the order
 */
export async function resolveOrderNode(
    state: OrderResolutionStateType
): Promise<Partial<OrderResolutionStateType>> {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const message = `Starting resolution for order ${state.orderId} - ${state.orderDetails.customer}`;

    return {
        currentStep: 'resolving',
        stepMessages: [
            ...state.stepMessages,
            {
                step: 'resolving',
                message,
                timestamp: new Date().toISOString(),
            },
        ],
    };
}
