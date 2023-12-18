import Link from "next/link";
import { Fragment } from "react";
import styles from "./styles.module.scss";
import ReturnCard from "./ReturnCard";
import GraphSecCard from "./GraphSecCard";

interface StockSRCardProps {
  data: { title: string; item: any }[];
  totalRecords: string;
  id?: string;
  isPrimeUser?: number;
}

export default function StockReportCard({ data, totalRecords, id, isPrimeUser }: StockSRCardProps) {
  console.log("___isPrimeUser", isPrimeUser);
  return (
    <>
      <div className={styles.cardWraper}>
        {data.map((item: any, i) => (
          <Fragment key={i}>
            <div className={`${styles.cardSec}`}>
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

                  <GraphSecCard data={item.data} seoName={item.seoName} companyID={item.companyID} />
                </div>
                <div className={styles.rightSec}>
                  <ReturnCard data={item.data} />
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
    </>
  );
}
