import styles from "./styles.module.scss";

export default function SocialShare() {
  return (
    <div className={styles.socialShare}>
      <div className={styles.shareText}>Share this Video</div>
      <div className={styles.socialLinks}>
        <span className={styles.wa}></span>
        <span className={styles.fb}></span>
        <span className={styles.twt}></span>
        <span className={styles.in}></span>
        <span className={styles.email}></span>
        <span className={styles.sms}></span>
        <span className={styles.bookmark}></span>
      </div>
    </div>
  );
}
