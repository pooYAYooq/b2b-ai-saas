import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy user
const user = {
  image: "https://github.com/pooyayooq.png",
  userFullName: "Pooya K",
};

/**
 * A dropdown menu for user navigation.
 *
 * It contains a button with the user's avatar and a dropdown menu
 * with user navigation items.
 *
 * @returns A JSX element representing the user navigation dropdown menu.
 */
export function UserNav() {
  return (
    <DropdownMenu>
      {/* User navigation items go here */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 hover:border/50 hover:bg-accent hover:text-accent-foreground"
        >
          <Avatar>
            <AvatarImage
              src={user.image}
              alt="User Avatar"
              className="object-cover"
            />
            <AvatarFallback>{user.userFullName.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
