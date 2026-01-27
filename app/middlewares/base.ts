import { os } from "@orpc/server";

export const base = os.$context<{ request: Request }>().errors({
  RATE_LIMIT: {
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
