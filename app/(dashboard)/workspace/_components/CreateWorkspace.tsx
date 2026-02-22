/**
 * CreateWorkspace Component
 *
 * A dialog-based form component for creating new workspaces.
 * Features Zod validation, ORPC mutations, toast notifications,
 * and automatic cache invalidation on success.
 *
 * @returns {JSX.Element} A button trigger that opens a dialog with workspace creation form
 *
 * @example
 * <CreateWorkspace />
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSchema, WorkspaceSchemaType } from "@/app/schemas/workspace";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { isDefinedError } from "@orpc/client";

export function CreateWorkspace() {
  // Controls dialog open/close state
  const [open, setOpen] = useState(false);

  // Query client instance for invalidating workspace list after creation
  const queryClient = useQueryClient();

  // Form instance with Zod schema validation
  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  /**
   * Defines the mutation for creating a new workspace.
   *
   * This uses `@tanstack/react-query`'s `useMutation` hook to handle the
   * asynchronous creation of a workspace. It provides callbacks for `onSuccess`
   * and `onError` to give the user feedback.
   *
   * - `onSuccess`: A success toast is shown, the list of workspaces is invalidated
   *   (triggering a refetch), the form is reset, and the dialog is closed.
   * - `onError`: An error toast is displayed. If the error is a defined API error
   *   (e.g., rate-limited), a specific message is shown. The dialog remains open
   *   so the user can correct any issues and retry.
   */
  const CreateWorkspaceMutation = useMutation(
    orpc.workspace.create.mutationOptions({
      onSuccess: (newWorkspace) => {
        toast.success(
          `Workspace ${newWorkspace.workspaceName} created successfully!`,
        );
        // Refetch workspace list to show the new workspace
        queryClient.invalidateQueries({
          queryKey: orpc.workspace.list.queryKey(),
        });
        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          if (error.code === "RATE_LIMITED") {
            toast.error(error.message);
            return;
          }
          toast.error(error.message);
          return;
        }
        toast.error("Failed to create workspace. Please try again.");
      },
    }),
  );

  /**
   * Triggers the workspace creation mutation with the validated form data.
   * This function is called by `react-hook-form`'s `handleSubmit`
   * when the form is successfully validated.
   *
   * @param {WorkspaceSchemaType} values - The validated form data.
   */
  function onSubmit(values: WorkspaceSchemaType) {
    CreateWorkspaceMutation.mutate(values);
  }

  return (
    // Root container for the workspace creation dialog
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Tooltip-wrapped trigger button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            {/* Icon button with dashed border style to indicate "add new" action */}
            <Button
              variant="ghost"
              size="icon"
              className="size-12 rounded-xl border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-foreground hover:text-foreground hover:rounded-lg transition-all duration-200"
            >
              <Plus className="size-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Create Workspace</p>
        </TooltipContent>
      </Tooltip>

      {/* Dialog content with form */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to get started.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Workspace name input field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Team Workspace"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={CreateWorkspaceMutation.isPending} type="submit">
              {CreateWorkspaceMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
