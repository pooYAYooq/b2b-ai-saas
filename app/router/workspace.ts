/**
 * Workspace Router
 *
 * Defines ORPC routes for workspace/organization management.
 * All routes require authentication and workspace context via middleware.
 *
 * Routes:
 * - listWorkspaces: GET /workspace - Lists all user workspaces
 * - createWorkspace: POST /workspace - Creates a new workspace
 */

import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import { base } from "../middlewares/base";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { workspaceSchema } from "../schemas/workspace";
import { init, Organizations } from "@kinde/management-api-js";
import { standardSecurityMiddleware } from "../middlewares/arcjet/standard";
import { heavyWriteSecurityMiddleware } from "../middlewares/arcjet/heavy-write";

/**
 * List Workspaces Route
 *
 * Fetches all organizations/workspaces that the authenticated user has access to.
 * Returns workspace data along with user profile and current workspace context.
 *
 * @route GET /workspace
 * @access Protected - Requires authentication
 * @returns Array of workspaces with id, name, and avatar, plus user and current workspace data
 * @throws FORBIDDEN - If user has no organizations or authentication fails
 */
export const listWorkspaces = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "GET",
    path: "/workspace",
    summary: "list all workspaces",
    tags: ["workspaces"],
  })
  .input(z.void())
  .output(
    z.object({
      workspaces: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          avatar: z.string(),
        }),
      ),
      user: z.custom<KindeUser<Record<string, unknown>>>(),
      currentWorkspace: z.custom<KindeOrganization<unknown>>(),
    }),
  )
  .handler(async ({ context, errors }) => {
    const { getUserOrganizations } = getKindeServerSession();

    const organizations = await getUserOrganizations();

    if (!organizations) {
      throw errors.FORBIDDEN();
    }

    return {
      workspaces: organizations?.orgs.map((org) => ({
        id: org.code,
        name: org.name ?? "My Workspace",
        avatar: org.name?.charAt(0) ?? "W",
      })),
      user: context.user,
      currentWorkspace: context.workspace,
    };
  });

/**
 * Create Workspace Route
 *
 * Creates a new organization/workspace in Kinde Auth and assigns the current user
 * as an admin. After creation, refreshes the user's tokens to include the new organization.
 *
 * @route POST /workspace
 * @access Protected - Requires authentication
 * @param input - Workspace creation data (validated by workspaceSchema)
 * @param input.name - Name of the new workspace
 * @returns Object containing the new workspace orgCode and name
 * @throws FORBIDDEN - If organization creation fails or user assignment fails
 */
export const createWorkspace = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/workspace",
    summary: "Create a workspace",
    tags: ["workspaces"],
  })
  .input(workspaceSchema)
  .output(
    z.object({
      orgCode: z.string(),
      workspaceName: z.string(),
    }),
  )
  .handler(async ({ context, errors, input }) => {
    init();

    let data;

    try {
      data = await Organizations.createOrganization({
        requestBody: {
          name: input.name,
        },
      });
    } catch {
      throw errors.FORBIDDEN();
    }

    if (!data.organization?.code) {
      throw errors.FORBIDDEN({
        message: "Organization code is missing in the response",
      });
    }

    try {
      await Organizations.addOrganizationUsers({
        orgCode: data.organization.code,
        requestBody: {
          users: [
            {
              id: context.user.id,
              roles: ["admin"],
            },
          ],
        },
      });
    } catch {
      throw errors.FORBIDDEN();
    }

    const { refreshTokens } = getKindeServerSession();
    await refreshTokens();

    return {
      orgCode: data.organization.code,
      workspaceName: input.name,
    };
  });
