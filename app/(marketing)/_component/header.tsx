/**
 * HeroHeader Component
 *
 * Main navigation header for the marketing pages.
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Sticky positioning with blur effect on scroll
 * - Authentication-aware navigation (Login/Register or Dashboard)
 * - Smooth transitions and animations
 *
 * The header adapts its appearance when scrolled by:
 * - Adding background blur and border
 * - Reducing max-width for a contained look
 * - Maintaining visibility with fixed positioning
 *
 * @returns {JSX.Element} Marketing page header with navigation
 *
 * @example
 * <HeroHeader />
 */

"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Logo from "@/public/logo.png";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ThemeToggle } from "@/components/ui/them-toggle";

/**
 * Navigation menu items displayed in the header.
 * These are the main sections of the marketing site.
 */
const menuItems = [
  { name: "Features", href: "#link" },
  { name: "Solution", href: "#link" },
  { name: "Pricing", href: "#link" },
  { name: "About", href: "#link" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { getUser, isLoading } = useKindeBrowserClient();
  const user = getUser();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image src={Logo} alt="Logo" height={32} width={32} />
                <h1 className="text-2xl font-bold">
                  <span className="text-primary">Nexus</span>
                </h1>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {isLoading ? null : (
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className={buttonVariants({
                          size: "sm",
                        })}
                      >
                        <span>Dashboard</span>
                      </Link>

                      <LogoutLink
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: cn(isScrolled && "lg:hidden"),
                        })}
                      >
                        <span>Logout</span>
                      </LogoutLink>
                    </>
                  ) : (
                    <>
                      <LoginLink
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: cn(isScrolled && "lg:hidden"),
                        })}
                      >
                        Login
                      </LoginLink>
                      <RegisterLink
                        className={buttonVariants({
                          size: "sm",
                          className: cn(isScrolled && "lg:hidden"),
                        })}
                      >
                        Sign Up
                      </RegisterLink>

                      <div
                        className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                      >
                        <RegisterLink
                          className={buttonVariants({
                            size: "sm",
                          })}
                        >
                          Get Started
                        </RegisterLink>
                      </div>
                    </>
                  )}
                  <ThemeToggle buttonSize="sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
