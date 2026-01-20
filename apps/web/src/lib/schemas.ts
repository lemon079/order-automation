import { z } from 'zod';

export const createOrderSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    customerAddress: z.string().min(1, "Address is required"),
    customerPhone: z.string().optional(),
    items: z.array(z.any()), // Refine this based on item structure
    totalAmount: z.number().min(0),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'PREPARING', 'READY_FOR_DISPATCH', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
});

export const assignDriverSchema = z.object({
    driverId: z.string().uuid(),
});

export const updateLocationSchema = z.object({
    lat: z.number(),
    lng: z.number(),
});
