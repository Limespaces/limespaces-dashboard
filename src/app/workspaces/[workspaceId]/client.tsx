"use client";

import { IServerActionDispatcher } from "@/api/actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useServerAction } from "@/hooks/useServerAction";
import { EWorkspaceContainerState } from "@limespaces/shared";
import { PlayIcon, PowerIcon, StopIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();

  const { isLoading, dispatch } = useServerAction(props.powerWorkspace, {
    onError: (error) => toast.error(error.message),
    onSuccess: () => router.refresh(),
  });

  return (
    <div className="flex flex-row gap-1">
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
