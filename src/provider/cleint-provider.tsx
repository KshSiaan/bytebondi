import React from "react";
import { bind, setVolume } from "cuelume";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  bind();
  setVolume(0.7);
  return children;
}
