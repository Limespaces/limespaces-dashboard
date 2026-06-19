import { API, ApiVersion } from "@/api/API";
import { AppShell } from "@/components/app/appshell";
import { ApiErrorScreen } from "@/components/screens/error";
import { WorkspaceResponseDto } from "@limespaces/shared";

export default async function Page() {
  const workspaces = await API.get<WorkspaceResponseDto[]>(
    ApiVersion.v1,
    "/workspace",
  );

  if (!workspaces.isOk) return <ApiErrorScreen error={workspaces.data} />;

  console.log(workspaces);

  return (
    <AppShell>
      <div className="p-16">
        <h1 className="text-2xl font-outfit">Workspaces</h1>
        <div>
          {workspaces.data.map((workspace) => (
            <div key={workspace.id}>
              <p>{workspace.name}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
