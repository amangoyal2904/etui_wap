import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import styles from "./styles.module.scss";
import ReturnCard from "./ReturnCard";
import GraphSecCard from "./GraphSecCard";
import StockSRLoginBlocker from "../StockSRLoginBlocker";
import StockSRNoDataFoundCard from "../StockSRNoDataFound";
import { grxEvent } from "utils/ga";

interface StockSRCardProps {
  data: { title: string; item: any }[];
  totalRecords: string;
  id?: string;
  isPrimeUser?: number;
  isLoginUser: any;
  overlayBlockerData: any;
  stockname: string;
  filterSeoName?: string;
  filterId?: any;
  srTabActivemenu?: string;
}

export default function StockReportCard({
  data,
  totalRecords,
  id,
  isPrimeUser,
  isLoginUser,
  overlayBlockerData,
  stockname,
  filterSeoName,
  filterId,
  srTabActivemenu
}: StockSRCardProps) {
  //console.log("___isPrimeUser", isPrimeUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const seoNameGenrate = stockname && stockname !== "" ? stockname?.trim().replace(/\s/g, "-").toLowerCase() : "";

  const stockSeoname =
    filterSeoName && filterSeoName !== ""
      ? `/markets/stockreportsplus/${filterSeoName}/stockreportscategory/screenerid-${id},filter-2371.cms`
      : `/markets/stockreportsplus/${seoNameGenrate}/stockreportscategory/screenerid-${id},filter-2371.cms`;
  const handleClick = (value: boolean) => {
    //console.log("click to button");
    setIsModalOpen(value);
    if (value) {
      grxEvent(
        "event",
        {
          event_category: `SR+ ${srTabActivemenu}`,
          event_action: `${stockname} - Card click`,
          event_label: `${stockname}`
        },
        1
      );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  };
  const grxHandle = (name: string) => {
    grxEvent(
      "event",
      {
        event_category: `SR+ ${srTabActivemenu}`,
        event_action: `${stockname} - ${name} name click`,
        event_label: window.location.pathname
      },
      1
    );
  };
  const cardClickProps = !isPrimeUser ? { onClick: () => handleClick(true) } : {};
  const handleClickGRX = () => {
    grxEvent(
      "event",
      {
        event_category: `SR+ ${srTabActivemenu}`,
        event_action: `${stockname} - View All`,
        event_label: window.location.pathname
      },
      1
    );
  };

  return (
    <>
      <div className={styles.cardWraper}>
        {data && data.length > 0 ? (
          data.map((item: any, i) => (
            <Fragment key={i}>
              <div {...cardClickProps} className={`${styles.cardSec}`}>
                <div className={styles.boxWraper}>
                  <div className={styles.leftSec}>
                    {isPrimeUser ? (
                      <h2 className={styles.heading}>
                        <Link href={`/${item.seoName}/stocks/companyid-${item.companyID}.cms`}>
                          <a title={item.name} onClick={() => grxHandle(item.name)} target="_blank">
                            {item.name}
                          </a>
                        </Link>
                      </h2>
                    ) : (
                      <div className={styles.nameBlur}>no prime user</div>
                    )}

                    <GraphSecCard
                      isPrimeUser={isPrimeUser}
                      data={item.data}
                      seoName={item.seoName}
                      companyID={item.companyID}
                      srTabActivemenu={srTabActivemenu}
                      stockname={stockname}
                      companyName={item.name}
                    />
                  </div>
                  <div className={styles.rightSec}>
                    <ReturnCard isPrimeUser={isPrimeUser} data={item.data} />
                  </div>
                </div>
              </div>
            </Fragment>
          ))
        ) : (
          <StockSRNoDataFoundCard />
        )}
        {totalRecords && totalRecords !== "0" ? (
          <Link href={stockSeoname}>
            <a title={`View All ${totalRecords} stocks`} className={styles.viewAllCta} onClick={handleClickGRX}>
              <span>View All {totalRecords} stocks</span>
            </a>
          </Link>
        ) : (
          ""
        )}
      </div>
      {isModalOpen && (
        <StockSRLoginBlocker
          overlayBlockerData={overlayBlockerData}
          isLoginUser={isLoginUser}
          handleClick={handleClick}
          srTabActivemenu={srTabActivemenu}
          stockname={stockname}
        />
      )}
    </>
  );
}
