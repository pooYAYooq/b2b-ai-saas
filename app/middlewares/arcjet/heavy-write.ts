import arcjet, { protectWithArcjet, slidingWindow } from "@/lib/arcjet";
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const heavyWriteAjRule = slidingWindow({
  mode: "LIVE",
  interval: "1m", // 1 minute window
  max: 2, // Allow up to 2 requests per window
});

/**
 * Heavy-write security middleware.
 *
 * Applies the most restrictive Arcjet sliding-window policy for sensitive write actions.
 * If Arcjet is unavailable (missing key or transient runtime failure), requests continue
 * and downstream handlers remain available.
 */
export const heavyWriteSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await protectWithArcjet({
      client: arcjet.withRule(heavyWriteAjRule),
      args: [context.request, { userId: context.user.id }],
      source: "heavyWriteSecurityMiddleware",
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
