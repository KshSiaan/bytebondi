"use client";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogIn, Menu02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import Profile from "./profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar({
  navs,
}: {
  navs: {
    name: string;
    icon: any;
    url: string;
  }[];
}) {
  const { data } = authClient.useSession();
  const isMobile = useIsMobile();
  const { setTheme } = useTheme();
  return (
    <nav className="h-14 w-full flex justify-between items-center px-6">
      {isMobile && (
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button size="icon" variant="ghost">
              <HugeiconsIcon icon={Menu02Icon} />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>RavenDrive</DrawerTitle>
            </DrawerHeader>
            <section className="h-full w-full space-y-2">
              {navs.map((nav) => (
                <Button
                  variant="ghost"
                  className="w-full justify-start!"
                  size="lg"
                  key={nav.name}
                  asChild
                >
                  <Link href={nav.url}>
                    <HugeiconsIcon icon={nav.icon} /> {nav.name}
                  </Link>
                </Button>
              ))}
            </section>
          </DrawerContent>
        </Drawer>
      )}
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          height={64}
          width={64}
          alt="ByteBondi"
          className="size-8"
        />
        {!isMobile && (
          <span className="text-sm font-bold -mb-1">RavenDrive</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {data?.session?.token ? (
          <Profile user={data} />
        ) : (
          <Button className="text-xs!" data-cuelume-hover asChild>
            <Link href="/auth/login">
              Sign In
              <HugeiconsIcon icon={LogIn} />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
