import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  AppleMusicIcon,
  ClapperboardIcon,
  Database01Icon,
  Delete02Icon,
  Download01Icon,
  File02Icon,
  FileZipIcon,
  GridTableIcon,
  Image03Icon,
  MoreVerticalCircle01Icon,
  Share07Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import Downloader from "./downloader";
import { useIsMobile } from "@/hooks/use-mobile";
import { play } from "cuelume";

export default function Files() {
  const [selectedType, setSelectedType] = React.useState<
    "images" | "videos" | "audios" | "others" | undefined
  >();
  const [loading, setLoading] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  const [isGridView, setIsGridView] = React.useState(true);
  type FilesResponse = {
    message: string;
    data: Array<{
      id: string;
      fileUrl: string;
      fileName: string;
      size: string;
      type: string;
      userId: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };

  const { data, error, isLoading, mutate } = useSWR<FilesResponse>(
    "/api/files",
    (url: string) => fetch(url).then((res) => res.json()),
  );

  const handleDeleteFile = async (fileId: string) => {
    setLoading(fileId);
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        // Optionally, you can refetch the files or update the state to remove the deleted file from the UI
        await mutate();
        console.log(result.message);
        play("bloom");
      } else {
        console.error(result.message);
        play("error");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      play("error");
    } finally {
      setLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <pre className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700">
        <code className="whitespace-pre-wrap">
          {JSON.stringify(error, null, 2)}
        </code>
      </pre>
    );
  }
  return (
    <section className="h-full w-full flex flex-col gap-2">
      <section className="w-full p-2 rounded-xl border bg-foreground/5 flex justify-between items-center">
        <div className="text-xs font-semibold text-foreground flex items-center gap-2">
          <Button size={isMobile ? "icon" : "xs"} variant="ghost">
            {isMobile ? <HugeiconsIcon icon={Image03Icon} /> : "3 Images"}
          </Button>
          <Button size={isMobile ? "icon" : "xs"} variant="ghost">
            {isMobile ? <HugeiconsIcon icon={ClapperboardIcon} /> : "3 Videos"}
          </Button>
          <Button size={isMobile ? "icon" : "xs"} variant="ghost">
            {isMobile ? <HugeiconsIcon icon={AppleMusicIcon} /> : "3 Audios"}
          </Button>
          <Button size={isMobile ? "icon" : "xs"} variant="ghost">
            {isMobile ? <HugeiconsIcon icon={File02Icon} /> : "3 Others"}
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            size="icon"
            variant={isGridView ? "link" : "ghost"}
            onClick={() => setIsGridView(true)}
          >
            <HugeiconsIcon icon={GridTableIcon} />
          </Button>
          <Button
            size="icon"
            variant={isGridView ? "ghost" : "link"}
            onClick={() => setIsGridView(false)}
          >
            <HugeiconsIcon icon={Database01Icon} />
          </Button>
        </div>
      </section>
      <section
        className={cn(
          "flex-1 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:p-2 overflow-y-auto",
        )}
      >
        {data?.data.map((file) => (
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon-sm"
                      variant="secondary"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        play("toggle");
                      }}
                      className="absolute right-2 top-2 size-7 rounded-md border-0 bg-black/50 text-white"
                    >
                      <HugeiconsIcon
                        icon={MoreVerticalCircle01Icon}
                        className="size-3.5"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-xs">
                      <HugeiconsIcon icon={Share07Icon} className="size-3" />
                      Share File
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs text-amber-600">
                      <HugeiconsIcon icon={StarIcon} className="size-3" />
                      Star File
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      className="text-xs"
                      onClick={() => {
                        play("loading");
                        handleDeleteFile(file?.id);
                      }}
                      disabled={loading === file?.id}
                    >
                      {loading === file?.id ? (
                        <Spinner className="size-3" />
                      ) : (
                        <>
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            className="size-3"
                          />
                          Delete
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
    </section>
  );
}
