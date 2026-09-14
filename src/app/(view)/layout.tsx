import Navbar from "@/components/core/navbar";
import SideLayout from "@/components/core/side-layout";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh w-full flex flex-col">
      <Navbar />

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 shrink-0 ">
          <Suspense fallback={<Spinner />}>
            <SideLayout />
          </Suspense>
        </aside>
        <div className="flex-1 min-w-0 pr-6 pb-6">
          <main className="h-full bg-muted rounded-xl p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
