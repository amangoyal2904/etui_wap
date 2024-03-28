import styles from "./styles.module.scss";
import { useEffect, useRef } from "react";
import { goToPlanPage, loginInitiatedGA4, pushGA4 } from "../../utils/common";
import APIS_CONFIG from "../../network/config.json";
import { APP_ENV } from "../../utils";
import { grxEvent } from "utils/ga";
interface StockSRLoginBlockerProps {
  isLoginUser: any;
  handleClick: any;
  overlayBlockerData: {
    textForData: string;
    textForReport: string;
    ctaText: string;
    textBenefits: string;
    discCoupon: string;
  };
  srTabActivemenu?: string;
  stockname?: string;
  companyId?: string;
}

export default function StockSRLoginBlocker({
  isLoginUser,
  handleClick,
  overlayBlockerData,
  srTabActivemenu,
  stockname,
  companyId
}: StockSRLoginBlockerProps) {
  const modalRef = useRef(null);
  const loginHandler = () => {
    grxEvent(
      "event",
      {
        event_category: "Subscription Flow ET",
        event_action: `Sign In`,
        event_label: `SR+ ${srTabActivemenu} - ${stockname}`
      },
      1
    );
    loginInitiatedGA4({
      isPaywalled: true,
      entrypoint: "Subscription blocker",
      screenName: "StockReportPlus"
    });
    if (typeof window != "undefined" && typeof window.objInts != "undefined" && window.objInts) {
      window.objInts.initSSOWidget();
    } else {
      const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
      return (window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`);
    }
  };
  const planPageHandler = (cta: string) => {
    const params = {
      cta,
      widget: "paywall_blocker_cta",
      item_category3: "paywall_blocker_cta"
    };

    grxEvent(
      "event",
      {
        event_category: "Subscription Flow ET",
        event_action: `Flow Started`,
        event_label: `SR+ ${srTabActivemenu} - ${stockname} Subscribe Now`
      },
      1
    );
    goToPlanPage(params);
  };
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClick(false);
      }
    };
    const items = {
      item_name: "stock_report_plus_on_company_page",
      item_id: companyId || "",
      item_brand: "market_tools",
      item_category: "stock_report_plus",
      item_category2: "company_page"
    };
    pushGA4("view_item_list", items);
    window.ga4Items = items;
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles.loginWrap}>
        <div className={styles.loginSec} ref={modalRef}>
          <div className={styles.etPrimeLogo}></div>
          <div className={styles.textMember}>{overlayBlockerData.textForData}</div>
          <div className={styles.textMember2}>{overlayBlockerData.textBenefits}</div>
          <div className={styles.subBtn}>
            <span className={styles.subLink} onClick={() => planPageHandler(overlayBlockerData.ctaText)}>
              {overlayBlockerData.ctaText}
            </span>
            {!isLoginUser && (
              <p>
                Already a member?{" "}
                <span className={styles.loginBtn} onClick={loginHandler}>
                  Sign in Now
                </span>
              </p>
            )}
          </div>
          <div className={styles.footerTxt}>{overlayBlockerData.discCoupon}</div>
        </div>
      </div>
    </>
  );
}
