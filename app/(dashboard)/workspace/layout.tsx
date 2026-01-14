import React, { ReactNode } from "react";
import { WorkspaceList } from "./_components/WorkspaceList";

const WorkspaceLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full h-screen">
      <div className="flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border">
        {/* WorkspaceList component would be placed here */}
        <WorkspaceList />
      </div>
    </div>
  );
};

export default WorkspaceLayout;
