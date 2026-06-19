import { API, ApiVersion } from "@/api/API";
import { AppShell } from "@/components/app/appshell";
import {
  WorkspaceCreateRequestDto,
  Dto_Workspace_Create,
} from "@limespaces/shared";
import { CreateWorkspaceForm } from "./client";
import { createServerAction } from "@/api/actions";

export default async function Page() {
  const createWorkspace = createServerAction<FormData, Dto_Workspace_Create>(
    async (data, resolve) => {
      "use server";

      const name = data.get("name") as string;

      const response = await API.post<
        Dto_Workspace_Create,
        WorkspaceCreateRequestDto
      >(ApiVersion.v1, "/workspace", {
        name,
      });

      if (response.isOk) resolve.ok(response.data);
      else resolve.error(new Error(response.data.message));
    },
  );

  return (
    <AppShell>
      <div className="p-16">
        <h1 className="text-2xl font-outfit">New workspace</h1>

        <CreateWorkspaceForm createWorkspace={createWorkspace} />
      </div>
    </AppShell>
  );
}
