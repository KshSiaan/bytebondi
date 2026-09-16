import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  Database01Icon,
  Download01Icon,
  GridTableIcon,
  Image03Icon,
  MoreVerticalCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import React from "react";
import useSWR from "swr";

export default function Files() {
  const [selectedType, setSelectedType] = React.useState<
    "images" | "videos" | "audios" | "others" | undefined
  >();
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

  const { data, error, isLoading } = useSWR<FilesResponse>(
    "/api/files",
    (url: string) => fetch(url).then((res) => res.json()),
  );

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
          <Button size="xs" variant="ghost">
            3 Images
          </Button>
          <Button size="xs" variant="ghost">
            3 Videos
          </Button>
          <Button size="xs" variant="ghost">
            3 Audios
          </Button>
          <Button size="xs" variant="ghost">
            3 Others
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            size="icon"
            variant={isGridView ? "default" : "ghost"}
            onClick={() => setIsGridView(true)}
          >
            <HugeiconsIcon icon={GridTableIcon} />
          </Button>
          <Button
            size="icon"
            variant={isGridView ? "ghost" : "default"}
            onClick={() => setIsGridView(false)}
          >
            <HugeiconsIcon icon={Database01Icon} />
          </Button>
        </div>
      </section>
      <section
        className={cn(
          "flex-1 w-full grid grid-cols-6 gap-2 p-2 overflow-y-auto",
        )}
      >
        {data?.data.map((file) => (
          <div
            key={file?.id}
            className="group w-full h-min overflow-hidden rounded-xl border bg-card p-1.5 transition-all hover:border-foreground/20 hover:shadow-sm"
          >
            {/* Preview */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              {file?.type.startsWith("image/") ? (
                <Image
                  src={file?.fileUrl}
                  alt={file?.fileName}
                  height={200}
                  width={400}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div></div>
              )}

              {/* File type */}
              <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                <HugeiconsIcon icon={Image03Icon} className="size-3" />
                <span>IMAGE</span>
              </div>

              {/* More */}
              <Button
                size="icon-sm"
                variant="secondary"
                className="absolute right-2 top-2 size-7 rounded-md border-0 bg-black/50 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-black/70 hover:text-white"
              >
                <HugeiconsIcon
                  icon={MoreVerticalCircle01Icon}
                  className="size-3.5"
                />
              </Button>
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
