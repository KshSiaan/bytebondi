import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

export default function Downloader({
  url,
  fileName,
  absolute = true,
  ghost = false,
}: {
  url: string;
  fileName: string;
  absolute?: boolean;
  ghost?: boolean;
}) {
  const [preparing, setPreparing] = React.useState(false);
  return (
    <Button
      size="icon-sm"
      variant={ghost ? "ghost" : "secondary"}
      className={
        absolute
          ? "absolute right-11 top-2 size-7 rounded-md border-0 bg-black/50 text-white"
          : "size-7 rounded-md border-0"
      }
      onClick={async () => {
        setPreparing(true);
        try {
          const response = await fetch(url);
          const blob = await response.blob();

          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();

          link.remove();
          URL.revokeObjectURL(blobUrl);
        } catch (error) {
          console.error("Error downloading file:", error);
        } finally {
          setPreparing(false);
        }
      }}
      disabled={preparing}
    >
      {preparing ? (
        <Spinner />
      ) : (
        <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
      )}
    </Button>
  );
}
