import { Fragment } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";
import RatingBox from "./RatingBox";
import { grxEvent } from "utils/ga";

interface StockCardBoxProps {
  data: any[];
  ratingBox: boolean;
  seoName: string;
  companyID: string;
  isPrimeUser: number;
  companyName?: string;
  stockname?: string;
  srTabActivemenu?: string;
}

export default function StockReportBox({
  data,
  ratingBox,
  seoName,
  companyID,
  isPrimeUser,
  companyName,
  stockname,
  srTabActivemenu
}: StockCardBoxProps) {
  const sr_avgScore = data.find((item) => item.keyId === "sr_avgScore").value;
  const viewReportUrl = `https://m.economictimes.com/${seoName}/stockreports/reportid-${companyID}.cms`;
  const grxHandle = () => {
    grxEvent(
      "event",
      {
        event_category: `SR+ ${srTabActivemenu}`,
        event_action: `${stockname} - ${companyName} View Report`,
        event_label: window.location.href
      },
      1
    );
  };
  const boxComData = () => {
    return (
      <>
        <div className={styles.scoreSec}>
          <span className={styles.bigNo}>{Math.round(sr_avgScore)}</span>
          <span className={styles.smallNo}>10</span>
        </div>
        <div className={styles.scoreTxt}>Stock Score</div>
        <span className={styles.reportSec}>
          <i className={styles.viewPdf}></i>
          <span className={styles.reportTxt}>View Report</span>
        </span>
      </>
    );
  };
  return (
    <>
      <Fragment>
        <div className={styles.smallCard}>
          {isPrimeUser ? (
            <Link href={viewReportUrl}>
              <a onClick={grxHandle} target="_blank">
                {boxComData()}
              </a>
            </Link>
          ) : (
            boxComData()
          )}
        </div>
        {ratingBox ? <RatingBox /> : ""}
      </Fragment>
    </>
  );
}
