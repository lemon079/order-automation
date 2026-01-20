import { OrderResolutionStateType } from '../state';
import { checkWarehouseInventory } from '../tools/warehouse';

/**
 * Check warehouse inventory and reserve items
 */
export async function checkWarehouseNode(
    state: OrderResolutionStateType
): Promise<Partial<OrderResolutionStateType>> {
    try {
        const warehouseResult = await checkWarehouseInventory(state);

        const message = `✓ Items available at ${warehouseResult.location}. Stock: ${warehouseResult.stockLevel} units. Prep time: ~${warehouseResult.estimatedPrepTime} min`;

        return {
            currentStep: 'checking_warehouse',
            warehouseResult,
            stepMessages: [
                ...state.stepMessages,
                {
                    step: 'checking_warehouse',
                    message,
                    timestamp: new Date().toISOString(),
                },
            ],
        };
    } catch (error) {
        return {
            currentStep: 'error',
            error: error instanceof Error ? error.message : 'Warehouse check failed',
            stepMessages: [
                ...state.stepMessages,
                {
                    step: 'error',
                    message: `Warehouse check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    timestamp: new Date().toISOString(),
                },
            ],
        };
    }
}
