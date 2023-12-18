import Link from "next/link";
import { Fragment } from "react";
import styles from "./styles.module.scss";
import StockReportBox from "../StockBox";
import StockRightProps from "./ScoreUpgrade";
import UpGradeCard from "./UpGradeCard";
import BottomScore from "./BottomScore";

interface StockSRCardProps {
  data: { totalRecords: string; name: string; id: string }[];
  cardType: string;
  totalRecords?: string;
  id?: string;
  isPrimeUser?: number;
}

export default function StockReportCard({ data, cardType, totalRecords, id, isPrimeUser }: StockSRCardProps) {
  const _cardType = cardType;
  const ratingBox = _cardType && _cardType === "upgradeCard" ? true : false;
  const prevScore = _cardType && _cardType === "upgradeCard" ? true : false;

  return (
    <>
      <div className={styles.cardWraper}>
        {data.map((item: any, i: any) => (
          <Fragment key={i}>
            <div className={`${styles.cardSec} ${prevScore ? styles.btt : ""}`}>
              {isPrimeUser ? (
                <h2 className={styles.heading}>
                  <Link
                    href={`https://economictimes.indiatimes.com/${item.seoName}/stocks/companyid-${item.companyID}.cms`}
                  >
                    <a target="_blank">{item.name}</a>
                  </Link>
                </h2>
              ) : (
                <div className={styles.nameBlur}>no prieme user</div>
              )}
              <div className={styles.boxWraper}>
                <div className={styles.leftSec}>
                  <StockReportBox
                    data={item.data}
                    ratingBox={ratingBox}
                    seoName={item.seoName}
                    companyID={item.companyID}
                  />
                </div>
                <div className={styles.rightSec}>
                  {!ratingBox ? (
                    <>
                      <StockRightProps isPrimeUser={isPrimeUser} data={item.data} />
                    </>
                  ) : (
                    <>
                      <UpGradeCard data={item.data} />
                    </>
                  )}
                </div>
              </div>
              {prevScore && (
                <>
                  <BottomScore data={item.data} seoName={item.seoName} companyID={item.companyID} />
                </>
              )}
            </div>
          </Fragment>
        ))}
        {totalRecords && totalRecords !== "0" && (
          <Link href={`/markets/stockreportscategory/screenerid-${id}.cms`}>
            <a className={styles.viewAllCta}>
              <span>View All {totalRecords} stocks</span>
            </a>
          </Link>
        )}
      </div>
    </>
  );
}
