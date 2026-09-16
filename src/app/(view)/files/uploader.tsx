"use client";

import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";

import {
  AppleMusicIcon,
  CheckIcon,
  ClapperboardIcon,
  File02Icon,
  FileZipIcon,
  Image02Icon,
  PackageRemove01Icon,
  XIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileValidator } from "./file-validator";
import { cn } from "cn";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type UploadStatus = "pending" | "uploading" | "completed" | "error";

type FileStatus = {
  status: UploadStatus;
};

export default function Uploader({
  files,
  setFiles,
  isDragging,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isDragging: boolean;
}) {
  const [uploadStatuses, setUploadStatuses] = useState<
    Record<string, FileStatus>
  >({});

  const [isUploading, setIsUploading] = useState(false);

  const getFileKey = (file: File) =>
    `${file.name}-${file.size}-${file.lastModified}`;

  const updateFileStatus = (fileKey: string, status: UploadStatus) => {
    setUploadStatuses((prev) => ({
      ...prev,
      [fileKey]: {
        status,
      },
    }));
  };

  const handleUpload = async () => {
    if (!files.length || isUploading) return;

    setIsUploading(true);

    setUploadStatuses(
      Object.fromEntries(
        files.map((file) => [
          getFileKey(file),
          {
            status: "uploading" as UploadStatus,
          },
        ]),
      ),
    );

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      if (!response.body) {
        throw new Error("Streaming response is not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let completedCount = 0;
      let errorCount = 0;

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");

        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const event = JSON.parse(line);

            if (event.type === "complete") {
              const file = files.find(
                (file) =>
                  getFileKey(file) === event.fileKey ||
                  file.name === event.fileName,
              );

              if (!file) continue;

              completedCount++;

              updateFileStatus(getFileKey(file), "completed");
            }

            if (event.type === "error") {
              const file = files.find(
                (file) =>
                  getFileKey(file) === event.fileKey ||
                  file.name === event.fileName,
              );

              errorCount++;

              toast.error(
                `Failed to upload ${file?.name ?? "a file"}: ${event.message}`,
                {
                  description: "Please try again.",
                },
              );

              if (!file) continue;

              updateFileStatus(getFileKey(file), "error");
            }
          } catch (error) {
            console.error("Failed to parse upload event:", error);
          }
        }
      }

      // Process the final buffered event
      buffer += decoder.decode();

      if (buffer.trim()) {
        try {
          const event = JSON.parse(buffer);

          if (event.type === "complete") {
            const file = files.find(
              (file) =>
                getFileKey(file) === event.fileKey ||
                file.name === event.fileName,
            );

            if (file) {
              completedCount++;

              updateFileStatus(getFileKey(file), "completed");
            }
          }

          if (event.type === "error") {
            errorCount++;
          }
        } catch (error) {
          console.error("Failed to parse final upload event:", error);
        }
      }

      // ✅ The entire stream is finished here
      if (completedCount === files.length) {
        toast.success(
          `${files.length - errorCount} files uploaded successfully!`,
        );
        setTimeout(() => {
          setFiles([]);
          setUploadStatuses({});
        }, 1000);
      }
    } catch (error) {
      console.error("Error uploading files:", error);

      setUploadStatuses((prev) => {
        const next = { ...prev };

        files.forEach((file) => {
          const key = getFileKey(file);

          if (next[key]?.status !== "completed") {
            next[key] = {
              status: "error",
            };
          }
        });

        return next;
      });

      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (fileIndex: number) => {
    if (isUploading) return;

    const file = files[fileIndex];

    if (file) {
      const key = getFileKey(file);

      setUploadStatuses((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }

    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex),
    );
  };

  return (
    <>
      {/* Drag overlay */}
      <section
        className={cn(
          "pointer-events-none absolute inset-0 z-50",
          "flex flex-col items-center justify-center",
          "rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 backdrop-blur-sm",
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

      <AnimatePresence>
        {files.length > 0 && (
          <motion.section
            initial={{
              opacity: 0,
              x: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: 24,
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.8,
            }}
            className="absolute bottom-0 right-0 z-30 h-auto w-[30dvw] rounded-xl border bg-background p-4 shadow-xl"
          >
            {/* Header */}
            <motion.div
              initial={{
                opacity: 0,
                y: -6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.05,
                duration: 0.2,
              }}
              className="flex items-center justify-between"
            >
              <h3 className="text-sm font-semibold text-muted-foreground">
                {isUploading ? "Uploading files" : "Files ready"}
              </h3>

              <motion.span
                key={files.length}
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {files.length}
              </motion.span>
            </motion.div>

            {/* Files */}
            <motion.div layout className="space-y-2 p-2">
              <AnimatePresence initial={false} mode="popLayout">
                {files.map((file, fileIndex) => {
                  const validatedFile = FileValidator(file);
                  const fileKey = getFileKey(file);
                  const status = uploadStatuses[fileKey]?.status ?? "pending";

                  return (
                    <motion.div
                      layout
                      key={fileKey}
                      initial={{
                        opacity: 0,
                        x: 16,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        x: 20,
                        scale: 0.94,
                        filter: "blur(4px)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 32,
                        mass: 0.7,
                      }}
                      className={cn(
                        "group flex items-center justify-between rounded-lg border p-2 text-xs shadow-sm",
                        status === "error"
                          ? "border-destructive/50"
                          : "text-muted-foreground",
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {/* File icon */}
                        <motion.div
                          initial={{
                            scale: 0.7,
                            opacity: 0,
                          }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                          }}
                          transition={{
                            delay: 0.08,
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                          className="shrink-0"
                        >
                          {validatedFile.type === "image" ? (
                            <HugeiconsIcon icon={Image02Icon} />
                          ) : validatedFile.type === "audio" ? (
                            <HugeiconsIcon icon={AppleMusicIcon} />
                          ) : validatedFile.type === "video" ? (
                            <HugeiconsIcon icon={ClapperboardIcon} />
                          ) : validatedFile.type === "zip" ? (
                            <HugeiconsIcon icon={FileZipIcon} />
                          ) : (
                            <HugeiconsIcon icon={File02Icon} />
                          )}
                        </motion.div>

                        {/* Filename */}
                        <motion.span
                          layout="position"
                          className="truncate"
                          title={validatedFile.name}
                        >
                          {validatedFile.name}
                        </motion.span>
                      </div>

                      {/* Status */}
                      <div className="ml-2 shrink-0">
                        <AnimatePresence mode="wait" initial={false}>
                          {/* Pending / remove */}
                          {status === "pending" && (
                            <motion.div
                              key="remove"
                              initial={{
                                opacity: 0,
                                scale: 0.7,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.7,
                              }}
                            >
                              <Button
                                size="icon-sm"
                                variant="destructive"
                                onClick={() => handleRemoveFile(fileIndex)}
                              >
                                <HugeiconsIcon icon={XIcon} />
                              </Button>
                            </motion.div>
                          )}

                          {/* Uploading */}
                          {status === "uploading" && (
                            <motion.div
                              key="loading"
                              initial={{
                                opacity: 0,
                                scale: 0.7,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.7,
                              }}
                              className="flex size-7 items-center justify-center"
                            >
                              <motion.div
                                animate={{
                                  rotate: 360,
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="size-4 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground"
                              />
                            </motion.div>
                          )}

                          {/* Completed */}
                          {status === "completed" && (
                            <motion.div
                              key="completed"
                              initial={{
                                opacity: 0,
                                scale: 0.5,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 20,
                              }}
                              className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary"
                            >
                              <HugeiconsIcon icon={CheckIcon} size={16} />
                            </motion.div>
                          )}

                          {/* Error */}
                          {status === "error" && (
                            <motion.div
                              key="error"
                              initial={{
                                opacity: 0,
                                scale: 0.5,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                            >
                              <HugeiconsIcon icon={XIcon} size={16} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.2,
              }}
              className="flex items-center justify-between border-t pt-2"
            >
              <motion.div
                whileHover={{
                  scale: isUploading ? 1 : 1.05,
                }}
                whileTap={{
                  scale: isUploading ? 1 : 0.92,
                }}
              >
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={isUploading}
                  className="text-destructive"
                  onClick={() => {
                    if (!isUploading) {
                      setFiles([]);
                      setUploadStatuses({});
                    }
                  }}
                >
                  <HugeiconsIcon icon={PackageRemove01Icon} />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: isUploading ? 1 : 1.02,
                }}
                whileTap={{
                  scale: isUploading ? 1 : 0.97,
                }}
              >
                <Button
                  className="text-xs"
                  disabled={isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? "Uploading..." : "Upload Files"}
                </Button>
              </motion.div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
