import { Fragment } from "react";
import styles from "./styles.module.scss";

interface FeatureSecProps {
  isPrimeUser?: number;
  isLogin?: boolean;
}

export default function FeatureSec({ isPrimeUser, isLogin }: FeatureSecProps) {
  return (
    <>
      <div className={styles.featureSec}>
        <div className={styles.stock_wrapper}>
          <div className={styles.smallHead}>FEATURES &amp; BENEFITS</div>
          <div className={styles.boxHead}>What you get with Stock Reports Plus?</div>
          <ul className={styles.stockList}>
            <li className={styles.investIcn}>
              <h5>Make Investment decisions</h5>
              <p>
                with proprietary stock scores on earnings, fundamentals, relative valuation, risk and price momentum
              </p>
            </li>
            <li className={styles.newIdea}>
              <h5>Find new Trading ideas</h5>
              <p>with weekly updated scores and analysts forecasts on key data points</p>
            </li>
            <li className={styles.analysisIcn}>
              <h5>In-Depth analysis</h5>
              <p>of company and its peers through independent research, ratings, and market data</p>
            </li>
          </ul>
          {isLogin ? (
            <div className={styles.skipTrialUser}>
              <span>Sandeep, now </span> enjoy <strong>Stock Reports Plus</strong> worth <strong>₹1,499*</strong>{" "}
              offered complimentary with your <span className={styles.redTxt}>ETPrime</span> membership
              <p>
                *As per competitive benchmarking of annual price. <a href="/terms-conditions">T&amp;C apply</a>
              </p>
            </div>
          ) : (
            <div className={styles.stockViewRepo}>
              <span data-ru="/tata-consultancy-services-ltd/stockreports/reportid-8345.cms" className={styles.loginBtn}>
                Login to View Sample Report
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
