"use client";
import { MyPlayer } from "@/components/core/player";
import "@arraypress/waveform-player/dist/waveform-player.css";
import { WaveformPlayer } from "@arraypress/waveform-player-react";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useTheme } from "next-themes";

export default function Viewer({
  file,
}: {
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
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <div className="h-full w-full flex-1">
      {file.type.startsWith("video/") ? (
        <Suspense fallback={<Spinner />}>
          <div className="w-full h-[80dvh]">
            <MyPlayer src={file?.fileUrl} />
          </div>
        </Suspense>
      ) : (
        <div className="bg-background p-6 rounded-xl">
          <WaveformPlayer
            url={file.fileUrl}
            title={file.fileName}
            waveformStyle="mirror"
            showBPM
            colorPreset={resolvedTheme === "dark" ? "dark" : "light"}
            waveformColor={
              resolvedTheme === "dark"
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(0, 0, 0, 0.2)"
            }
            progressColor={
              resolvedTheme === "dark"
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(0, 0, 0, 0.8)"
            }
          />
        </div>
      )}
    </div>
  );
}
