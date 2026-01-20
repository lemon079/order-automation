import { OrderResolutionStateType } from '../state';

/**
 * Final node - Confirm dispatch and calculate delivery time
 */
export async function confirmDispatchNode(
    state: OrderResolutionStateType
): Promise<Partial<OrderResolutionStateType>> {
    // Simulate final processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Calculate estimated delivery time
    const warehousePrepTime = state.warehouseResult?.estimatedPrepTime || 15;
    const driverArrivalTime = state.driverResult?.estimatedArrival || 30;
    const totalMinutes = warehousePrepTime + driverArrivalTime;

    const deliveryDate = new Date();
    deliveryDate.setMinutes(deliveryDate.getMinutes() + totalMinutes);

    const message = `🚀 Order dispatched! Estimated delivery: ${deliveryDate.toLocaleTimeString()} (${totalMinutes} min from now)`;

    return {
        currentStep: 'completed',
        dispatchConfirmed: true,
        estimatedDeliveryTime: deliveryDate.toISOString(),
        stepMessages: [
            ...state.stepMessages,
            {
                step: 'completed',
                message,
                timestamp: new Date().toISOString(),
            },
        ],
    };
}
