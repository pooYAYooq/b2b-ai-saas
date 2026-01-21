import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogoutLink,
  PortalLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { CreditCard, LogOut, User } from "lucide-react";

// Dummy user
const user = {
  image: "https://github.com/pooyayooq.png",
  userFullName: "PK-01",
  userEmail: "pk@example.com",
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
          className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-border/50 hover:bg-accent hover:text-accent-foreground"
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
      <DropdownMenuContent
        align="end"
        side="right"
        sideOffset={12}
        className="w-[200px]"
      >
        {/* Add dropdown menu items here */}
        <DropdownMenuLabel className="font-normal flex gap-3 items-center px-1 py-1.5 text-left text-sm">
          <Avatar className="relative rounded-md ">
            <AvatarImage
              src={user.image}
              alt="User Avatar"
              className="object-cover"
            />
            <AvatarFallback>{user.userFullName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <p className="font-medium truncate">{user.userFullName}</p>
            <p className=" truncate text-xs text-muted-foreground">
              {user.userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <PortalLink>
              <User />
              Account
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <PortalLink>
              <CreditCard />
              Billing
            </PortalLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink>
            <LogOut />
            Sign Out
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
