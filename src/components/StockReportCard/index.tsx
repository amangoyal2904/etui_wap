import Link from "next/link";
import { Fragment, useState, useRef } from "react";
import styles from "./styles.module.scss";
import StockReportBox from "../StockBox";
import StockRightProps from "./ScoreUpgrade";
import UpGradeCard from "./UpGradeCard";
import BottomScore from "./BottomScore";
import StockSRLoginBlocker from "../StockSRLoginBlocker";
import { grxEvent } from "utils/ga";
import { StockSRNoDataFoundCard } from "components/StockSRNoDataFound";

interface StockSRCardProps {
  data: { totalRecords: string; name: string; id: string }[];
  cardType: string;
  totalRecords?: string;
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
  data = [],
  cardType,
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
  const _cardType = cardType;
  const ratingBox = _cardType && _cardType === "upgradeCard" ? true : false;
  const prevScore = _cardType && _cardType === "upgradeCard" ? true : false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const modalRef = useRef(null);
  const seoNameGenrate = stockname && stockname !== "" ? stockname?.trim().replace(/\s/g, "-").toLowerCase() : "";

  const filterNumber = filterId && filterId !== "" ? parseFloat(filterId) : "";
  const filterIdSeo = filterNumber && filterId !== "" ? `,filter-${filterNumber}.cms` : `.cms`;
  const stockSeoname =
    filterSeoName && filterSeoName !== ""
      ? `/markets/stockreportsplus/${filterSeoName}/stockreportscategory/screenerid-${id}${filterIdSeo}`
      : `/markets/stockreportsplus/${seoNameGenrate}/stockreportscategory/screenerid-${id}${filterIdSeo}`;
  const handleClick = (value: boolean, id?: any) => {
    if (!isPrimeUser) {
      setIsModalOpen(value);
      setCompanyId(id);
      if (value) {
        document.body.style.overflow = "hidden";
        grxEvent(
          "event",
          {
            event_category: `SR+ ${srTabActivemenu}`,
            event_action: `${stockname} - Card click`,
            event_label: `${stockname}`
          },
          1
        );
      } else {
        document.body.style.overflow = "visible";
      }
    }
  };

  const cardClickProps = !isPrimeUser ? { onClick: (e) => handleClick(e, true) } : {};

  const handleClickGRX = () => {
    const name = "";
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
  const grxHandle = (name: string, url: string) => {
    grxEvent(
      "event",
      {
        event_category: `SR+ ${srTabActivemenu}`,
        event_action: `${stockname} - ${name} name click`,
        event_label: url
      },
      1
    );
  };

  return (
    <>
      <div className={styles.cardWraper}>
        {data && data.length > 0 ? (
          data.map((item: any, i: any) => (
            <Fragment key={i}>
              <div
                onClick={(e) => handleClick(true, item?.companyID)}
                className={`${styles.cardSec} ${prevScore ? styles.btt : ""}`}
              >
                {isPrimeUser ? (
                  <h2 className={styles.heading}>
                    <Link href={`/${item?.seoName}/stocks/companyid-${item?.companyID}.cms`}>
                      <a
                        title={item?.name}
                        onClick={() =>
                          grxHandle(item?.name, `/${item?.seoName}/stocks/companyid-${item?.companyID}.cms`)
                        }
                        target="_blank"
                      >
                        {item?.name}
                      </a>
                    </Link>
                  </h2>
                ) : (
                  <div className={styles.nameBlur}>no prieme user</div>
                )}
                <div className={styles.boxWraper} data-id={item?.companyID}>
                  <div className={styles.leftSec}>
                    <StockReportBox
                      data={item?.data}
                      ratingBox={ratingBox}
                      seoName={item?.seoName}
                      companyID={item?.companyID}
                      isPrimeUser={isPrimeUser}
                      companyName={item?.name}
                      stockname={stockname}
                      srTabActivemenu={srTabActivemenu}
                    />
                  </div>
                  <div className={styles.rightSec}>
                    {!ratingBox ? (
                      <>
                        <StockRightProps isPrimeUser={isPrimeUser} data={item?.data} />
                      </>
                    ) : (
                      <>
                        <UpGradeCard data={item?.data} />
                      </>
                    )}
                  </div>
                </div>
                {prevScore && (
                  <>
                    <BottomScore data={item?.data} seoName={item?.seoName} companyID={item?.companyID} />
                  </>
                )}
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
          companyId={companyId}
          srTabActivemenu={srTabActivemenu}
          stockname={stockname}
        />
      )}
    </>
  );
}
