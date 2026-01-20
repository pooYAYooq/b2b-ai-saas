import React, { ReactNode } from "react";
import { WorkspaceList } from "./_components/WorkspaceList";
import { CreateWorkspace } from "./_components/CreateWorkspace";
import { UserNav } from "./_components/UserNav";

const WorkspaceLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full h-screen">
      <div className="flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border">
        {/* WorkspaceList component would be placed here */}
        <WorkspaceList />
        <div className="mt-4">
          <CreateWorkspace />
        </div>
        <div className="mt-auto">
          {/* Additional sidebar items can be added here */}
          <UserNav />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
