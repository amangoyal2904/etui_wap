import styles from "./styles.module.scss";

interface StockRightProps {
  data: any[];
}

export default function UpGradeCard({ data }: StockRightProps) {
  const sr_analystScore = data.find((item) => item.keyId === "sr_analystScore").value;
  const earningsScore = Math.round(sr_analystScore);

  const sr_fundScore = data.find((item) => item.keyId === "sr_fundScore").value;
  const fundamentalsScore = Math.round(sr_fundScore);

  const sr_rvScore = data.find((item) => item.keyId === "sr_rvScore").value;
  const relativeValuationScore = Math.round(sr_rvScore);

  const sr_riskScore = data.find((item) => item.keyId === "sr_riskScore").value;
  const riskScore = Math.round(sr_riskScore);

  const sr_techScore = data.find((item) => item.keyId === "sr_techScore").value;
  const priceMomentumScore = Math.round(sr_techScore);
  return (
    <>
      <div className={styles.upgradeCard}>
        <div className={styles.boxGraph}>
          <p>Earnings</p>
          <div className={styles.graphBg}>
            <span className={`${styles.valueBox}`} style={{ left: `${earningsScore}0%` }}>
              {earningsScore}
            </span>
          </div>
        </div>
        <div className={styles.boxGraph}>
          <p>Fundamentals</p>
          <div className={styles.graphBg}>
            <span className={`${styles.valueBox}`} style={{ left: `${fundamentalsScore}0%` }}>
              {fundamentalsScore}
            </span>
          </div>
        </div>
        <div className={styles.boxGraph}>
          <p>Relative Valuation</p>
          <div className={styles.graphBg}>
            <span className={`${styles.valueBox}`} style={{ left: `${relativeValuationScore}0%` }}>
              {relativeValuationScore}
            </span>
          </div>
        </div>
        <div className={styles.boxGraph}>
          <p>Risk</p>
          <div className={styles.graphBg}>
            <span className={`${styles.valueBox}`} style={{ left: `${riskScore}0%` }}>
              {riskScore}
            </span>
          </div>
        </div>
        <div className={styles.boxGraph}>
          <p>Price Momentum</p>
          <div className={styles.graphBg}>
            <span className={`${styles.valueBox}`} style={{ left: `${priceMomentumScore}0%` }}>
              {priceMomentumScore}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
