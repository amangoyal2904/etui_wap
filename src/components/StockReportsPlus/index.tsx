import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import GreyDivider from "components/GreyDivider";
import FeatureSecProps from "./featuresec";
import PrimeSecInfoSec from "./primesecinfo";
import FaqInfoSec from "./faqsecinfo";
import ReportSliderSec from "./reportsslider";
import ShowSearchUISec from "./showsearchui";
import APIS_CONFIG from "../../network/config.json";
import { APP_ENV } from "../../utils";
import { goToPlanPage } from "../../utils/common";
import { grxEvent } from "utils/ga";

interface StockReportsPlusProps {
  isPrimeUser?: number;
  isLoginUser?: number;
  faqdata: any;
  userName?: string;
}

export default function StockReportsPlus({ isPrimeUser, faqdata, isLoginUser, userName }: StockReportsPlusProps) {
  const [showSearchUI, setShowSearchUI] = useState(false);
  const showSearchFilter = () => {
    document.body.style.overflow = "hidden";
    setShowSearchUI(true);
  };
  const handlerCloseSearch = () => {
    setShowSearchUI(false);
    document.body.style.overflow = "visible";
  };

  const loginHandler = () => {
    grxEvent(
      "event",
      {
        event_category: "Subscription Flow",
        event_action: `Subscribe Now`,
        event_label: `Stock Report  - Proposition Page`
      },
      1
    );
    if (typeof window != "undefined" && typeof window.objInts != "undefined" && window.objInts) {
      window.objInts.initSSOWidget();
    } else {
      const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
      return (window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`);
    }
  };
  const planPageHandler = () => {
    grxEvent(
      "event",
      {
        event_category: "Subscription Flow",
        event_action: `Subscribe Now`,
        event_label: `Stock Report  - Proposition Page`
      },
      1
    );
    goToPlanPage();
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
          <button onClick={planPageHandler}>Subscribe To et prime</button>
          <p>
            Already subscribed?<span className={styles.linkAnchor}>Restore Purchase</span>
          </p>
        </div>
      );
    } else {
      return (
        <div className={styles.btnTextWraper}>
          <button onClick={planPageHandler}>Subscribe Now</button>
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
  const trackedSections = document.querySelectorAll(".topSec1, .topSec2, .topSec3, .topSec4, .topSec5");
  const trackedSectionSet = new Set();
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      const { target } = entry;
      if (entry.isIntersecting && !trackedSectionSet.has(target)) {
        trackGAEvent(target.className);
        trackedSectionSet.add(target);
      }
    });
  };
  const trackGAEvent = (sectionClassName) => {
    // =====
    const getClassName = getSectionNumber(sectionClassName);
    grxEvent(
      "event",
      {
        event_category: "Stock Report  - Proposition Page' : 'Stock Report - Viewer",
        event_action: `Scroll`,
        event_label: `${getClassName}`
      },
      1
    );
  };
  const getSectionNumber = (classname: string) => {
    const match = classname.match(/topSec(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });
    trackedSections.forEach((section) => observer.observe(section));
    // Clean up the Intersection Observer when the component is unmounted
    return () => {
      trackedSections.forEach((section) => observer.unobserve(section));
    };
  }, []);
  return (
    <>
      <div className={`${styles.topSec} topSec1`}>
        <div className={`${styles.stock_wrapper}`}>
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
