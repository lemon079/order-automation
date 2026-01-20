import { OrderResolutionStateType } from '../state';
import { findAvailableDrivers, assignDriverToOrder } from '../tools/driver';

/**
 * Find and assign an available driver
 */
export async function assignDriverNode(
    state: OrderResolutionStateType
): Promise<Partial<OrderResolutionStateType>> {
    try {
        const driverResult = await findAvailableDrivers(state);

        // Assign the driver to the order
        await assignDriverToOrder(state.orderId, driverResult.driverId);

        const message = `✓ Driver assigned: ${driverResult.driverName} (${driverResult.vehicleType}). ETA: ~${driverResult.estimatedArrival} min, Distance: ${driverResult.distance} km`;

        return {
            currentStep: 'assigning_driver',
            driverResult,
            stepMessages: [
                ...state.stepMessages,
                {
                    step: 'assigning_driver',
                    message,
                    timestamp: new Date().toISOString(),
                },
            ],
        };
    } catch (error) {
        return {
            currentStep: 'error',
            error: error instanceof Error ? error.message : 'Driver assignment failed',
            stepMessages: [
                ...state.stepMessages,
                {
                    step: 'error',
                    message: `Driver assignment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    timestamp: new Date().toISOString(),
                },
            ],
        };
    }
}
