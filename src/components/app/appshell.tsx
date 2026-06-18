import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

interface IAppShellProps {
  children: ReactNode | ReactNode[];
}

export function AppShell(props: IAppShellProps) {
  return (
    <div className="w-screen h-screen overflow-hidden p-2 bg-gray-50 flex flex-row">
      <Sidebar />
      <div className="w-full h-full overflow-x-hidden overflow-y-auto bg-white rounded-md border border-gray-200 ">
        {props.children}
      </div>
    </div>
  );
}
