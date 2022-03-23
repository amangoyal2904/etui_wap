import { NextPage } from "next";
import styles from './styles.module.scss';

const VideoEmbed: NextPage<any> = (props) => {
  return (
    <>
      <div>
        <iframe className={styles.style1} src='https://m.economictimes.com/videodash.cms?autostart=1&msid=90200064' />
      </div>
    </>
  );
};

export default VideoEmbed;
