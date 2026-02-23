import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
} from "@arcjet/next";

/**
 * Arcjet site key used by the shared Arcjet client.
 *
 * `trim()` prevents false positives from accidental whitespace-only values.
 */
const arcjetKey = process.env.ARCJET_KEY?.trim();

/**
 * Indicates whether Arcjet is correctly configured in the current runtime.
 */
export const isArcjetConfigured = Boolean(arcjetKey);

let hasLoggedMissingKeyWarning = false;

const logMissingKeyWarning = () => {
  if (hasLoggedMissingKeyWarning || process.env.NODE_ENV === "test") {
    return;
  }

  hasLoggedMissingKeyWarning = true;
  console.warn(
    "[Arcjet] ARCJET_KEY is missing. Security checks are bypassed until the environment variable is configured.",
  );
};

// Re-export the rules to simplify imports inside handlers
export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};

// Create a base Arcjet instance for use by each handler
export default arcjet({
  // Get your site key from https://app.arcjet.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
  key: arcjetKey ?? "arcjet-key-missing",
  characteristics: ["userId"],
  rules: [
    // You can include one or more rules base rules. We don't include any here
    // so they can be set on each sub-page for the demo.
  ],
});

type ArcjetClient = {
  protect: (...args: never[]) => Promise<unknown>;
};

/**
 * Runs Arcjet protection in a fail-safe way.
 *
 * Behavior:
 * - If `ARCJET_KEY` is missing, logs one warning (outside tests) and gracefully bypasses Arcjet.
 * - If Arcjet throws for a specific request, logs contextual diagnostics and bypasses Arcjet only for that request.
 * - Otherwise, returns the Arcjet decision so middleware can enforce deny/allow rules.
 *
 * Returning `null` intentionally represents "Arcjet unavailable" and enables middleware-level
 * graceful degradation while keeping all enforcement logic centralized and DRY.
 */
export const protectWithArcjet = async <TClient extends ArcjetClient>({
  client,
  args,
  source,
}: {
  client: TClient;
  args: Parameters<TClient["protect"]>;
  source: string;
}): Promise<Awaited<ReturnType<TClient["protect"]>> | null> => {
  if (!isArcjetConfigured) {
    logMissingKeyWarning();
    return null;
  }

  try {
    return (await client.protect(...args)) as Awaited<
      ReturnType<TClient["protect"]>
    >;
  } catch (error) {
    console.error(
      `[Arcjet] Protection failed in ${source}. Continuing without Arcjet for this request.`,
      error,
    );

    return null;
  }
};
