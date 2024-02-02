import Link from "next/link";
import { Fragment } from "react";
import styles from "./styles.module.scss";
import { grxEvent } from "utils/ga";

interface GraphSecProps {
  data: any[];
  seoName: string;
  companyID: string;
  isPrimeUser: number;
  companyName?: string;
  stockname?: string;
  srTabActivemenu?: string;
}

export default function GraphSecCard({
  data,
  seoName,
  companyID,
  isPrimeUser,
  companyName,
  stockname,
  srTabActivemenu
}: GraphSecProps) {
  const viewReportUrl = `https://m.economictimes.com/${seoName}/stockreports/reportid-${companyID}.cms`;
  const sr_analystScore = data.find((item) => item.keyId === "sr_recText").value;
  const sr_recCnt = data.find((item) => item.keyId === "sr_recCnt").value;
  const recoByCount = Math.round(sr_recCnt);

  const sr_recStrongBuyCnt = data.find((item) => item.keyId === "sr_recStrongBuyCnt").value;
  const recoStrongBuy = Math.round(sr_recStrongBuyCnt);
  const recoStrongBuyValue = `${recoStrongBuy === 0 ? 5 : (recoStrongBuy / recoByCount) * 100 + 5}%`;

  const sr_recBuyCnt = data.find((item) => item.keyId === "sr_recBuyCnt").value;
  const recoBuy = Math.round(sr_recBuyCnt);
  const recoBuyValue = `${recoBuy === 0 ? 5 : (recoBuy / recoByCount) * 100 + 5}%`;

  const sr_recHoldCnt = data.find((item) => item.keyId === "sr_recHoldCnt").value;
  const recoHold = Math.round(sr_recHoldCnt);
  const recoHoldValue = `${recoHold === 0 ? 5 : (recoHold / recoByCount) * 100 + 5}%`;

  const sr_recSellCnt = data.find((item) => item.keyId === "sr_recSellCnt").value;
  const recoSell = Math.round(sr_recSellCnt);
  const recoSellValue = `${recoSell === 0 ? 5 : (recoSell / recoByCount) * 100 + 5}%`;

  const sr_recReduceCnt = data.find((item) => item.keyId === "sr_recReduceCnt").value;
  const recoStrongSell = Math.round(sr_recReduceCnt);
  const recoStrongSellValue = `${recoStrongSell === 0 ? 5 : (recoStrongSell / recoByCount) * 100 + 5}%`;
  const grxHandle = () => {
    grxEvent(
      "event",
      {
        event_category: `SR+ ${srTabActivemenu}`,
        event_action: `${stockname} - ${companyName} View Report`,
        event_label: window.location.pathname
      },
      1
    );
  };
  return (
    <>
      <h3 className={styles.heading3}>{sr_analystScore}</h3>
      <h4 className={styles.heading4}>Mean Recos by {recoByCount} Analysts</h4>
      <div className={styles.stockRecoChart}>
        <div className={`${styles.bar} ${styles.strongSell}`}>
          <div className={styles.graphBoxWraper}>
            <div className={styles.graphBox} style={{ height: `${recoStrongSellValue}` }}></div>
          </div>
          <div className={styles.topTxt}>{recoStrongSell}</div>
          <div className={styles.btmTxt}>Strong Sell</div>
        </div>
        <div className={`${styles.bar} ${styles.sell}`}>
          <div className={styles.graphBoxWraper}>
            <div className={styles.graphBox} style={{ height: `${recoSellValue}` }}></div>
          </div>
          <div className={styles.topTxt}>{recoSell}</div>
          <div className={styles.btmTxt}>Sell</div>
        </div>
        <div className={`${styles.bar} ${styles.hold}`}>
          <div className={styles.graphBoxWraper}>
            <div className={styles.graphBox} style={{ height: `${recoHoldValue}` }}></div>
          </div>
          <div className={styles.topTxt}>{recoHold}</div>
          <div className={styles.btmTxt}>Hold</div>
        </div>
        <div className={`${styles.bar} ${styles.buy}`}>
          <div className={styles.graphBoxWraper}>
            <div className={styles.graphBox} style={{ height: `${recoBuyValue}` }}></div>
          </div>
          <div className={styles.topTxt}>{recoBuy}</div>
          <div className={styles.btmTxt}>Buy</div>
        </div>
        <div className={`${styles.bar} ${styles.strongBuy}`}>
          <div className={styles.graphBoxWraper}>
            <div className={styles.graphBox} style={{ height: `${recoStrongBuyValue}` }}></div>
          </div>
          <div className={styles.topTxt}>{recoStrongBuy}</div>
          <div className={styles.btmTxt}>Strong Buy</div>
        </div>
      </div>
      {isPrimeUser ? (
        <Link href={viewReportUrl}>
          <a className={styles.reportSec} target="_blank" onClick={grxHandle}>
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
    </>
  );
}
