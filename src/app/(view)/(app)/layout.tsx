import Navbar from "@/components/core/navbar";
import SideLayout from "@/components/core/side-layout";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";
import {
  FileStarIcon,
  Folder01Icon,
  ShareKnowledgeIcon,
} from "@hugeicons/core-free-icons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const navs = [
  {
    name: "My Files",
    icon: Folder01Icon,
    url: "/files",
  },
  {
    name: "Starred Files",
    icon: FileStarIcon,
    url: "/starred",
  },
  // {
  //   name: "Shared Files",
  //   icon: ShareKnowledgeIcon,
  //   url: "/shared",
  // },
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });

  if (!session) {
    return redirect("/auth/login");
  }

  return (
    <div className="h-dvh w-full flex flex-col">
      <Navbar navs={navs} />

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 shrink-0 hidden md:block">
          <Suspense fallback={<Spinner />}>
            <SideLayout navs={navs} />
          </Suspense>
        </aside>
        <div className="flex-1 min-w-0 px-2 pb-2 md:pr-6 md:pb-6">
          <main className="h-full bg-muted rounded-xl md:p-2">{children}</main>
        </div>
      </div>
    </div>
  );
}
