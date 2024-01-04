import styles from "./styles.module.scss";

interface ReturnCardProps {
  data: any[];
  isPrimeUser: number;
}

export default function ReturnCard({ data, isPrimeUser }: ReturnCardProps) {
  const sr_targetVsCurrent = data.find((item) => item.keyId === "sr_targetVsCurrent").value;
  const calssUpDown = data.find((item) => item.keyId === "sr_targetVsCurrent").trend;
  const sr_priceTargetMean = data.find((item) => item.keyId === "sr_priceTargetMean").value;
  const lastTradedPrice = data.find((item) => item.keyId === "lastTradedPrice").value;
  return (
    <>
      <div className={styles.rightSecWrap}>
        <div className={`${styles.returnCardWrap} ${styles[calssUpDown]}`}>
          <div className={styles.card}>
            <div className={styles.txt}>Expected Return</div>
            <div className={styles.value}>{sr_targetVsCurrent}</div>
          </div>
          <div className={`${styles.card} ${styles.middleCard}`}>
            <div className={styles.txt}>1Y Target</div>
            {isPrimeUser ? (
              <div className={styles.value}>{sr_priceTargetMean}</div>
            ) : (
              <div className={styles.priceBlur}></div>
            )}
          </div>
          <div className={`${styles.card} ${styles.bottomCard}`}>
            <div className={styles.txt}>Current Price</div>
            {isPrimeUser ? (
              <div className={styles.value}>{lastTradedPrice}</div>
            ) : (
              <div className={styles.priceBlur}></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
