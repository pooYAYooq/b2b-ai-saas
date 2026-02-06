/**
 * Workspace Schema
 *
 * Defines validation rules and TypeScript types for workspace data.
 * Used across the application for form validation, API requests, and type safety.
 */

import { z } from "zod";

/**
 * Workspace validation schema
 *
 * Validates workspace data structure with the following rules:
 * - name: 2-50 characters (ensures meaningful names and prevents UI overflow)
 */
export const workspaceSchema = z.object({
  name: z.string().min(2).max(50),
});

/**
 * TypeScript type inferred from workspace schema
 * Automatically stays in sync with schema changes
 */
export type WorkspaceSchemaType = z.infer<typeof workspaceSchema>;
