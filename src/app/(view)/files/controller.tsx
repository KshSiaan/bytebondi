import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
  Delete02Icon,
  MoreVerticalCircle01Icon,
  Share07Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { play } from "cuelume";
import React from "react";

export default function Controller({
  loading,
  setLoading,
  mutate,
  file,
  absolute = true,
  ghost = false,
}: {
  loading: string | null;
  setLoading: (id: string | null) => void;
  mutate: () => void;
  file: {
    id: string;
    fileUrl: string;
    fileName: string;
    size: string;
    star: boolean;
    type: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
  absolute?: boolean;
  ghost?: boolean;
}) {
  const handleDeleteFile = async (fileId: string) => {
    setLoading(fileId);
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        mutate();
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-sm"
          variant={ghost ? "ghost" : "secondary"}
          onPointerDown={(e) => {
            e.stopPropagation();
            play("toggle");
          }}
          className={
            absolute
              ? "absolute right-2 top-2 size-7 rounded-md border-0 bg-black/50 text-white"
              : "size-7 rounded-md border-0"
          }
        >
          <HugeiconsIcon icon={MoreVerticalCircle01Icon} className="size-3.5" />
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
              <HugeiconsIcon icon={Delete02Icon} className="size-3" />
              Delete
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
