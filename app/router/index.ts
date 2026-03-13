/**
 * oRPC Router
 *
 * Central router configuration that aggregates all API routes.
 * This router is consumed by both server and client ORPC instances
 * to provide end-to-end type safety.
 *
 * Available routes:
 * - workspace.list: GET /workspace - List all user workspaces
 * - workspace.create: POST /workspace - Create a new workspace
 *
 * @example
 * // Client usage
 * import { orpc } from '@/lib/orpc';
 * const { data } = await orpc.workspace.list.query();
 *
 * @example
 * // Server usage with TanStack Query
 * await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());
 */

// import individual route handlers from their modules
import { createChannel, listChannels } from "./channel";
import { createWorkspace, listWorkspaces } from "./workspace";

// assembled router object exposing grouped routes for clients and server
export const router = {
  workspace: {
    // GET /workspace
    list: listWorkspaces,
    // POST /workspace
    create: createWorkspace,
  },

  channel: {
    // POST /channel (or similar depending on handler)
    create: createChannel,

    //
    list: listChannels,
  },
};
