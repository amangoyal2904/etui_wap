import { FC } from "react";

interface VideoEmbedProps {
  url: string;
}
const VideoEmbed: FC<VideoEmbedProps> = ({ url }) => {
  return (
    <>
      <div className="videoContainer">
        <iframe className="videoFrame" src={url} title="Video" loading="lazy"></iframe>
      </div>
      <style jsx>{`
        .videoFrame {
          width: 100%;
          min-height: 200px;
        }

        .videoContainer {
          position: relative;
          padding-top: 56.25%;
          overflow: hidden;
        }
        .videoContainer iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
      `}</style>
    </>
  );
};

export default VideoEmbed;
