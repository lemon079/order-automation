import { z } from 'zod';

// Item schema
export const orderItemSchema = z.object({
    name: z.string().min(1, 'Item name is required'),
    quantity: z.number().int().positive('Quantity must be positive'),
    weight: z.number().positive().optional(),
    notes: z.string().optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Order status enum
export const orderStatusSchema = z.enum([
    'pending',
    'confirmed',
    'assigned',
    'picked_up',
    'in_transit',
    'delivered',
    'cancelled',
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

// Create order schema (for POST requests)
export const createOrderSchema = z.object({
    // Customer details
    customer_name: z.string().min(1, 'Customer name is required'),
    customer_phone: z.string().min(10, 'Valid phone number required'),
    customer_email: z.string().email().optional().or(z.literal('')),

    // Pickup location
    pickup_address: z.string().min(5, 'Pickup address is required'),
    pickup_lat: z.number().optional(),
    pickup_lng: z.number().optional(),
    pickup_contact_name: z.string().optional(),
    pickup_contact_phone: z.string().optional(),

    // Drop-off location
    dropoff_address: z.string().min(5, 'Drop-off address is required'),
    dropoff_lat: z.number().optional(),
    dropoff_lng: z.number().optional(),
    dropoff_contact_name: z.string().optional(),
    dropoff_contact_phone: z.string().optional(),

    // Items
    items: z.array(orderItemSchema).min(1, 'At least one item is required'),

    // Time windows
    pickup_time_window_start: z.string().datetime().optional(),
    pickup_time_window_end: z.string().datetime().optional(),
    dropoff_time_window_start: z.string().datetime().optional(),
    dropoff_time_window_end: z.string().datetime().optional(),

    // Notes
    special_instructions: z.string().optional(),
    internal_notes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Update order schema (for PATCH requests)
export const updateOrderSchema = createOrderSchema.partial().extend({
    status: orderStatusSchema.optional(),
    assigned_driver_id: z.string().uuid().optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

// Full order schema (from database)
export const orderSchema = createOrderSchema.extend({
    id: z.string().uuid(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    status: orderStatusSchema,
    assigned_driver_id: z.string().uuid().nullable().optional(),
});

export type Order = z.infer<typeof orderSchema>;
