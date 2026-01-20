import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { queryKeys } from '../query-keys';
import type {
    GetOrdersParams,
    GetOrdersResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    UpdateOrderRequest,
    UpdateOrderResponse,
    GetOrderByIdResponse,
} from '../api-types';

/**
 * Fetch all orders with optional filters
 * @param params - Optional filters (status, limit, offset)
 * @returns Query result with orders data
 */
export function useOrders(params?: GetOrdersParams): UseQueryResult<GetOrdersResponse, Error> {
    return useQuery({
        queryKey: queryKeys.orders.list(params),
        queryFn: async () => {
            const response = await apiClient.get<GetOrdersResponse>('/api/orders', {
                params,
            });
            return response.data;
        },
    });
}

/**
 * Fetch a single order by ID
 * @param id - Order ID
 * @param enabled - Whether the query should run (defaults to true)
 * @returns Query result with order data
 */
export function useOrder(
    id: string,
    enabled: boolean = true
): UseQueryResult<GetOrderByIdResponse, Error> {
    return useQuery({
        queryKey: queryKeys.orders.detail(id),
        queryFn: async () => {
            const response = await apiClient.get<GetOrderByIdResponse>(`/api/orders/${id}`);
            return response.data;
        },
        enabled: enabled && !!id,
    });
}

/**
 * Create a new order
 * @returns Mutation result with mutate/mutateAsync functions
 */
export function useCreateOrder(): UseMutationResult<
    CreateOrderResponse,
    Error,
    CreateOrderRequest,
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (orderData: CreateOrderRequest) => {
            const response = await apiClient.post<CreateOrderResponse>('/api/orders', orderData);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate all order lists to refetch with new data
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
        },
    });
}

/**
 * Update an existing order
 * @returns Mutation result with mutate/mutateAsync functions
 */
export function useUpdateOrder(): UseMutationResult<
    UpdateOrderResponse,
    Error,
    { id: string; data: UpdateOrderRequest },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateOrderRequest }) => {
            const response = await apiClient.patch<UpdateOrderResponse>(`/api/orders/${id}`, data);
            return response.data;
        },
        onSuccess: (_data, variables) => {
            // Invalidate both the specific order and the lists
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
        },
    });
}

/**
 * Delete an order
 * @returns Mutation result with mutate/mutateAsync functions
 */
export function useDeleteOrder(): UseMutationResult<void, Error, string, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/api/orders/${id}`);
        },
        onSuccess: (_, id) => {
            // Remove from cache and invalidate lists
            queryClient.removeQueries({ queryKey: queryKeys.orders.detail(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
        },
    });
}
