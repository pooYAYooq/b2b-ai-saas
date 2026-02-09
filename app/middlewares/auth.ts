/**
 * Authentication Middleware
 *
 * ORPC middleware that enforces user authentication for protected routes.
 * Checks if a valid Kinde session exists and adds user data to the route context.
 *
 * Behavior:
 * - If user is authenticated: Allows request to proceed and adds user to context
 * - If user is not authenticated: Redirects to Kinde Auth login page
 *
 * The middleware uses Kinde's server session to verify authentication state.
 * User data from Kinde is added to the context for use in route handlers.
 *
 * @example
 * import { requiredAuthMiddleware } from '../middlewares/auth';
 *
 * export const protectedRoute = base
 *   .use(requiredAuthMiddleware)
 *   .handler(async ({ context }) => {
 *     // context.user is now available and guaranteed to exist
 *     console.log(context.user.id);
 *   });
 */

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { base } from "./base";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const requiredAuthMiddleware = base
  .$context<{
    session?: { user?: KindeUser<Record<string, unknown>> };
  }>()
  .middleware(async ({ context, next }) => {
    const session = context.session ?? (await getSession());

    if (!session.user) {
      return redirect("/api/auth/login");
    }
    return next({
      context: { user: session.user },
    });
  });

/**
 * Fetches the current Kinde session from server-side context.
 * Internal helper function for authentication middleware.
 *
 * @returns Session object containing user data if authenticated
 */
const getSession = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return {
    user,
  };
};
