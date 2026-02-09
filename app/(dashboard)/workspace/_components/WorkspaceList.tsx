"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { useSuspenseQuery } from "@tanstack/react-query";

const colorCombinations = [
  "bg-blue-500 hover:bg-blue-600 text-white",
  "bg-purple-500 hover:bg-purple-600 text-white",
  "bg-amber-500 hover:bg-amber-600 text-white",
  "bg-rose-500 hover:bg-rose-600 text-white",
  "bg-indigo-500 hover:bg-indigo-600 text-white",
  "bg-emerald hover:bg-emerald-600 text-white",
  "bg-cyan-500 hover:bg-cyan-600 text-white",
  "bg-lime-500 hover:bg-lime-600 text-white",
];
export function WorkspaceList() {
  /**
   * Returns a color combination string based on the given id.
   * The color combination is derived from the sum of the ASCII
   * values of the characters in the id.
   * The sum is used as an index to select a color combination
   * from the array of color combinations.
   * @param {string} id - the id to generate a color combination for
   * @returns {string} - the color combination string
   */
  const getWorkspaceColor = (id: string) => {
    const charSum = id
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = charSum % colorCombinations.length;
    return colorCombinations[colorIndex];
  };

  const {
    data: { workspaces, currentWorkspace },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        {workspaces.map((workspace) => {
          const isActive = currentWorkspace.orgCode === workspace.id;
          return (
            <Tooltip key={workspace.id}>
              <TooltipTrigger asChild>
                <LoginLink orgCode={workspace.id}>
                  <Button
                    size="icon"
                    className={cn(
                      "size-12 transition-all duration-300",
                      getWorkspaceColor(workspace.id),
                      isActive
                        ? "underline underline-offset-4 rounded-lg"
                        : "rounded-xl hover:rounded-lg",
                    )}
                  >
                    <span className="text-sm font-semibold">
                      {workspace.avatar}
                    </span>
                  </Button>
                </LoginLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>
                  {workspace.name} {isActive && "(Active)"}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
