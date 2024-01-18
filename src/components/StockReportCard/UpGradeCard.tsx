import styles from "./styles.module.scss";

interface StockRightProps {
  data: any[];
}

export default function UpGradeCard({ data }: StockRightProps) {
  const sr_analystScore = data.find((item) => item.keyId === "sr_analystScore").value;
  const earningsScore = Math.round(sr_analystScore);
  const earningsClass = data.find((item) => item.keyId === "sr_analystScore").trend;

  const sr_fundScore = data.find((item) => item.keyId === "sr_fundScore").value;
  const fundamentalsScore = Math.round(sr_fundScore);
  const fundamentalsClass = data.find((item) => item.keyId === "sr_fundScore").trend;

  const sr_rvScore = data.find((item) => item.keyId === "sr_rvScore").value;
  const relativeValuationScore = Math.round(sr_rvScore);
  const relativeValuationClass = data.find((item) => item.keyId === "sr_rvScore").trend;

  const sr_riskScore = data.find((item) => item.keyId === "sr_riskScore").value;
  const riskScore = Math.round(sr_riskScore);
  const riskScoreClass = data.find((item) => item.keyId === "sr_riskScore").trend;

  const sr_techScore = data.find((item) => item.keyId === "sr_techScore").value;
  const priceMomentumScore = Math.round(sr_techScore);
  const priceMomentumClass = data.find((item) => item.keyId === "sr_techScore").trend;
  return (
    <>
      <div className={styles.upgradeCard}>
        <div className={styles.boxGraph}>
          <p>Earnings</p>
          <div className={styles.graphBg}>
            <span className={`${styles.valueBox} ${styles[earningsClass]}`} style={{ left: `${earningsScore}0%` }}>
              {earningsScore === 0 ? <span className={styles.navalue}>NA</span> : earningsScore}
            </span>
          </div>
        </div>
        <div className={styles.boxGraph}>
          <p>Fundamentals</p>
          <div className={styles.graphBg}>
            <span
              className={`${styles.valueBox} ${styles[fundamentalsClass]}`}
              style={{ left: `${fundamentalsScore}0%` }}
            >
              {fundamentalsScore === 0 ? <span className={styles.navalue}>NA</span> : fundamentalsScore}
            </span>
          </div>
        </div>
        <div className={styles.boxGraph}>
          <p>Relative Valuation</p>
          <div className={styles.graphBg}>
            <span
              className={`${styles.valueBox} ${styles[relativeValuationClass]}`}
              style={{ left: `${relativeValuationScore}0%` }}
            >
              {relativeValuationScore === 0 ? <span className={styles.navalue}>NA</span> : relativeValuationScore}
            </span>
          </div>
        </div>
        <div className={styles.boxGraph}>
          <p>Risk</p>
          <div className={styles.graphBg}>
            <span className={`${styles.valueBox} ${styles[riskScoreClass]}`} style={{ left: `${riskScore}0%` }}>
              {riskScore === 0 ? <span className={styles.navalue}>NA</span> : riskScore}
            </span>
          </div>
        </div>
        <div className={styles.boxGraph}>
          <p>Price Momentum</p>
          <div className={styles.graphBg}>
            <span
              className={`${styles.valueBox} ${styles[priceMomentumClass]}`}
              style={{ left: `${priceMomentumScore}0%` }}
            >
              {priceMomentumScore === 0 ? <span className={styles.navalue}>NA</span> : priceMomentumScore}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
