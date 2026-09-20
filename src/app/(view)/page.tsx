import Navbar from "@/components/core/navbar";
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return redirect(session ? "/files" : "/auth/login");
}
