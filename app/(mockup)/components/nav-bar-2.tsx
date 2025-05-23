'use client'

import React, { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shared";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Cookie from 'js-cookie';
import { LayoutDashboard, Library, User, Settings, LogOut, MessageCircleIcon, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/mockup/context/user-context";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { href: string }
>(({ className, title, children, href, ...props }, ref) => {

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Navbar() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const router = useRouter();

  const { user } = useUser();
  const userProfile = user?.data;
  
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {



      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const handleLogout = () => {
    Cookie.remove("auth-token", { path: "/" });
    Cookie.remove("refresh-token", { path: "/" });
    router.push("/login");
  };
  
  return (
    <div className="sticky top-0 w-full z-50">
      <nav className={`bg-background ${hasScrolled ? 'border-b shadow-sm' : ''} transition-all duration-200`}>
        <div className="grid grid-cols-3 items-center h-16 max-w-screen-2xl mx-auto">
          {/* Left side - Navigation Links */}
          <div className="col-span-1">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:rounded-full rounded-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/site/dashboard"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              <Image
                                src="/icons/logo.svg"
                                alt="Logo"
                                width={32}
                                height={32}
                              />
                              <span className="font-light text-xl tracking-tighter">
                                Dashboard
                              </span>
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Manage your projects, tasks, and teams in one
                              place.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/site/templates" title="Templates">
                        Start fast with flexible, ready-to-use templates.
                      </ListItem>
                      <ListItem href="/site/proposals" title="Proposals">
                        Quickly craft polished, client-ready proposals that win
                        work.
                      </ListItem>
                      <ListItem
                        href="/site/contracts"
                        title="Contracts"
                      >
                        Generate secure, professional contracts with just a few
                        clicks.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:rounded-full rounded-full">
                    <Library className="mr-2 h-4 w-4" />
                    Library
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/site/library"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              <Image
                                src="/icons/logo.svg"
                                alt="Logo"
                                width={32}
                                height={32}
                              />
                              <span className="font-light text-xl tracking-tighter">
                                Library
                              </span>
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Access all your variables, trades, and elements in
                              one organized place.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/site/library/trades" title="Trades">
                        Manage trade-specific content and logic tailored to your
                        industry needs.
                      </ListItem>
                      <ListItem href="/site/library/elements" title="Elements">
                        Build faster with reusable components you can drag,
                        drop, and customize.
                      </ListItem>
                      <ListItem
                        href="/site/library/variables"
                        title="Variables"
                      >
                        Define reusable values to keep your templates dynamic
                        and consistent.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="">
                  <Link href="/docs" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                        <MessageCircleIcon className="mr-2 h-4 w-4"/>
                      Messages
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Center - Logo and Project Title */}
          <div className="col-span-1 flex items-center justify-center gap-2">
            <Image src="/icons/logo.svg" alt="Logo" width={32} height={32} />
            <span className="font-light text-xl tracking-tighter">
              Simple Proje<span className="ml-[0.5px]">X</span>
            </span>
          </div>

          {/* Right side - User Avatar with Dropdown */}
          <div className="col-span-1 flex items-center justify-end gap-4">
            {/* Notification Bell Icon with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer p-2 hover:bg-accent/50 transition-colors rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">2</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  {/* Notification Items */}
                  <div className="flex items-start gap-2 p-2 hover:bg-accent rounded-md cursor-pointer">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New project created</p>
                      <p className="text-xs text-muted-foreground">You've successfully created a new proposal template.</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 hover:bg-accent rounded-md cursor-pointer">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <User className="h-4 w-4 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Client signed contract</p>
                      <p className="text-xs text-muted-foreground">Northwest Renovation has signed the kitchen remodel contract.</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="outline" className="w-full text-xs">View all notifications</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer border-2">
                  <AvatarImage
                    src={userProfile?.avatar_url}
                    alt="User Profile"
                  />
                  <AvatarFallback className="uppercase">{userProfile?.created_by.first_name.charAt(0)}{userProfile?.created_by.last_name.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{userProfile?.created_by.first_name} {userProfile?.created_by.last_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProfile?.created_by.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/site/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/site/settings">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  );
}
