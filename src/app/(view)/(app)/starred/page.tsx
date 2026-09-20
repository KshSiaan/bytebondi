"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { Suspense } from "react";
import Uploader from "../files/uploader";
import Files from "../files/files";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const dragCounter = React.useRef(0);
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    // Only react to actual file drags
    if (!event.dataTransfer.types.includes("Files")) return;

    dragCounter.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!event.dataTransfer.types.includes("Files")) return;

    dragCounter.current -= 1;

    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.dataTransfer.types.includes("Files")) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    dragCounter.current = 0;
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);

    setFiles((prevFiles) => [...prevFiles, ...files]);
    // Handle files here
    console.log(files);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    <div
      className="relative h-full w-full flex justify-center items-center"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <Files starred={true} />
      </Suspense>
      <Uploader files={files} setFiles={setFiles} isDragging={isDragging} />
    </div>
  );
}
