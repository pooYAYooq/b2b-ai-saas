/**
 * Base ORPC Middleware
 *
 * Provides the foundational ORPC server configuration with:
 * - Request context typing
 * - Standard error definitions for consistent API error handling
 *
 * All ORPC routes should extend this base middleware to inherit
 * common error types and request context.
 *
 * Available error types:
 * - RATE_LIMIT: API rate limit exceeded
 * - BAD_REQUEST: Invalid request data or parameters
 * - NOT_FOUND: Resource not found
 * - FORBIDDEN: Insufficient permissions
 * - UNAUTHORIZED: Authentication required
 * - INTERNAL_SERVER_ERROR: Unexpected server error
 *
 * @example
 * import { base } from '../middlewares/base';
 *
 * export const myRoute = base
 *   .route({ method: 'GET', path: '/my-endpoint' })
 *   .handler(async ({ errors }) => {
 *     throw errors.NOT_FOUND(); // Consistent error handling
 *   });
 */

import { os } from "@orpc/server";

export const base = os.$context<{ request: Request }>().errors({
  RATE_LIMITED: {
    message: " You have reached your rate limit for this endpoint.",
  },
  BAD_REQUEST: {
    message: "Bad request.",
  },
  NOT_FOUND: {
    message: "Not found.",
  },
  FORBIDDEN: {
    message: "Forbidden.",
  },
  UNAUTHORIZED: {
    message: "Unauthorized.",
  },
  INTERNAL_SERVER_ERROR: {
    message: "Internal server error.",
  },
});
