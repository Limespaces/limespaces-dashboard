import { API, ApiVersion } from "@/api/API";
import { AppShell } from "@/components/app/appshell";
import { ApiErrorScreen } from "@/components/screens/error";
import { translateWorkspaceState } from "@/lang/workspace";
import { Dto_Workspace_GetAll } from "@limespaces/shared";
import Link from "next/link";

export default async function Page() {
  const workspaces = await API.get<Dto_Workspace_GetAll[]>(
    ApiVersion.v1,
    "/workspace",
  );

  if (!workspaces.isOk) return <ApiErrorScreen error={workspaces.data} />;

  return (
    <AppShell>
      <div className="p-16 flex flex-col gap-4">
        <h1 className="text-2xl font-outfit">Workspaces</h1>
        <div className="grid grid-cols-3 gap-2">
          {workspaces.data.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/workspaces/${workspace.id}`}
              className="w-full flex grow shadow-sm border border-gray-100 rounded-md p-4 flex-col gap-px group cursor-pointer hover:border-green-700 transition-colors duration-200"
            >
              <p className="group-hover:text-green-700 transition-colors duration-200">
                {workspace.name}
              </p>
              <p className="text-xs text-gray-400">
                {
                  // TODO: Add docker state?
                  translateWorkspaceState(
                    workspace.workspaceContainer?.state!,
                    "",
                  )
                }
              </p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
