import Loading from "components/Loading";
import { FC, useEffect } from "react";

interface VideoEmbedProps {
  url: string;
  onIframeLoadTask: any;
  showLoader: any;
}
const VideoEmbed: FC<VideoEmbedProps> = ({ url, onIframeLoadTask, showLoader }) => {
  useEffect(() => {
    let timeout: any;
    const videoEle: any = document.getElementById("videoShow");
    if (videoEle?.contentWindow) {
      timeout = setTimeout(() => onIframeLoadTask(), 5000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <div className="videoContainer">
        {showLoader ? (
          <div className="loaderWrapper">
            <Loading />
          </div>
        ) : (
          ""
        )}
        <iframe id="videoShow" className="videoFrame" src={url} title="Video" loading="lazy"></iframe>
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
        .loaderWrapper {
          height: 210px;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default VideoEmbed;
