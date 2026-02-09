/**
 * TanStack Query Client Configuration
 *
 * Creates and configures the QueryClient for TanStack Query with:
 * - Custom serialization/deserialization for SSR hydration
 * - Query key hashing for cache management
 * - Stale time configuration to prevent immediate refetching
 * - Server-side pending query dehydration
 *
 * The serializer handles complex data types (Date, Map, Set, etc.) that
 * need special handling when transferring from server to client.
 *
 * @module query-client
 *
 * @example
 * import { createQueryClient } from '@/lib/query/client';
 *
 * const queryClient = createQueryClient();
 */

import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import { serializer } from "../serializer";

/**
 * Creates a new QueryClient instance with custom configuration.
 *
 * Configuration includes:
 * - 60 second stale time to reduce unnecessary refetches
 * - Custom query key hashing using SuperJSON serializer
 * - Automatic dehydration of pending queries for SSR
 * - Data serialization for server-to-client hydration
 *
 * @returns {QueryClient} Configured QueryClient instance
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey);
          return JSON.stringify({ json, meta });
        },
        staleTime: 60 * 1000, // > 0 to prevent immediate refetching on mount
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        serializeData(data) {
          const [json, meta] = serializer.serialize(data);
          return { json, meta };
        },
      },
      hydrate: {
        deserializeData(data) {
          return serializer.deserialize(data.json, data.meta);
        },
      },
    },
  });
}
