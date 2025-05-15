import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  Button,
} from "@/components/shared";
import { ChevronDownIcon, Navigation } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
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
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Navbar() {
  return (
    <div className="">
      <nav className="bg-background z-10">
        <div className="flex items-center justify-between h-16 px-64">
          {/* Left side - Navigation Links */}
          <div>
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-4">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:rounded-full rounded-full">
                    Home
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/site"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              <Image
                                src="/icons/logo.svg"
                                alt="Logo"
                                width={32}
                                height={32}
                              />
                              <span className="font-light text-xl tracking-tighter">
                                Simple ProjeX
                              </span>
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Simple ProjeX simplifies proposals, contracts, and
                              plans with cost calculations.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/docs" title="Introduction">
                        Discover how to get started with Simple ProjeX
                      </ListItem>
                      <ListItem href="/docs/installation" title="Features">
                        How to install dependencies and structure your app.
                      </ListItem>
                      <ListItem
                        href="/docs/primitives/typography"
                        title="Why choose us?"
                      >
                        Styles for headings, paragraphs, lists...etc
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Center - Logo and Project Title */}
          <div className="flex items-center gap-2">
            <Image src="/icons/logo.svg" alt="Logo" width={32} height={32} />
            <span className="font-light text-xl tracking-tighter">
              Simple Proje<span className="ml-[0.5px]">X</span>
            </span>
          </div>

          {/* Right side - Login and Free Trial buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hover:bg-transparent ">
              Login
            </Button>
            <Button className="rounded-full">Free Trial</Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
