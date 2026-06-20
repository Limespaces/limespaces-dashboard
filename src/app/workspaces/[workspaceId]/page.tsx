import { createServerAction } from "@/api/actions";
import { API, ApiVersion } from "@/api/API";
import { AppShell } from "@/components/app/appshell";
import { PowerWorkspaceButton } from "./client";
import { ApiErrorScreen } from "@/components/screens/error";
import {
  Dto_Workspace_Get,
  EWorkspaceContainerState,
} from "@limespaces/shared";
import { WorkspaceContainerStateTranslation } from "@/lang/enum-translations";
import Link from "next/link";

interface IPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function Page(props: IPageProps) {
  const { workspaceId } = await props.params;

  const workspace = await API.get<Dto_Workspace_Get>(
    ApiVersion.v1,
    `/workspace/${workspaceId}`,
  );

  const powerWorkspace = createServerAction<
    {
      workspaceId: string;
      action: "start" | "stop";
    },
    {}
  >(
    async (
      data: {
        workspaceId: string;
        action: "start" | "stop";
      },
      resolve,
    ) => {
      "use server";

      const result = await API.post<{}, {}>(
        ApiVersion.v1,
        `/workspace/${data.workspaceId}/power/${data.action}`,
        {},
      );

      if (result.isOk) resolve.ok(result.data);
      else resolve.error(new Error(result.data.message));
    },
  );

  if (!workspace.isOk) return <ApiErrorScreen error={workspace.data} />;

  return (
    <AppShell>
      <div className="p-16 flex flex-col gap-4">
        <p>{workspace.data.name}</p>
        <p>
          {workspace.data.workspaceContainer
            ? WorkspaceContainerStateTranslation[
                workspace.data.workspaceContainer.state
              ]
            : "Unknown"}{" "}
          - {workspace.data.dockerContainerState}
        </p>

        <PowerWorkspaceButton
          powerWorkspace={powerWorkspace}
          workspaceId={workspaceId}
          currentState={workspace.data.workspaceContainer?.state}
          dockerContainerState={workspace.data.dockerContainerState}
        />

        <Link href={`/workspaces/${workspaceId}/remote`}>Open remote</Link>
      </div>
    </AppShell>
  );
}
