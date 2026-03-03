"use client";
import { channelNameSchema, transformChannelName } from "@/app/schemas/channel";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function CreateNewChannel() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(channelNameSchema),
    defaultValues: { name: "" },
  });

  const watchedName = form.watch("name");
  const transformedName = watchedName ? transformChannelName(watchedName) : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="size-3" />
          Add Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create new channel to get started!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6">
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
                  {transformedName && transformedName !== watchedName && (
                    <p className="text-sm text-muted-foreground">
                      Will be created as:{" "}
                      <code className="bg-muted px-1 py-0.5 rouded text-xs">
                        {transformedName}
                      </code>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Create new channel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
