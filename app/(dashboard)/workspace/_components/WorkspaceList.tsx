import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function WorkspaceList() {
  const workspaces = [
    { id: "1", name: "Nexus", initials: "Ne" },
    { id: "2", name: "Acme Corp", initials: "AC" },
    { id: "3", name: "Globex", initials: "Gl" },
    { id: "4", name: "Initech", initials: "In" },
  ];

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        {workspaces.map((workspace) => (
          <Tooltip key={workspace.id}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="size-12 transition-all duration-300"
              >
                <span className="text-sm font-semibold">
                  {workspace.initials}
                </span>
              </Button>
            </TooltipTrigger>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
