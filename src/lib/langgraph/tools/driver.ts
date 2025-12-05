import { OrderResolutionStateType, DriverResultType } from '../state';

// Simulated driver pool
const availableDrivers = [
    { id: 'DRV-001', name: 'Ahmed Khan', vehicle: 'Motorcycle', available: true },
    { id: 'DRV-002', name: 'Sara Ali', vehicle: 'Car', available: true },
    { id: 'DRV-003', name: 'Hassan Malik', vehicle: 'Van', available: false },
    { id: 'DRV-004', name: 'Fatima Noor', vehicle: 'Motorcycle', available: true },
    { id: 'DRV-005', name: 'Usman Tariq', vehicle: 'Car', available: true },
];

/**
 * Find available drivers for order delivery
 */
export async function findAvailableDrivers(
    state: OrderResolutionStateType
): Promise<DriverResultType> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Find available drivers
    const drivers = availableDrivers.filter(d => d.available);

    if (drivers.length === 0) {
        throw new Error('No drivers available at the moment');
    }

    // Select best driver (in real app, would consider location, vehicle type, etc.)
    const orderValue = state.orderDetails.total;
    const selectedDriver = orderValue > 1000
        ? drivers.find(d => d.vehicle === 'Car' || d.vehicle === 'Van') || drivers[0]
        : drivers[0];

    // Calculate estimated arrival (simulated)
    const distance = Math.round(Math.random() * 10 + 2); // 2-12 km
    const estimatedArrival = Math.round(distance * 3 + 10); // rough estimate

    return {
        driverId: selectedDriver.id,
        driverName: selectedDriver.name,
        vehicleType: selectedDriver.vehicle,
        estimatedArrival,
        distance,
    };
}

/**
 * Assign driver to order
 */
export async function assignDriverToOrder(
    orderId: string,
    driverId: string
): Promise<boolean> {
    // Simulate assignment
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Assigned driver ${driverId} to order ${orderId}`);
    return true;
}
