import arcjet, { protectWithArcjet, slidingWindow } from "@/lib/arcjet";
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildReadAj = () =>
  arcjet.withRule(
    slidingWindow({
      mode: "LIVE",
      interval: "1m", // 1 minute window
      max: 180, // Allow up to 180 requests per window
    }),
  );

/**
 * Read-security middleware.
 *
 * Applies a higher-throughput Arcjet sliding-window rate limit for read operations.
 * If Arcjet is unavailable (missing key or transient runtime failure), requests continue
 * and downstream handlers remain available.
 */
export const readSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await protectWithArcjet({
      client: buildReadAj(),
      args: [context.request, { userId: context.user.id }],
      source: "readSecurityMiddleware",
    });

    if (!decision) {
      return next();
    }

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw errors.RATE_LIMITED({
          message: "Too many requests: Please slow down and try again later.",
        });
      }

      throw errors.FORBIDDEN({
        message: "Access denied: Your request was blocked by security rules.",
      });
    }
    return next();
  });
