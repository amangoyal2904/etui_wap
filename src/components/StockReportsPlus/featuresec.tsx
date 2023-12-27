import { Fragment } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";

interface FeatureSecProps {
  isPrimeUser?: number;
  isLogin?: number;
  userName?: string;
  loginHandler?: any;
}

export default function FeatureSec({ isPrimeUser, isLogin, userName, loginHandler }: FeatureSecProps) {
  const genRateData = () => {
    if (isPrimeUser && isLogin) {
      return (
        <div className={styles.skipTrialUser}>
          <span>{userName}, now </span> enjoy <strong>Stock Reports Plus</strong> worth <strong>₹1,499*</strong> offered
          complimentary with your <span className={styles.redTxt}>ETPrime</span> membership
          <p>
            *As per competitive benchmarking of annual price. <a href="/terms-conditions">T&amp;C apply</a>
          </p>
        </div>
      );
    } else if (!isPrimeUser && isLogin) {
      return (
        <div className={styles.stockViewRepo}>
          <span className={styles.sampleLinkData}>Still Curious?</span>
          <Link href="/tata-consultancy-services-ltd/stockreports/reportid-8345.cms">
            <a className={styles.smapleLinkAnchor} target="_blank">
              View Sample Report
            </a>
          </Link>
        </div>
      );
    } else {
      return (
        <div className={styles.stockViewRepo}>
          <span className={styles.loginBtn} onClick={() => loginHandler()}>
            Login to View Sample Report
          </span>
        </div>
      );
    }
  };
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
          {genRateData()}
        </div>
      </div>
    </>
  );
}
