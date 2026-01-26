import { os } from "@orpc/server";
import { z } from "zod";
export const listWorkspaces = os
  .route({
    method: "GET",
    path: "/workspace",
    summary: "list all workspaces",
    tags: ["workspaces"],
  })
  .input(z.void())
  .output(z.void())
  .handler(async ({ input }) => {
    console.log(input);
  });
