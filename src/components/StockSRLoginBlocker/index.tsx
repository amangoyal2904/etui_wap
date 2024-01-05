import styles from "./styles.module.scss";
import { useEffect, useRef } from "react";
import { goToPlanPage } from "../../utils/common";
import APIS_CONFIG from "../../network/config.json";
import { APP_ENV } from "../../utils";

interface StockSRLoginBlockerProps {
  isLoginUser: any;
  handleClick: any;
}

export default function StockSRLoginBlocker({ isLoginUser, handleClick }: StockSRLoginBlockerProps) {
  const modalRef = useRef(null);
  const loginHandler = () => {
    const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
    return (window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`);
  };
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
          <div className={styles.textMember}>Exclusive stock reports are accessible for ET Prime Member Only.</div>
          <div className={styles.textMember2}>Become a member & unlock all the data and reports now.</div>
          <div className={styles.subBtn}>
            <span className={styles.subLink} onClick={() => goToPlanPage()}>
              Subscribe Now
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
          <div className={styles.footerTxt}>Special Offer: Flat 20% off on ET Prime</div>
        </div>
      </div>
    </>
  );
}
