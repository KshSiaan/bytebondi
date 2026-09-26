import { MyPlayer } from "@/components/core/player";
import "@arraypress/waveform-player/dist/waveform-player.css";
import { WaveformPlayer } from "@arraypress/waveform-player-react";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

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
  return (
    <div className="h-full w-full flex-1">
      {file.type.startsWith("video/") ? (
        <Suspense fallback={<Spinner />}>
          <div className="w-full h-[80dvh]">
            <MyPlayer src={file?.fileUrl} />
          </div>
        </Suspense>
      ) : (
        <div className="bg-foreground p-6 rounded-xl">
          <WaveformPlayer
            url={file.fileUrl}
            title={file.fileName}
            waveformStyle="mirror"
            showBPM
            waveformColor={["#fafafa", "#71717a"]}
          />
        </div>
      )}
    </div>
  );
}
