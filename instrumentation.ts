/**
 * Conditionally registers the ORPC server, if runtime compatibility issues are encountered.
 *
 * This function is a no-op if the runtime is not Next.js.
 *
 * @returns {Promise<void>}
 */
export async function register() {
  // Conditionally import if facing runtime compatibility issues
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/orpc.server");
  }
}
