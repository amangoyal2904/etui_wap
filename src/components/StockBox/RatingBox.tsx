import styles from "./styles.module.scss";

export default function RatingBox() {
  return (
    <>
      <div className={styles.ratingBox}>
        <div className={styles.norating}>No Rating (NR)</div>
        <div className={styles.negative}>Negative</div>
        <div className={styles.neutral}>Neutral</div>
        <div className={styles.positive}>Positive</div>
      </div>
    </>
  );
}
