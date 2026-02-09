/**
 * TanStack Query Hydration Utilities
 *
 * Provides utilities for server-side query prefetching and client-side hydration.
 * Enables seamless data transfer from server components to client components.
 *
 * Key features:
 * - Cached QueryClient creation for consistency within a request
 * - HydrateClient wrapper for dehydrating server-fetched data to clients
 *
 * @module query-hydration
 *
 * @example
 * // In a Server Component
 * const queryClient = getQueryClient();
 * await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());
 *
 * return (
 *   <HydrateClient client={queryClient}>
 *     <ClientComponent />
 *   </HydrateClient>
 * );
 */

import { createQueryClient } from "./client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cache } from "react";

/**
 * Cached QueryClient getter for server components.
 *
 * Uses React's cache() to ensure the same QueryClient instance is used
 * throughout a single server request. This prevents duplicate queries
 * and maintains consistency.
 *
 * @returns {QueryClient} Cached QueryClient instance
 */
export const getQueryClient = cache(createQueryClient);

/**
 * HydrateClient Component
 *
 * Wraps client components to hydrate them with server-prefetched query data.
 * Automatically dehydrates the QueryClient state and passes it to the client.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Client components to hydrate
 * @param {QueryClient} props.client - QueryClient with prefetched data
 * @returns {JSX.Element} Hydration boundary wrapping children
 */
export function HydrateClient(props: {
  children: React.ReactNode;
  client: QueryClient;
}) {
  return (
    <HydrationBoundary state={dehydrate(props.client)}>
      {props.children}
    </HydrationBoundary>
  );
}
