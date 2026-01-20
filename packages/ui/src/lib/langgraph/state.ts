import * as z from 'zod';

// Step statuses for the workflow
export const WorkflowStep = z.enum([
    'idle',
    'resolving',
    'checking_warehouse',
    'assigning_driver',
    'dispatching',
    'completed',
    'error'
]);

export type WorkflowStepType = z.infer<typeof WorkflowStep>;

// Warehouse check result
export const WarehouseResult = z.object({
    available: z.boolean(),
    stockLevel: z.number(),
    location: z.string(),
    estimatedPrepTime: z.number(), // minutes
});

export type WarehouseResultType = z.infer<typeof WarehouseResult>;

// Driver assignment result
export const DriverResult = z.object({
    driverId: z.string(),
    driverName: z.string(),
    vehicleType: z.string(),
    estimatedArrival: z.number(), // minutes
    distance: z.number(), // km
});

export type DriverResultType = z.infer<typeof DriverResult>;

// Main workflow state
export const OrderResolutionState = z.object({
    // Input
    orderId: z.string(),
    orderDetails: z.object({
        customer: z.string(),
        items: z.number(),
        total: z.number(),
        address: z.string(),
    }),

    // Progress tracking
    currentStep: WorkflowStep,
    stepMessages: z.array(z.object({
        step: WorkflowStep,
        message: z.string(),
        timestamp: z.string(),
    })),

    // Results from each step
    warehouseResult: WarehouseResult.optional(),
    driverResult: DriverResult.optional(),

    // Error handling
    error: z.string().optional(),

    // Final status
    dispatchConfirmed: z.boolean(),
    estimatedDeliveryTime: z.string().optional(),
});

export type OrderResolutionStateType = z.infer<typeof OrderResolutionState>;

// Initial state factory
export function createInitialState(
    orderId: string,
    orderDetails: OrderResolutionStateType['orderDetails']
): OrderResolutionStateType {
    return {
        orderId,
        orderDetails,
        currentStep: 'idle',
        stepMessages: [],
        dispatchConfirmed: false,
    };
}
