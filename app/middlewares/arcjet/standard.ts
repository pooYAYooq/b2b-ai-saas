import arcjet, { detectBot, shield } from "@/lib/arcjet";
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

/**
 * Builds an Arcjet instance with a standard set of rules for Kinde API.
 *
 * This instance is configured with the following rules:
 * - Shield rule with mode "LIVE", which blocks all requests except for those with known user agents.
 * - Detect Bot rule with mode "LIVE", which allows requests from search engines, preview crawlers, and monitoring tools.
 *
 * This instance is suitable for use on most Kinde API endpoints.
 */
const buildStandardAj = () =>
  arcjet.withRule(shield({ mode: "LIVE" })).withRule(
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW", "CATEGORY:MONITOR"],
    }),
  );

export const standardSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildStandardAj().protect(context.request, {
      userId: context.user.id,
    });
    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        throw errors.FORBIDDEN({
          message: "Access denied: Automated traffic is not allowed.",
        });
      }
      if (decision.reason.isShield()) {
        throw errors.FORBIDDEN({
          message:
            "Access denied: Suspicious activity detected. Please try again later.",
        });
      }

      throw errors.FORBIDDEN({
        message: "Access denied: Your request was blocked by security rules.",
      });
    }
    return next();
  });
