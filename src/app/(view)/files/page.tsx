"use client";
import { authClient } from "@/lib/auth-client";
import React from "react";

export default function Page() {
  const { data } = authClient.useSession();
  return (
    <div>
      <pre className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700">
        <code className="whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </code>
      </pre>
    </div>
  );
}
