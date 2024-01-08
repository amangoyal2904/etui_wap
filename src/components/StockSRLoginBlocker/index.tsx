import styles from "./styles.module.scss";
import { useEffect, useRef } from "react";
import { goToPlanPage } from "../../utils/common";
import APIS_CONFIG from "../../network/config.json";
import { APP_ENV } from "../../utils";

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
}

export default function StockSRLoginBlocker({
  isLoginUser,
  handleClick,
  overlayBlockerData
}: StockSRLoginBlockerProps) {
  const modalRef = useRef(null);
  const loginHandler = () => {
    const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
    return (window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`);
  };
  //console.log("overlayBlockerData", overlayBlockerData);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClick(false);
      }
    };

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
            <span className={styles.subLink} onClick={() => goToPlanPage()}>
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
