import { API, ApiVersion } from "@/api/API";
import { AppShell } from "@/components/app/appshell";
import { ApiErrorScreen } from "@/components/screens/error";
import {
  Dto_Workspace_Get,
  Dto_Workspace_Vnc_CreateToken,
} from "@limespaces/shared";
import { Vnc } from "./client";

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

  if (!workspace.isOk) return <ApiErrorScreen error={workspace.data} />;

  const vnc = await API.post<Dto_Workspace_Vnc_CreateToken, {}>(
    ApiVersion.v1,
    `/workspace/${workspaceId}/vnc/token`,
    {},
  );

  if (!vnc.isOk) return <ApiErrorScreen error={vnc.data} />;

  return (
    <div>
      <div className="w-screen h-screen bg-black">
        <Vnc token={vnc.data.token} />
      </div>
    </div>
  );
}
