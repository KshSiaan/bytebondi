"use client";
import React from "react";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";

import Link from "next/link";
import { play } from "cuelume";
import { usePathname } from "next/navigation";
import { PlusIcon } from "@hugeicons/core-free-icons";

export default function SideLayout({
  navs,
}: {
  navs: {
    name: string;
    icon: any;
    url: string;
  }[];
}) {
  const path = usePathname();

  return (
    <div className=" h-full w-full p-6">
      <section className="h-full w-full space-y-2">
        {navs.map((nav) => (
          <Button
            variant={path === nav.url ? "outline" : "ghost"}
            className="w-full justify-start!"
            size="lg"
            onClick={() => {
              play("page");
            }}
            key={nav.name}
            asChild
          >
            <Link href={nav.url}>
              <HugeiconsIcon icon={nav.icon} /> {nav.name}
            </Link>
          </Button>
        ))}
      </section>
    </div>
  );
}
