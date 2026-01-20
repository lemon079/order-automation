import type { GetOrdersParams } from './api-types';

/**
 * Query Key Factory
 * Centralized query key management for React Query cache
 * 
 * Benefits:
 * - Type-safe query keys
 * - Easy cache invalidation
 * - Consistent naming across the app
 */

export const queryKeys = {
    /**
     * Orders query keys
     */
    orders: {
        // Base key for all orders queries
        all: ['orders'] as const,

        // Keys for list queries
        lists: () => [...queryKeys.orders.all, 'list'] as const,
        list: (params?: GetOrdersParams) =>
            [...queryKeys.orders.lists(), params ?? {}] as const,

        // Keys for detail queries
        details: () => [...queryKeys.orders.all, 'detail'] as const,
        detail: (id: string) =>
            [...queryKeys.orders.details(), id] as const,
    },

    // Future: Add more resource query keys here
    // drivers: { ... },
    // deliveries: { ... },
};

/**
 * Usage examples:
 * 
 * // Invalidate all orders queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
 * 
 * // Invalidate specific order list
 * queryClient.invalidateQueries({ queryKey: queryKeys.orders.list({ status: 'pending' }) });
 * 
 * // Invalidate specific order detail
 * queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail('123') });
 */
