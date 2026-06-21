import { EWorkspaceContainerState } from "@limespaces/shared";

export function translateWorkspaceState(
  state: EWorkspaceContainerState,
  dockerContainerState?: string,
) {
  // TODO: Return state according to internal api state
  // (won't show running, when in reality it' starting)

  if (state == EWorkspaceContainerState.WaitingForCreation)
    return "Waiting for creation...";
  if (state == EWorkspaceContainerState.Creating) return "Creating...";
  if (state == EWorkspaceContainerState.Deleting) return "Deleting...";
  if (state == EWorkspaceContainerState.Deleted) return "Deleted";
  if (state == EWorkspaceContainerState.Created) {
    if (!dockerContainerState) return `Unknown (${state} - null)`;

    if (["exited", "created"].includes(dockerContainerState)) return "Stopped";
    if (["running"].includes(dockerContainerState)) return "Running";

    return `Unknown (${state} - ${dockerContainerState})`;
  }

  return `Unknown (${state})`;
}
