import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          // Do not retry client errors (400–499) except 429
          if (status && status >= 400 && status < 500 && status !== 429) {
            return false;
          }
        }

        return failureCount < 2; // retry maximum 2 times
      },

      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // exponential backoff
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes (old cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
