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
   * Workspace creation mutation
   *
   * Handles the async operation of creating a new workspace.
   * On success: displays toast, refetches workspace list, resets form, closes dialog
   * On error: displays error toast and keeps dialog open for retry
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
      onError: () => {
        toast.error("Failed to create workspace. Please try again.");
      },
    }),
  );

  /**
   * Submits the form data to create a new workspace.
   * Calls the underlying mutation from `useMutation` with the provided form data.
   * @param {WorkspaceSchemaType} values - The form data to be submitted for creating a new workspace.
   */
  function onSubmit(values: WorkspaceSchemaType) {
    CreateWorkspaceMutation.mutate(values);
  }

  return (
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
                    <input {...field} placeholder="Team Workspace" />
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
