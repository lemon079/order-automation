'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from '@repo/shared';
import { useState } from 'react';

/**
 * Client-side providers wrapper for React Query
 * This ensures each request gets its own QueryClient instance
 */
export function Providers({ children }: { children: React.ReactNode }) {
    // Create a QueryClient instance per component mount
    // This prevents sharing state between requests in Next.js
    const [queryClient] = useState(() => createQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* React Query DevTools - only in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
