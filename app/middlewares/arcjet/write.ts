import arcjet, { protectWithArcjet, slidingWindow } from "@/lib/arcjet";
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildWriteAj = () =>
  arcjet.withRule(
    slidingWindow({
      mode: "LIVE",
      interval: "1m", // 1 minute window
      max: 40, // Allow up to 40 requests per window
    }),
  );

/**
 * Write-security middleware.
 *
 * Applies a stricter Arcjet sliding-window rate limit for write operations.
 * If Arcjet is unavailable (missing key or transient runtime failure), requests continue
 * and downstream handlers remain available.
 */
export const writeSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await protectWithArcjet({
      client: buildWriteAj(),
      args: [context.request, { userId: context.user.id }],
      source: "writeSecurityMiddleware",
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
