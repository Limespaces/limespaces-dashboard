"use client";

import { IServerActionDispatcher } from "@/api/actions";
import { API, ApiVersion } from "@/api/API";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Vnc } from "@/components/Vnc";
import { useServerAction } from "@/hooks/useServerAction";
import { translateWorkspaceState } from "@/lang/workspace";
import {
  Dto_Workspace_Get,
  EWorkspaceContainerState,
} from "@limespaces/shared";
import { PlayIcon, PowerIcon, StopIcon } from "@phosphor-icons/react";
import { EventSource } from "eventsource";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface IClientProps {
  workspace: Dto_Workspace_Get;
  vncToken: string;

  fetchWorkspace: IServerActionDispatcher<{}, Dto_Workspace_Get>;
  powerWorkspace: IServerActionDispatcher<{ action: "start" | "stop" }, {}>;
}

export function Client(props: IClientProps) {
  const [workspace, setWorkspace] = useState<Dto_Workspace_Get>(
    props.workspace,
  );
  const eventSource = useRef<EventSource>(null);

  const { dispatch: fetchWorkspace, isLoading: fetchingWorkspace } =
    useServerAction(props.fetchWorkspace, {
      onError: (error) => toast.error(error.message),
      onSuccess: (data) => setWorkspace(data),
    });

  useEffect(() => {
    API.SSE(ApiVersion.v1, `/workspace/${props.workspace.id}/events`).then(
      (es) => {
        eventSource.current = es;

        // Call once to fix race conditions
        fetchWorkspace({});

        es.addEventListener("workspaceUpdate", () => fetchWorkspace({}));
      },
    );

    return () => {
      eventSource.current?.close();
    };
  }, [props.workspace, fetchWorkspace]);

  return (
    <>
      <div className="flex flex-col gap-0.5">
        <p className="text-2xl font-outfit">{workspace.name}</p>
        <p className="text-base">
          {translateWorkspaceState(
            workspace.workspaceContainer?.state!,
            workspace.dockerContainerState,
          )}
        </p>

        <PowerWorkspaceButton
          powerWorkspace={props.powerWorkspace}
          workspaceId={workspace.id}
          currentState={workspace.workspaceContainer?.state}
          dockerContainerState={workspace.dockerContainerState}
        />
      </div>
      <div className="w-100 aspect-video">
        <Vnc token={props.vncToken} readonly />
      </div>
      <Button
        onClick={() =>
          API.post(ApiVersion.v1, `/workspace/${workspace.id}/supervisor`, {})
        }
      >
        Test supervisor
      </Button>
    </>
  );
}

interface IPowerWorkspaceButtonProps {
  powerWorkspace: IServerActionDispatcher<
    {
      workspaceId: string;
      action: "start" | "stop";
    },
    {}
  >;
  workspaceId: string;
  currentState?: EWorkspaceContainerState;
  dockerContainerState?: string;
}

export function PowerWorkspaceButton(props: IPowerWorkspaceButtonProps) {
  const { isLoading, dispatch } = useServerAction(props.powerWorkspace, {
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="flex flex-row gap-0.5">
      <Button
        onClick={() =>
          dispatch({ workspaceId: props.workspaceId, action: "start" })
        }
        disabled={
          isLoading ||
          props.currentState != EWorkspaceContainerState.Created ||
          !["exited", "created"].includes(props.dockerContainerState ?? "")
        }
        className="h-8 w-8"
      >
        {isLoading ? <Spinner /> : <PlayIcon />}
      </Button>
      <Button
        onClick={() =>
          dispatch({ workspaceId: props.workspaceId, action: "stop" })
        }
        disabled={
          isLoading ||
          props.currentState != EWorkspaceContainerState.Created ||
          !["running", "dead", "starting"].includes(
            props.dockerContainerState ?? "",
          )
        }
        className="h-8 w-8"
      >
        {isLoading ? <Spinner /> : <StopIcon />}
      </Button>
    </div>
  );
}
