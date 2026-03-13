"use client";
import {
  channelNameSchema,
  ChannelSchemaNameType,
  transformChannelName,
} from "@/app/schemas/channel";
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
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

/**
 * CreateNewChannel Component
 *
 * A dialog-based form component for creating new channels.
 * Features Zod validation, ORPC mutations, toast notifications,
 * and automatic cache invalidation on success.
 *
 * @returns {JSX.Element} A button trigger that opens a dialog with channel creation form
 */
export function CreateNewChannel() {
  // state to control whether the dialog is open or closed
  const [open, setOpen] = useState(false);

  //
  const queryClient = useQueryClient();

  // initialize react-hook-form with zod validation schema and initial values
  const form = useForm({
    resolver: zodResolver(channelNameSchema),
    defaultValues: { name: "" },
  });

  const createChannelMutation = useMutation(
    orpc.channel.create.mutationOptions({
      /**
       * Called when the mutation is successful.
       * @param {ChannelSchemaNameType} newChannel - The newly created channel
       */
      onSuccess: (newChannel) => {
        toast.success(`Channel ${newChannel.name} created successfully!`);

        // Refetch channel list to show the new channel in the UI
        queryClient.invalidateQueries({
          queryKey: orpc.channel.list.queryKey(),
        });
        form.reset(); // reset form after successful creation
        setOpen(false); // close the dialog
      },
      /**
       * Called when the mutation fails.
       * If the error is an instance of `isDefinedError`, it displays the error message.
       * Otherwise, it displays a generic error message.
       */
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
          return;
        }

        toast.error("Failed to create channel. Please try again.");
      },
    }),
  );

  /**
   * Triggers the channel creation mutation with the validated form data.
   * This function is called by `react-hook-form`'s `handleSubmit`
   * when the form is successfully validated.
   *
   * @param {ChannelSchemaNameType} values - The validated form data.
   */
  function onSubmit(values: ChannelSchemaNameType) {
    createChannelMutation.mutate(values);
  }

  // watch the "name" field so we can display the normalized name immediately
  const watchedName = useWatch({
    control: form.control,
    name: "name",
  });

  // derive the transformed channel name (slug) from the watched input
  const transformedName = watchedName ? transformChannelName(watchedName) : "";

  return (
    // dialog component wraps the trigger/button and the form content
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* button that opens the create channel dialog */}
        <Button variant="outline" className="w-full">
          <Plus className="size-3" />
          Add Channel
        </Button>
      </DialogTrigger>
      {/* actual modal content for creating a new channel */}
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create new channel to get started!
          </DialogDescription>
        </DialogHeader>
        {/* hook-form wrapper to provide form context */}
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* field for the channel name with validation and live transformation */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <input
                      className="p-1"
                      placeholder="My Channel"
                      {...field}
                    />
                  </FormControl>
                  {/* show transformed name if it's different from what user typed */}
                  {transformedName && transformedName !== watchedName && (
                    <p className="text-sm text-muted-foreground">
                      Will be created as:{" "}
                      <code className="bg-muted px-1 py-0.5 rouded text-xs">
                        {transformedName}
                      </code>
                    </p>
                  )}
                  {/* validation error message output */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* submit button for the form */}
            <Button
              type="submit"
              className="mt-4"
              disabled={createChannelMutation.isPending}
            >
              {createChannelMutation.isPending
                ? "Creating..."
                : "Create Channel"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
