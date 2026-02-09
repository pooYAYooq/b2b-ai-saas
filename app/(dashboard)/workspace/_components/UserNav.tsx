/**
 * UserNav Component
 *
 * A dropdown menu component for user profile navigation and account management.
 * Displays the user's avatar as a trigger button and provides access to:
 * - User profile information (name and email)
 * - Account settings (via Kinde Portal)
 * - Billing management (via Kinde Portal)
 * - Sign out functionality
 *
 * The component fetches user data from the workspace.list query which includes
 * authenticated user information along with workspace data.
 *
 * @returns {JSX.Element} A dropdown menu with user navigation options
 *
 * @example
 * <UserNav />
 */

"use client";
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
import { getAvatar } from "@/lib/get-avatar";
import { orpc } from "@/lib/orpc";
import {
  LogoutLink,
  PortalLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreditCard, LogOut, User } from "lucide-react";

export function UserNav() {
  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());
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
              src={getAvatar(user.picture, user.email!)}
              alt="User Avatar"
              className="object-cover"
            />
            <AvatarFallback>{user.given_name?.slice(0, 2)}</AvatarFallback>
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
              src={getAvatar(user.picture, user.email!)}
              alt="User Avatar"
              className="object-cover"
            />
            <AvatarFallback>{user.given_name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <p className="font-medium truncate">{user.given_name}</p>
            <p className=" truncate text-xs text-muted-foreground">
              {user.email}
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
