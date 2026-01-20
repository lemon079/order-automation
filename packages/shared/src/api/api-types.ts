import type { Order, OrderStatus, CreateOrderInput, UpdateOrderInput } from '../schemas/order';

/**
 * API Request & Response Types
 * Centralized type definitions for all API endpoints
 */

// ==========================
// Orders API Types
// ==========================

export interface GetOrdersParams {
    status?: OrderStatus;
    limit?: number;
    offset?: number;
}

export interface GetOrdersResponse {
    orders: Order[];
    total: number;
    limit: number;
    offset: number;
}

export interface CreateOrderRequest extends CreateOrderInput { }

export interface CreateOrderResponse extends Order { }

export interface UpdateOrderRequest extends UpdateOrderInput { }

export interface UpdateOrderResponse extends Order { }

export interface GetOrderByIdResponse extends Order { }

// ==========================
// Error Response Types
// ==========================

export interface ApiErrorResponse {
    error: string;
    details?: any;
}

export interface ApiError {
    status: number;
    message: string;
    details?: any;
}
