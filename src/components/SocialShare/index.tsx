import { FC } from "react";
import socialshare from "utils/socialshare";
import styles from "./styles.module.scss";
import Bookmark from "components/Bookmark";

interface SocialShareProps {
  shareParam: {
    shareUrl: string;
    title: string;
    msid: string;
    hostId: string;
    type: string;
  };
}

const SocialShare: FC<SocialShareProps> = ({ shareParam }) => {
  return (
    <div className={styles.socialShare}>
      <div className={styles.shareText}>Share this Video</div>
      <div className={styles.socialLinks}>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "wa" })}
          className={`${styles.wa} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "fb" })}
          className={`${styles.fb} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "twt" })}
          className={`${styles.twt} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "lin" })}
          className={`${styles.in} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "email" })}
          className={`${styles.email} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "sms" })}
          className={`${styles.sms} ${styles.commonSprite}`}
        ></span>
        <Bookmark bookmarkProps={{ ...shareParam }}></Bookmark>
      </div>
    </div>
  );
};

export default SocialShare;
