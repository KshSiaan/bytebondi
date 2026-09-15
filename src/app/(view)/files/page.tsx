"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AppleMusicIcon,
  File02Icon,
  FileZipIcon,
  Image02Icon,
  PackageRemove01Icon,
  XIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import React from "react";
import { FileValidator } from "./file-validator";

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
      className="relative h-full w-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Button>LOL</Button>
      <section
        className={cn(
          "pointer-events-none absolute inset-0 z-50",
          "flex items-center flex-col justify-center",
          "bg-linear-to-br from-primary/10 to-secondary/10 rounded-xl backdrop-blur-sm",
          "transition-opacity duration-150",
          isDragging ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Image
          src="/illustration/package.svg"
          height={464}
          width={464}
          alt="Package"
          className="size-64"
        />
        <h2 className="text-lg font-bold">Drop your files here</h2>
      </section>

      <section className="absolute z-30 bottom-0 right-0 w-[30dvw] h-auto border bg-background p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Uploading files
          </h3>
        </div>
        <div className="p-2 space-y-2">
          {files.map((file, fileIndex) => {
            const validatedFile = FileValidator(file);
            return (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}-${fileIndex}`}
                className="text-xs text-muted-foreground border shadow-sm rounded-lg p-2 flex justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="">
                    {validatedFile.type === "image" ? (
                      <HugeiconsIcon icon={Image02Icon} />
                    ) : validatedFile.type === "audio" ? (
                      <HugeiconsIcon icon={AppleMusicIcon} />
                    ) : validatedFile.type === "zip" ? (
                      <HugeiconsIcon icon={FileZipIcon} />
                    ) : (
                      <HugeiconsIcon icon={File02Icon} />
                    )}
                  </div>
                  <span>{validatedFile.name}</span>
                </div>
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => {
                    setFiles((prevFiles) =>
                      prevFiles.filter((f, index) => index !== fileIndex),
                    );
                  }}
                >
                  <HugeiconsIcon icon={XIcon} />
                </Button>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center border-t pt-2">
          <Button size="icon-sm" variant="ghost" className="text-destructive">
            <HugeiconsIcon icon={PackageRemove01Icon} />
          </Button>
          <Button className="text-xs">Upload Files</Button>
        </div>
      </section>
    </div>
  );
}
