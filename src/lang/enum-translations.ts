import { EWorkspaceContainerState } from "@limespaces/shared";

export const WorkspaceContainerStateTranslation: {
  [key in EWorkspaceContainerState]: string;
} = {
  [EWorkspaceContainerState.WaitingForCreation]: "Waiting for creation",
  [EWorkspaceContainerState.Creating]: "Creating",
  [EWorkspaceContainerState.Created]: "Created",
  [EWorkspaceContainerState.Deleting]: "Deleting",
  [EWorkspaceContainerState.Deleted]: "Deleted",
};
