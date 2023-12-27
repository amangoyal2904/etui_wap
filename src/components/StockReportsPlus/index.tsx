import Link from "next/link";
import { Fragment, useState } from "react";
import styles from "./styles.module.scss";
import GreyDivider from "components/GreyDivider";
import Image from "next/image";
import FeatureSecProps from "./featuresec";
import PrimeSecInfoSec from "./primesecinfo";
import FaqInfoSec from "./faqsecinfo";
import ReportSliderSec from "./reportsslider";
import ShowSearchUISec from "./showsearchui";
import APIS_CONFIG from "../../network/config.json";
import { APP_ENV } from "../../utils";
import { goToPlanPage } from "../../utils/common";

interface StockReportsPlusProps {
  data?: { title: string; item: any }[];
  isPrimeUser?: number;
  isLoginUser?: number;
  faqdata: any;
  userName?: string;
}

export default function StockReportsPlus({ data, isPrimeUser, faqdata, isLoginUser, userName }: StockReportsPlusProps) {
  //console.log("___isPrimeUser", isPrimeUser);
  const [showSearchUI, setShowSearchUI] = useState(false);
  const showSearchFilter = () => {
    document.body.style.overflow = "hidden";
    setShowSearchUI(true);
  };
  const handlerCloseSearch = () => {
    //console.log("yes");
    setShowSearchUI(false);
    document.body.style.overflow = "visible";
  };

  const loginHandler = () => {
    const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
    return (window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`);
  };

  const userBaseDataGen = () => {
    if (isPrimeUser && isLoginUser) {
      return (
        <div className={styles.searchExploreNow}>
          <button onClick={showSearchFilter}>Search Stock Reports</button>
        </div>
      );
    } else if (!isPrimeUser && isLoginUser) {
      return (
        <div className={styles.btnTextWraper}>
          <button onClick={() => goToPlanPage()}>Subscribe To et prime</button>
          <p>
            Already subscribed?<span className={styles.linkAnchor}>Restore Purchase</span>
          </p>
        </div>
      );
    } else {
      return (
        <div className={styles.btnTextWraper}>
          <button onClick={() => goToPlanPage()}>Subscribe Now</button>
          <p>
            Already a Member?
            <span className={styles.linkAnchor} onClick={loginHandler}>
              Sign In now
            </span>
          </p>
        </div>
      );
    }
  };
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
          {userBaseDataGen()}
        </div>
      </div>
      <GreyDivider />
      <FeatureSecProps
        loginHandler={loginHandler}
        userName={userName}
        isPrimeUser={isPrimeUser}
        isLogin={isLoginUser}
      />
      <GreyDivider />
      {isPrimeUser ? (
        <ReportSliderSec />
      ) : (
        <PrimeSecInfoSec
          goToPlanPage={goToPlanPage}
          isPrimeUser={isPrimeUser}
          isLogin={isLoginUser}
          userName={userName}
        />
      )}

      <GreyDivider />
      <FaqInfoSec faqdata={faqdata} />
      {showSearchUI && <ShowSearchUISec oncloseSearch={handlerCloseSearch} />}
    </>
  );
}
