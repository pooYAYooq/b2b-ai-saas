/**
 * Workspace Middleware
 *
 * ORPC middleware that ensures the user has an active workspace/organization context.
 * This middleware should be used on routes that require workspace-scoped operations.
 *
 * Behavior:
 * - If workspace context exists: Adds workspace/organization data to route context
 * - If no workspace context: Throws FORBIDDEN error
 *
 * The middleware fetches the current organization from Kinde Auth.
 * This is essential for multi-tenant operations where actions are scoped to a workspace.
 *
 * @example
 * import { requiredWorkspaceMiddleware } from '../middlewares/workspace';
 *
 * export const workspaceScopedRoute = base
 *   .use(requiredAuthMiddleware)
 *   .use(requiredWorkspaceMiddleware)
 *   .handler(async ({ context }) => {
 *     // context.workspace is now available
 *     console.log(context.workspace.orgCode);
 *   });
 */

import { KindeOrganization } from "@kinde-oss/kinde-auth-nextjs";
import { base } from "./base";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const requiredWorkspaceMiddleware = base
  .$context<{
    workspace?: KindeOrganization<unknown | null>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const workspace = context.workspace ?? (await getWorkspace());

    if (!workspace) {
      throw errors.FORBIDDEN();
    }
    return next({
      context: { workspace },
    });
  });

/**
 * Fetches the current organization/workspace from Kinde Auth.
 * Internal helper function for workspace middleware.
 *
 * @returns Organization object containing workspace data if available
 */
const getWorkspace = async () => {
  const { getOrganization } = getKindeServerSession();
  const organization = await getOrganization();

  return organization;
};
