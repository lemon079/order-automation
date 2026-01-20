import { QueryClient } from '@tanstack/react-query';

/**
 * Create a pre-configured QueryClient with sensible defaults
 * Use this factory to ensure consistent configuration across web and mobile apps
 */
export function createQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Cache data for 5 minutes
                staleTime: 5 * 60 * 1000,

                // Keep unused data in cache for 10 minutes
                gcTime: 10 * 60 * 1000,

                // Don't refetch on window focus by default
                refetchOnWindowFocus: false,

                // Retry failed requests once
                retry: 1,

                // Retry delay: 1 second
                retryDelay: 1000,
            },
            mutations: {
                // Retry failed mutations once
                retry: 1,
            },
        },
    });
}
