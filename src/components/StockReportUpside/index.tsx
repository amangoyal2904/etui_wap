import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import styles from "./styles.module.scss";
import ReturnCard from "./ReturnCard";
import GraphSecCard from "./GraphSecCard";
import StockSRLoginBlocker from "../StockSRLoginBlocker";

interface StockSRCardProps {
  data: { title: string; item: any }[];
  totalRecords: string;
  id?: string;
  isPrimeUser?: number;
  isLoginUser: any;
  overlayBlockerData: any;
}

export default function StockReportCard({
  data,
  totalRecords,
  id,
  isPrimeUser,
  isLoginUser,
  overlayBlockerData
}: StockSRCardProps) {
  //console.log("___isPrimeUser", isPrimeUser);
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
        {data.map((item: any, i) => (
          <Fragment key={i}>
            <div {...cardClickProps} className={`${styles.cardSec}`}>
              <div className={styles.boxWraper}>
                <div className={styles.leftSec}>
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

                  <GraphSecCard
                    isPrimeUser={isPrimeUser}
                    data={item.data}
                    seoName={item.seoName}
                    companyID={item.companyID}
                  />
                </div>
                <div className={styles.rightSec}>
                  <ReturnCard isPrimeUser={isPrimeUser} data={item.data} />
                </div>
              </div>
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
