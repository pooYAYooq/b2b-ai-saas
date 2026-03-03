import z from "zod";

export function transformChannelName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special characters except hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export const channelNameSchema = z.object({
  name: z
    .string()
    .min(2, "Channel name must be at least 2 characters")
    .max(50, "Channel name must be at most 50 characters")
    .transform((name, ctx) => {
      const transformed = transformChannelName(name);

      if (transformed.length < 2) {
        ctx.addIssue({
          code: "custom",
          message:
            "Channel name must contain at least 2 valid characters after transformation",
        });
        return z.NEVER;
      }

      if (transformed.length > 50) {
        ctx.addIssue({
          code: "custom",
          message:
            "Channel name must contain at most 50 valid characters after transformation",
        });
        return z.NEVER;
      }
      return transformed;
    }),
});
