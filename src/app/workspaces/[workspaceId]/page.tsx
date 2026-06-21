import { createServerAction } from "@/api/actions";
import { API, ApiVersion } from "@/api/API";
import { AppShell } from "@/components/app/appshell";
import { Client } from "./client";
import { ApiErrorScreen } from "@/components/screens/error";
import {
  Dto_Workspace_Get,
  Dto_Workspace_Vnc_CreateToken,
} from "@limespaces/shared";
import Link from "next/link";

interface IPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function Page(props: IPageProps) {
  const { workspaceId } = await props.params;

  const fetchWorkspace = async () => {
    "use server";

    return await API.get<Dto_Workspace_Get>(
      ApiVersion.v1,
      `/workspace/${workspaceId}`,
    );
  };

  const workspace = await fetchWorkspace();

  const fetchWorkspaceSA = createServerAction<{}, Dto_Workspace_Get>(
    async (_, resolve) => {
      "use server";

      const result = await fetchWorkspace();

      if (result.isOk) resolve.ok(result.data);
      else resolve.error(new Error(result.data.message));
    },
  );

  const powerWorkspaceSA = createServerAction<
    {
      action: "start" | "stop";
    },
    {}
  >(
    async (
      data: {
        action: "start" | "stop";
      },
      resolve,
    ) => {
      "use server";

      const result = await API.post<{}, {}>(
        ApiVersion.v1,
        `/workspace/${workspaceId}/power/${data.action}`,
        {},
      );

      if (result.isOk) resolve.ok(result.data);
      else resolve.error(new Error(result.data.message));
    },
  );

  if (!workspace.isOk) return <ApiErrorScreen error={workspace.data} />;

  const vnc = await API.post<Dto_Workspace_Vnc_CreateToken, {}>(
    ApiVersion.v1,
    `/workspace/${workspaceId}/vnc/token`,
    {},
  );

  if (!vnc.isOk) return <ApiErrorScreen error={vnc.data} />;

  return (
    <AppShell>
      <div className="p-16 flex flex-col gap-4">
        <Client
          workspace={workspace.data}
          fetchWorkspace={fetchWorkspaceSA}
          powerWorkspace={powerWorkspaceSA}
          vncToken={vnc.data.token}
        />

        <Link href={`/workspaces/${workspaceId}/remote`}>Open remote</Link>
      </div>
    </AppShell>
  );
}
