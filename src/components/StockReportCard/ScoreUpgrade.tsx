import styles from "./styles.module.scss";

interface StockRightProps {
  data: any[];
  isPrimeUser?: number;
}

export default function StockReportCard({ data, isPrimeUser }: StockRightProps) {
  const sr_targetVsCurrent = data.find((item) => item.keyId === "sr_targetVsCurrent").value;
  const sr_targetVsCurrentClass = data.find((item) => item.keyId === "sr_targetVsCurrent").trend;
  const price = data.find((item) => item.keyId === "sr_priceTargetMean").value;
  const sr_recText = data.find((item) => item.keyId === "sr_recText").value;
  const sr_recTextClass = data.find((item) => item.keyId === "sr_recText").trend;
  const currentPrice = data.find((item) => item.keyId === "lastTradedPrice").value;
  return (
    <>
      <div className={styles.rightSecWrap}>
        <div className={styles.headTxt}>
          Expected <br /> Returs
        </div>

        <div className={`${styles.noParcent} ${styles[sr_targetVsCurrentClass]}`}>{sr_targetVsCurrent}</div>
        <div className={styles.secTxt}>Target</div>
        {isPrimeUser ? <div className={styles.secPrice}>{price}</div> : <div className={styles.lockShow}></div>}
      </div>
      <div className={styles.rightSecWrap}>
        <div className={styles.headTxt}>
          Stock <br /> Recomendation
        </div>
        <div className={`${styles.noParcent} ${styles[sr_recTextClass]}`}>{sr_recText}</div>
        <div className={styles.secTxt}>Current Price</div>
        {isPrimeUser ? <div className={styles.secPrice}>{currentPrice}</div> : <div className={styles.lockShow}></div>}
      </div>
    </>
  );
}
