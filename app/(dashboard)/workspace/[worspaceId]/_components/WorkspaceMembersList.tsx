import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const members = [
  {
    id: 1,
    name: "Pooya Kfr",
    email: "pk@example.com",
    imageUrl: "https://avatars.githubusercontent.com/u/140950637?v=4",
  },
];

export function WorkspaceMembersList() {
  return (
    <div className="space-y-0.5 py-1">
      {members.map((member) => (
        <div
          key={member.id}
          className="py-2 px-3 hover:bg-accent cursor-pointer transition-colors flex items-center space-x-3"
        >
          <div className="relative">
            <Avatar className="size-8 relative">
              <Image
                alt="User Image"
                src={member.imageUrl}
                className="object-cover"
                fill
              />
              <AvatarFallback>
                {member.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {member.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
