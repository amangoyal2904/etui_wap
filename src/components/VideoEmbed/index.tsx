import { FC } from "react";
import styles from "./styles.module.scss";

interface VideoEmbedProps {
  url: string;
}
const VideoEmbed: FC<VideoEmbedProps> = ({ url }) => {
  return (
    <>
      <div className={styles.vidWrap}>
        <iframe className={styles.style1} src={url} title="Video"></iframe>
      </div>
    </>
  );
};

export default VideoEmbed;
