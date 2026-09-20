import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  AppleMusicIcon,
  ClapperboardIcon,
  Database01Icon,
  File02Icon,
  FileZipIcon,
  GridTableIcon,
  Image03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import Downloader from "./downloader";
import { useIsMobile } from "@/hooks/use-mobile";
import { play } from "cuelume";
import Controller from "./controller";
import Grid from "./grid";
import ListView from "./list-view";

export default function Files({ starred }: { starred?: boolean }) {
  const [selectedType, setSelectedType] = React.useState<
    Array<"image" | "video" | "audio" | "others" | undefined>
  >([]);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [isGridView, setIsGridView] = React.useState(true);
  type FilesResponse = {
    message: string;
    data: Array<{
      id: string;
      fileUrl: string;
      fileName: string;
      size: string;
      star: boolean;
      type: string;
      userId: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };

  const url = starred ? "/api/files?starred=true" : "/api/files";

  const { data, error, isLoading, mutate } = useSWR<FilesResponse>(
    url,
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

  const filteredFiles = data?.data.filter((file) => {
    if (selectedType.length === 0) return true;
    if (selectedType.includes("image") && file.type.startsWith("image/")) {
      return true;
    }
    if (selectedType.includes("video") && file.type.startsWith("video/")) {
      return true;
    }
    if (selectedType.includes("audio") && file.type.startsWith("audio/")) {
      return true;
    }
    if (
      selectedType.includes("others") &&
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/") &&
      !file.type.startsWith("audio/")
    ) {
      return true;
    }
    return false;
  });

  return (
    <section className="h-full w-full flex flex-col gap-2">
      <section className="w-full p-2 rounded-xl border bg-foreground/5 flex justify-between items-center">
        <div className="text-xs font-semibold text-foreground flex items-center gap-2">
          <Button
            size={"icon"}
            variant={selectedType.includes("image") ? "link" : "ghost"}
            onClick={() => {
              play("toggle");
              if (selectedType.includes("image")) {
                setSelectedType(
                  selectedType.filter((type) => type !== "image"),
                );
              } else {
                setSelectedType([...selectedType, "image"]);
              }
            }}
          >
            <HugeiconsIcon icon={Image03Icon} />
          </Button>
          <Button
            size={"icon"}
            variant={selectedType.includes("video") ? "link" : "ghost"}
            onClick={() => {
              play("toggle");
              if (selectedType.includes("video")) {
                setSelectedType(
                  selectedType.filter((type) => type !== "video"),
                );
              } else {
                setSelectedType([...selectedType, "video"]);
              }
            }}
          >
            <HugeiconsIcon icon={ClapperboardIcon} />
          </Button>
          <Button
            size={"icon"}
            variant={selectedType.includes("audio") ? "link" : "ghost"}
            onClick={() => {
              play("toggle");
              if (selectedType.includes("audio")) {
                setSelectedType(
                  selectedType.filter((type) => type !== "audio"),
                );
              } else {
                setSelectedType([...selectedType, "audio"]);
              }
            }}
          >
            <HugeiconsIcon icon={AppleMusicIcon} />
          </Button>
          <Button
            size={"icon"}
            variant={selectedType.includes("others") ? "link" : "ghost"}
            onClick={() => {
              play("toggle");
              if (selectedType.includes("others")) {
                setSelectedType(
                  selectedType.filter((type) => type !== "others"),
                );
              } else {
                setSelectedType([...selectedType, "others"]);
              }
            }}
          >
            <HugeiconsIcon icon={File02Icon} />
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            size="icon"
            variant={isGridView ? "link" : "ghost"}
            onClick={() => {
              setIsGridView(true);
              isGridView ? play("tick") : play("toggle");
            }}
          >
            <HugeiconsIcon icon={GridTableIcon} />
          </Button>
          <Button
            size="icon"
            variant={isGridView ? "ghost" : "link"}
            onClick={() => {
              setIsGridView(false);
              !isGridView ? play("tick") : play("toggle");
            }}
          >
            <HugeiconsIcon icon={Database01Icon} />
          </Button>
        </div>
      </section>
      {isGridView ? (
        <Grid
          files={filteredFiles}
          mutate={mutate}
          loading={loading}
          setLoading={setLoading}
        />
      ) : (
        <ListView
          files={filteredFiles}
          mutate={mutate}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </section>
  );
}
