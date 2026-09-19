import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import Image from "next/image";
import React from "react";
import {
  AppleMusicIcon,
  ClapperboardIcon,
  File02Icon,
  FileZipIcon,
  Image03Icon,
} from "@hugeicons/core-free-icons";
import { useIsMobile } from "@/hooks/use-mobile";
import Downloader from "./downloader";
import Controller from "./controller";
export default function ListView({
  files,
  mutate,
  loading,
  setLoading,
}: {
  files:
    | Array<{
        id: string;
        fileUrl: string;
        fileName: string;
        size: string;
        star: boolean;
        type: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
      }>
    | undefined;
  mutate: () => void;
  loading: string | null;
  setLoading: (id: string | null) => void;
}) {
  const isMobile = useIsMobile();
  return (
    <section className={cn("flex-1 w-full overflow-y-auto divide-y")}>
      {files?.map((file) => (
        <div
          key={file?.id}
          className="group flex items-center justify-between w-full h-min"
        >
          {/* Preview */}
          {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
          <div className="relative overflow-hidden bg-muted flex justify-between items-center h-12">
            <div className="flex items-center gap-2 size-14">
              {file?.type.startsWith("image/") ? (
                <Image
                  src={file?.fileUrl}
                  alt={file?.fileName}
                  height={200}
                  width={400}
                  unoptimized
                  className="size-12 aspect-square object-cover"
                />
              ) : (
                <div className="size-full flex justify-center items-center">
                  {file?.type.startsWith("image/") ? (
                    <HugeiconsIcon
                      icon={Image03Icon}
                      className="size-6 text-foreground/30"
                    />
                  ) : file?.type.startsWith("audio/") ? (
                    <HugeiconsIcon
                      icon={AppleMusicIcon}
                      className="size-6 text-foreground/30"
                    />
                  ) : file?.type.startsWith("video/") ? (
                    <HugeiconsIcon
                      icon={ClapperboardIcon}
                      className="size-6 text-foreground/30"
                    />
                  ) : file?.type.startsWith("application/zip") ? (
                    <HugeiconsIcon
                      icon={FileZipIcon}
                      className="size-6 text-foreground/30"
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={File02Icon}
                      className="size-6 text-foreground/30"
                    />
                  )}
                </div>
              )}
            </div>
            <div className="px-1.5 pb-1 pt-2.5">
              <p
                title="mountain-landscape-final.png"
                className="truncate text-xs font-medium leading-4 text-foreground"
              >
                {file?.fileName}
              </p>

              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span>
                  {file?.size
                    ? (parseInt(file.size) / (1024 * 1024)).toFixed(1)
                    : "0.0"}
                  MB
                </span>

                <span className="size-0.5 shrink-0 rounded-full bg-muted-foreground/50" />

                <span className="truncate">
                  Uploaded{" "}
                  {file?.updatedAt
                    ? new Date(file.updatedAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className="relative pr-2 space-x-2">
            <Downloader
              url={file?.fileUrl}
              fileName={file?.fileName}
              absolute={false}
              ghost={true}
            />
            <Controller
              loading={loading}
              setLoading={setLoading}
              mutate={mutate}
              file={file}
              absolute={false}
              ghost
            />
          </div>
        </div>
      ))}
    </section>
  );
}
