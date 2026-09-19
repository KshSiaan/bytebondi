"use client";
import type { StripEmptyObjects } from "better-auth/types";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout02Icon } from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/auth-client";

export default function Profile({
  user,
}: {
  user: {
    user: StripEmptyObjects<
      {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & {} & {}
    >;
    session: StripEmptyObjects<
      {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {} & {}
    >;
  };
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar>
          <AvatarImage src="https://api.dicebear.com/10.x/critters/svg?tags=animation&seed=we2flpo2" />
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>{user.user.name}</PopoverTitle>
          <PopoverDescription className="text-xs">
            {user.user.email}
          </PopoverDescription>
        </PopoverHeader>
        <div className="space-y-2">
          <Button className="w-full" variant="outline">
            Change Password
          </Button>
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => {
              authClient.signOut(
                { callbackURL: "/" },
                {
                  onSuccess: () => {
                    window.location.href = "/";
                  },
                },
              );
            }}
          >
            Sign Out <HugeiconsIcon icon={Logout02Icon} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
