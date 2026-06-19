"use client";

import { IServerActionDispatcher, IServerActionHandler } from "@/api/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useServerAction } from "@/hooks/useServerAction";
import { Dto_Workspace_Create } from "@limespaces/shared";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ICreateWorkspaceFormProps {
  createWorkspace: IServerActionDispatcher<FormData, Dto_Workspace_Create>;
}

export function CreateWorkspaceForm(props: ICreateWorkspaceFormProps) {
  const router = useRouter();

  const { isLoading, dispatch } = useServerAction(props.createWorkspace, {
    onError: (error) => toast.error(error.message),
    onSuccess: (workspace) => router.push(`/workspaces/${workspace.id}`),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        dispatch(new FormData(e.target));
      }}
    >
      <FieldGroup className="max-w-100 mt-8">
        <FieldSet>
          <FieldLegend>Workspace configuration</FieldLegend>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="new-workspace-input-name">
                Name <span className="text-red-700">*</span>
              </FieldLabel>
              <Input
                id="new-workspace-input-name"
                name="name"
                required
                placeholder="My workspace"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <Field orientation="horizontal">
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner /> Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
