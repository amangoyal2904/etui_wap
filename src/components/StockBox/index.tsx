import { Fragment } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";
import RatingBox from "./RatingBox";

interface StockCardBoxProps {
  data: any[];
  ratingBox: boolean;
  seoName: string;
  companyID: string;
  isPrimeUser: number;
}

export default function StockReportBox({ data, ratingBox, seoName, companyID, isPrimeUser }: StockCardBoxProps) {
  const sr_avgScore = data.find((item) => item.keyId === "sr_avgScore").value;
  const viewReportUrl = `https://economictimes.indiatimes.com/${seoName}/stockreports/reportid-${companyID}.cms`;
  return (
    <>
      <Fragment>
        <div className={styles.smallCard}>
          <div className={styles.scoreSec}>
            <span className={styles.bigNo}>{Math.round(sr_avgScore)}</span>
            <span className={styles.smallNo}>10</span>
          </div>
          <div className={styles.scoreTxt}>Stock Score</div>
          {isPrimeUser ? (
            <Link href={viewReportUrl}>
              <a className={styles.reportSec} target="_blank">
                <i className={styles.viewPdf}></i>
                <span className={styles.reportTxt}>View Report</span>
              </a>
            </Link>
          ) : (
            <span className={styles.reportSec}>
              <i className={styles.viewPdf}></i>
              <span className={styles.reportTxt}>View Report</span>
            </span>
          )}
        </div>
        {ratingBox ? <RatingBox /> : ""}
      </Fragment>
    </>
  );
}
