import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";
import Link from "next/link";

const channels = [
  { id: 1, name: "general" },
  { id: 2, name: "random" },
  { id: 3, name: "development" },
];

export function ChanellList() {
  return (
    <div className="space-y-0.5 py-1">
      {channels.map((channel) => (
        <Link
          key={channel.id}
          href={`#${channel.name}`}
          className={buttonVariants({
            variant: "ghost",
            className: cn(
              "w-full justify-start px-2 py-1 h-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent",
            ),
          })}
        >
          <Hash className="size-4 mr-2" />
          <span className="truncate">{channel.name}</span>
        </Link>
      ))}
    </div>
  );
}
