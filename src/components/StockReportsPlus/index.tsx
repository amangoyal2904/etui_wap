import Link from "next/link";
import { Fragment } from "react";
import styles from "./styles.module.scss";
import GreyDivider from "components/GreyDivider";
import Image from "next/image";
import FeatureSecProps from "./featuresec";
import PrimeSecInfoSec from "./primesecinfo";
import FaqInfoSec from "./faqsecinfo";

interface StockReportsPlusProps {
  data?: { title: string; item: any }[];
  isPrimeUser?: number;
}

export default function StockReportsPlus({ data, isPrimeUser }: StockReportsPlusProps) {
  console.log("___isPrimeUser", isPrimeUser);
  return (
    <>
      <div className={styles.topSec}>
        <div className={styles.stock_wrapper}>
          <div className={styles.topHead}>
            <span className={`${styles.topHeadInner} ${styles.stockReportsSprite}`}></span>
          </div>
          <div className={styles.captionHead}>
            In-depth Reports on 4000+ Stocks worth ₹ 1499 included with
            <span className={styles.redTxt}>ETPrime</span>
          </div>
          <div className={styles.stockBanner}></div>

          <div className={styles.btnTextWraper}>
            <button data-url="/stockreport/plans.cms?dc=ETPMONSN5T&track=stockreport">Subscribe Now</button>
            <p>
              Already a Member?
              <span className={styles.linkAnchor}>Sign In now</span>
            </p>
          </div>
        </div>
      </div>
      <GreyDivider />
      <FeatureSecProps isPrimeUser={isPrimeUser} isLogin={false} />
      <GreyDivider />
      <PrimeSecInfoSec isPrimeUser={isPrimeUser} isLogin={false} />
      <GreyDivider />
      <FaqInfoSec isPrimeUser={isPrimeUser} isLogin={false} />
    </>
  );
}
