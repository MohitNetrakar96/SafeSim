import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// Configure React Query client with retry logic and defaults
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                // Don't retry on 4xx errors
                if (error instanceof Error && error.message.includes('404')) {
                    return false;
                }
                // Retry up to 3 times with exponential backoff
                return failureCount < 3;
            },
            retryDelay: (attemptIndex) => {
                // Exponential backoff: 1s, 2s, 4s
                return Math.min(1000 * 2 ** attemptIndex, 30000);
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
            retryDelay: 1000,
        },
    },
});

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}

export { queryClient };
