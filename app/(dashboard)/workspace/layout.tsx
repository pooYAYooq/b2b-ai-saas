/**
 * WorkspaceLayout Component
 *
 * Persistent layout for all workspace pages. Provides a fixed sidebar with:
 * - WorkspaceList: Displays all user workspaces with color-coded avatars
 * - CreateWorkspace: Button to create new workspaces
 * - UserNav: User profile menu with account and billing options
 *
 * This is a Server Component that prefetches workspace data for optimal performance,
 * then hydrates it on the client for interactive components.
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child pages to render in the main content area
 * @returns {Promise<JSX.Element>} The workspace layout with sidebar and content area
 *
 * @example
 * // This layout wraps all pages under /workspace/*
 * // Next.js automatically applies it to the route group
 */

import React, { ReactNode } from "react";
import { WorkspaceList } from "./_components/WorkspaceList";
import { CreateWorkspace } from "./_components/CreateWorkspace";
import { UserNav } from "./_components/UserNav";
import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

const WorkspaceLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());

  return (
    <div className="flex w-full h-screen">
      <div className="flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border">
        {/* WorkspaceList component would be placed here */}
        <HydrateClient client={queryClient}>
          <WorkspaceList />
        </HydrateClient>
        <div className="mt-4">
          <CreateWorkspace />
        </div>
        <div className="mt-auto">
          {/* Additional sidebar items can be added here */}
          <HydrateClient client={queryClient}>
            <UserNav />
          </HydrateClient>
        </div>
      </div>
      {children}
    </div>
  );
};

export default WorkspaceLayout;
