import { FC } from "react";
import socialshare from "utils/socialshare";
import styles from "./styles.module.scss";
interface SocialShareProps {
  shareParam: {
    shareUrl: string;
    title: string;
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
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "bm" })}
          className={`${styles.bookmark} ${styles.commonSprite}`}
        ></span>
      </div>
    </div>
  );
};

export default SocialShare;
