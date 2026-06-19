import { EWorkspaceContainerState } from "@limespaces/shared";

export const WorkspaceContainerStateTranslation: {
  [key in EWorkspaceContainerState]: string;
} = {
  [EWorkspaceContainerState.WaitingForCreation]: "Waiting for creation",
  [EWorkspaceContainerState.Creating]: "Creating",
  [EWorkspaceContainerState.Starting]: "Starting",
  [EWorkspaceContainerState.Running]: "Running",
  [EWorkspaceContainerState.Stopping]: "Stopping",
  [EWorkspaceContainerState.Stopped]: "Stopped",
  [EWorkspaceContainerState.Deleting]: "Deleting",
  [EWorkspaceContainerState.Deleted]: "Deleted",
};
