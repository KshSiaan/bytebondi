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
export default function Grid({
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
    <section
      className={cn(
        "flex-1 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:p-2 overflow-y-auto",
      )}
    >
      {files?.map((file) => (
        <div
          key={file?.id}
          className="group w-full h-min overflow-hidden rounded-xl border bg-card p-1.5 transition-all hover:border-foreground/20 hover:shadow-sm"
        >
          {/* Preview */}
          {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            {file?.type.startsWith("image/") ? (
              <ImageZoom>
                <Image
                  src={file?.fileUrl}
                  alt={file?.fileName}
                  height={200}
                  width={400}
                  unoptimized
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </ImageZoom>
            ) : (
              <div className="size-full flex justify-center items-center">
                {file?.type.startsWith("image/") ? (
                  <HugeiconsIcon
                    icon={Image03Icon}
                    className="size-8 text-foreground/30"
                  />
                ) : file?.type.startsWith("audio/") ? (
                  <HugeiconsIcon
                    icon={AppleMusicIcon}
                    className="size-8 text-foreground/30"
                  />
                ) : file?.type.startsWith("video/") ? (
                  <HugeiconsIcon
                    icon={ClapperboardIcon}
                    className="size-8 text-foreground/30"
                  />
                ) : file?.type.startsWith("application/zip") ? (
                  <HugeiconsIcon
                    icon={FileZipIcon}
                    className="size-8 text-foreground/30"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={File02Icon}
                    className="size-8 text-foreground/30"
                  />
                )}
              </div>
            )}

            {/* File type */}
            {!isMobile && (
              <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                {file?.type.startsWith("image/") ? (
                  <HugeiconsIcon icon={Image03Icon} className="size-3" />
                ) : file?.type.startsWith("audio/") ? (
                  <HugeiconsIcon icon={AppleMusicIcon} className="size-3" />
                ) : file?.type.startsWith("video/") ? (
                  <HugeiconsIcon icon={ClapperboardIcon} className="size-3" />
                ) : file?.type.startsWith("application/zip") ? (
                  <HugeiconsIcon icon={FileZipIcon} className="size-3" />
                ) : (
                  <HugeiconsIcon icon={File02Icon} className="size-3" />
                )}
                <span>{file?.type.split("/")[0]}</span>
              </div>
            )}

            {/* More */}
            <div className="">
              <Downloader url={file?.fileUrl} fileName={file?.fileName} />
              <Controller
                loading={loading}
                setLoading={setLoading}
                mutate={mutate}
                file={file}
              />
            </div>
          </div>

          {/* Information */}
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
      ))}
    </section>
  );
}
