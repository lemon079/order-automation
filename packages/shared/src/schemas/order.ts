import { z } from "zod";

/**
 * Order Item Schema
 * Validates individual items in an order
 */
export const orderItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  weight: z.number().optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

/**
 * Create Order Schema
 * Validates order creation form data
 */
export const createOrderSchema = z.object({
  // Customer details
  customer_name: z.string().min(1, "Customer name is required"),
  customer_phone: z.string().min(1, "Customer phone is required"),
  customer_email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),

  // Pickup location
  pickup_address: z.string().min(1, "Pickup address is required"),
  pickup_contact_name: z.string().optional(),
  pickup_contact_phone: z.string().optional(),
  pickup_time_window_start: z.string().optional(),
  pickup_time_window_end: z.string().optional(),

  // Drop-off location
  dropoff_address: z.string().min(1, "Drop-off address is required"),
  dropoff_contact_name: z.string().optional(),
  dropoff_contact_phone: z.string().optional(),
  dropoff_time_window_start: z.string().optional(),
  dropoff_time_window_end: z.string().optional(),

  // Items
  items: z.array(orderItemSchema).min(1, "At least one item is required"),

  // Notes
  special_instructions: z.string().optional(),
  internal_notes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Update Order Schema
 * Validates order update form data (all fields optional for partial updates)
 */
export const updateOrderSchema = createOrderSchema.partial();

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
