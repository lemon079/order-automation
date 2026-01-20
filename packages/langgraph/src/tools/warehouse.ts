import { OrderResolutionStateType, WarehouseResultType } from '../state';

// Simulated warehouse data
const warehouseLocations = [
    { id: 'WH-001', name: 'Downtown Warehouse', stockLevel: 150 },
    { id: 'WH-002', name: 'North District Hub', stockLevel: 89 },
    { id: 'WH-003', name: 'Airport Logistics', stockLevel: 234 },
];

/**
 * Check warehouse inventory for order fulfillment
 */
export async function checkWarehouseInventory(
    state: OrderResolutionStateType
): Promise<WarehouseResultType> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Find a warehouse with sufficient stock
    const requiredItems = state.orderDetails.items;
    const availableWarehouse = warehouseLocations.find(
        wh => wh.stockLevel >= requiredItems
    );

    if (!availableWarehouse) {
        throw new Error('No warehouse has sufficient stock');
    }

    // Calculate prep time based on order size
    const estimatedPrepTime = Math.ceil(requiredItems * 2.5);

    return {
        available: true,
        stockLevel: availableWarehouse.stockLevel,
        location: availableWarehouse.name,
        estimatedPrepTime,
    };
}

/**
 * Reserve items in warehouse
 */
export async function reserveWarehouseItems(
    orderId: string,
    items: number,
    warehouseLocation: string
): Promise<boolean> {
    // Simulate reservation
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Reserved ${items} items at ${warehouseLocation} for order ${orderId}`);
    return true;
}
