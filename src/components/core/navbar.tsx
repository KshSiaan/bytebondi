"use client";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogIn } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data } = authClient.useSession();
  return (
    <nav className="h-14 w-full flex justify-between items-center px-6">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          height={64}
          width={64}
          alt="ByteBondi"
          className="size-10"
        />
        <span className="text-xl font-bold text-secondary">ByteBondi</span>
      </div>
      {data?.session?.token ? (
        <Avatar>
          <AvatarImage src="https://api.dicebear.com/10.x/critters/svg?tags=animation&seed=we2flpo2" />
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
      ) : (
        <Button className="text-xs!" asChild>
          <Link href="/auth/login">
            Sign In
            <HugeiconsIcon icon={LogIn} />
          </Link>
        </Button>
      )}
    </nav>
  );
}
