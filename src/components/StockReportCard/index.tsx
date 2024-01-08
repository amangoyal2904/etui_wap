import Link from "next/link";
import { Fragment, useState, useRef } from "react";
import styles from "./styles.module.scss";
import StockReportBox from "../StockBox";
import StockRightProps from "./ScoreUpgrade";
import UpGradeCard from "./UpGradeCard";
import BottomScore from "./BottomScore";
import StockSRLoginBlocker from "../StockSRLoginBlocker";

interface StockSRCardProps {
  data: { totalRecords: string; name: string; id: string }[];
  cardType: string;
  totalRecords?: string;
  id?: string;
  isPrimeUser?: number;
  isLoginUser: any;
  overlayBlockerData: any;
}

export default function StockReportCard({
  data,
  cardType,
  totalRecords,
  id,
  isPrimeUser,
  isLoginUser,
  overlayBlockerData
}: StockSRCardProps) {
  const _cardType = cardType;
  const ratingBox = _cardType && _cardType === "upgradeCard" ? true : false;
  const prevScore = _cardType && _cardType === "upgradeCard" ? true : false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const handleClick = (value: boolean) => {
    //console.log("click to button");
    setIsModalOpen(value);
    if (value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  };

  const cardClickProps = !isPrimeUser ? { onClick: () => handleClick(true) } : {};
  return (
    <>
      <div className={styles.cardWraper}>
        {data.map((item: any, i: any) => (
          <Fragment key={i}>
            <div {...cardClickProps} className={`${styles.cardSec} ${prevScore ? styles.btt : ""}`}>
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
                    isPrimeUser={isPrimeUser}
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
      {isModalOpen && (
        <StockSRLoginBlocker
          overlayBlockerData={overlayBlockerData}
          isLoginUser={isLoginUser}
          handleClick={handleClick}
        />
      )}
    </>
  );
}
