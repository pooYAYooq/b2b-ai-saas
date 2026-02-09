/**
 * ORPC Client Configuration
 *
 * Configures the client-side ORPC instance for making type-safe API calls.
 * This module provides:
 * - Router client with full type safety
 * - TanStack Query utilities for data fetching
 * - RPC link configuration for HTTP communication
 *
 * The client uses a fallback pattern to support both SSR and CSR:
 * - Server-side: Uses the global $client from orpc.server.ts
 * - Client-side: Creates a new client with RPCLink
 *
 * @module orpc-client
 *
 * @example
 * // Using with TanStack Query
 * import { orpc } from '@/lib/orpc';
 *
 * // In a React component
 * const { data } = useSuspenseQuery(orpc.workspace.list.queryOptions());
 *
 * @example
 * // Using mutations
 * const mutation = useMutation(
 *   orpc.workspace.create.mutationOptions({
 *     onSuccess: (data) => console.log(data)
 *   })
 * );
 */

import type { RouterClient } from "@orpc/server";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import { router } from "@/app/router";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

/**
 * RPC Link configuration for client-side HTTP requests.
 * Dynamically determines the RPC endpoint URL based on window.location.
 *
 * @throws Error if invoked on the server side (SSR)
 */
const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("RPCLink is not allowed on the server side.");
    }

    return `${window.location.origin}/rpc`;
  },
});

/**
 * ORPC Router Client
 *
 * Provides end-to-end type-safe API communication.
 * Falls back to client-side client if server-side client is not available.
 *
 * @type {RouterClient<typeof router>}
 */
export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);

/**
 * ORPC TanStack Query Utilities
 *
 * Provides query and mutation helper functions with automatic type inference.
 * Includes queryOptions() and mutationOptions() for each route.
 *
 * @example
 * const queryOptions = orpc.workspace.list.queryOptions();
 * const mutationOptions = orpc.workspace.create.mutationOptions();
 */
export const orpc = createTanstackQueryUtils(client);
