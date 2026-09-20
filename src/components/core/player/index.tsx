import "@videojs/react/video/skin.css";
import { VideoPlayer, VideoSkin, Video } from "@videojs/react/video";

interface MyPlayerProps {
  src: string;
}

export const MyPlayer = ({ src }: MyPlayerProps) => {
  return (
    <VideoPlayer>
      <VideoSkin>
        <Video src={src} playsInline />
      </VideoSkin>
    </VideoPlayer>
  );
};
