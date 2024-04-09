import React, { useEffect, useState, FC } from "react";

import PaywallBenefits from "components/PaywallBenefits";
import { PageProps } from "types/stockreportscategory";
import { isLiveApp } from "utils/articleUtility";
import LoginWidget from "components/LoginSdk";
import { grxEvent } from "utils/ga";
import { getCookie } from "utils";
import SEO from "components/SEO";

import styles from "./redeemetmhrilstyles.module.scss";
import LazyLoadImg from "components/LazyLoad";
import Benefits from "./Data.json";

const Redeemetmhril: FC<PageProps> = (props) => {
  const [vouchedRedeemed, setVouchedRedeemed] = useState({ redeemed: false, msg: "" });
  const [invalidVoucher, setInvalidVoucher] = useState({ invalid: false, msg: "" });
  const [prefillIdentifier, setPrefillIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [userToken, setUserToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const { seo = {}, version_control } = props;
  const seoData = { ...seo, ...version_control?.seo };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const usertoken = queryParams.get("usertoken");
    if (usertoken) {
      setUserToken(usertoken);
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(isMobile);

    if (typeof window.objInts !== "undefined") {
      userState();
    } else if (typeof document !== "undefined") {
      document.addEventListener("objIntsLoaded", userState);
    }
  }, []);

  useEffect(() => {
    if (userToken) {
      const endPoint = `https://${
        isLiveApp() ? "select" : "select1"
      }.clubmahindra.com/check-valid-token-callback?token=${userToken}&et_flag=1`;
      const requestOptions = {
        body: JSON.stringify({}),
        method: "POST"
      };

      fetch(endPoint, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result && result?.memberInfo) {
            setVoucherCode(result?.memberInfo?.etVoucher);
            setPrefillIdentifier(result?.memberInfo?.EmailID || result?.memberInfo?.ContactNumber);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userToken]);

  const userState = () => {
    console.log(window.objUser, "User Details");
    if (typeof window.objUser !== "undefined") {
      window.objUser.afterLoginCall(() => {
        if (window.objUser.info.isLogged) {
          setLoggedIn(true);
        }
      });
    }
  };

  const setConfigMessage = (response) => {
    try {
      let configResponseMsg = response.message;
      const getdate = (dt) => {
        // return dateFormat(dt, '%d-%M-%Y');
        return dt;
      };
      const responseMessage = {
        3000: "Subscription created successfully",
        3001: "Invalid voucher code",
        3002: "Voucher already redeemed. Please enter new voucher code",
        3003: "Voucher code has expired on " + getdate(response.expiryDate) + ". Please enter valid code",
        3004:
          "You are currently enjoying a " +
          response.trialDays +
          "-days free trial plan. Please cancel your membership by " +
          getdate(response.cancelDate) +
          ". After cancellation, you can re-apply this voucher code",
        3005:
          "Voucher applied successfully! Your current " +
          response.trialDays +
          "-days free trial will expire on " +
          getdate(response.trialEndDate) +
          ". Your new " +
          response.planType +
          " plan will be automatically activated from " +
          getdate(response.voucherActivationDate),
        3006:
          "Voucher applied successfully! Your current plan will expire on " +
          getdate(response.planEndDate) +
          ". Your new " +
          response.planType +
          " plan will be automatically activated from " +
          getdate(response.voucherActivationDate) +
          ".",
        3007:
          "Please cancel your existing membership by " +
          getdate(response.cancelDate) +
          ". After cancellation, you can re-apply this voucher code.",
        3008:
          "Voucher applied successfully! Your current plan will expire on " +
          getdate(response.planEndDate) +
          ". Your new " +
          response.planType +
          " plan will be automatically activated from " +
          getdate(response.voucherActivationDate) +
          ".",
        3009:
          "Voucher applied successfully! Your current plan will expire on " +
          getdate(response.planEndDate) +
          ". Your new " +
          response.planType +
          " plan will be automatically activated from " +
          getdate(response.voucherActivationDate) +
          "."
      };
      if (response && response.code && responseMessage[response.code]) {
        configResponseMsg = responseMessage[response.code];
      }

      return configResponseMsg;
    } catch (e) {
      console.log(e);
    }
  };

  const apiHit = () => {
    setIsLoading(true);
    const headers = {
      "X-SITE-APP-CODE": isLiveApp() ? "04e2b3dc222d26d7ffa0ed3d3285cce6" : "7a3514a35e5493b739659ba1bb9ea0a9",
      "X-TOKEN": window.objInts.readCookie("OTR") || getCookie("OTR")
    };

    const endPoint = `https://${
      isLiveApp() ? "subscriptions" : "testsubscription"
    }.economictimes.indiatimes.com/api/subscription/redeemVoucher?productCode=ET&merchantCode=ET&country_code=IN&voucherCode=${voucherCode}`;
    const requestOptions = {
      body: JSON.stringify({}),
      method: "POST",
      headers: headers
    };

    fetch(endPoint, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setIsLoading(false);
        setInvalidVoucher({ invalid: false, msg: "" });
        const msg = setConfigMessage(result);
        if (result.status == "FAILURE") {
          setInvalidVoucher({ invalid: true, msg });
          grxEvent(
            "event",
            {
              event_category: "Redeem voucher",
              event_action: "Redeem Clicked - LoggedIn",
              event_label: `{${voucherCode}} Invalid Voucher Code {Mahindra}`
            },
            1
          );
        } else {
          setVouchedRedeemed({ redeemed: true, msg });
          grxEvent(
            "event",
            {
              event_category: "Redeem voucher",
              event_action: "Redeem Clicked - LoggedIn",
              event_label: `{${voucherCode}} Redeemed Voucher Code {Mahindra}`
            },
            1
          );
        }
      })
      .catch((error) => {
        setVoucherCode("");
        setIsLoading(false);
        console.log(error, "Error code");
        const errorMsg =
          error.responseJSON.statusCode == "4277" && error.responseJSON.code == "500"
            ? "Login with an email to redeem the voucher"
            : "Something went wrong. Please retry after sometime";
        grxEvent(
          "event",
          {
            event_category: "Redeem voucher",
            event_action: "Redeem Clicked - LoggedIn",
            event_label: `{${voucherCode}} Invalid Voucher Code {Mahindra}`
          },
          1
        );
        setInvalidVoucher({ invalid: true, msg: errorMsg });
      });
  };

  const handleChange = (e) => setVoucherCode(e?.target?.value);

  const onCtaClick = () => {
    if (!voucherCode?.trim()) {
      setInvalidVoucher({ invalid: true, msg: "Voucher Code should not be blank" });
    } else if (!loggedIn) {
      grxEvent(
        "event",
        {
          event_category: "Redeem voucher",
          event_action: "Redeem Clicked - LoggedOut",
          event_label: `{${voucherCode}} Voucher Code {Mahindra}`
        },
        1
      );
      if (typeof window != "undefined" && typeof window.objInts != "undefined" && window.objInts) {
        window.objInts.initSSOWidget({ prefill_identifier: prefillIdentifier });
      } else {
        // typeof window.e$ != 'undefined' && window.e$.jStorage.set('userlogin_ru', window.location.href, {TTL:(15*60*1000)});
        window.location.href = `https://${
          isLiveApp() ? "buy" : "dev-buy"
        }.indiatimes.com/clogin.cms?ref=ET&flag=etredeem&ru=${window.location.href}`;
      }
    } else {
      apiHit();
    }
  };

  return (
    <React.Fragment>
      <SEO {...seoData} />
      <header className={`${styles.pageHeader} skipInts`}>
        <a href="https://economictimes.indiatimes.com/">
          <LazyLoadImg large={false} img="https://img.etimg.com/photo/msid-74651805.cms" alt="ET Logo" height={24} />
        </a>
      </header>
      <div className={styles.redeemContainer}>
        <div className={styles.content}>
          <div className={styles.brandLogos}>
            <img alt="Prime" height="21" src="https://img.etimg.com/photo/108092512.cms" />
            <span className={styles.seperator} />
            <img alt="Club Mahindra" height="56" src="https://img.etimg.com/photo/108605272.cms" />
          </div>
          <p className={styles.heading}>Exclusive offer for ClubM Select Members</p>
          <p className={styles.subheading}>Redeem your voucher to activate your ETPrime membership.</p>
        </div>
        <div className={styles.redeemBoxParent}>
          <div className={styles.redeemBox}>
            {vouchedRedeemed?.redeemed ? (
              <h4>{vouchedRedeemed?.msg}</h4>
            ) : (
              <>
                <div className={styles.fullWidth}>
                  <p className={styles.voucherLabel}>Enter Voucher Code</p>
                  <input type="text" value={voucherCode} maxLength={20} onChange={handleChange} />
                  {invalidVoucher?.invalid && <p className={styles.errorMsg}>{invalidVoucher?.msg}</p>}
                </div>
                <button onClick={onCtaClick} disabled={!voucherCode || isLoading} className={styles.cta}>
                  {loggedIn ? "Redeem" : "Login & Redeem"}
                </button>
              </>
            )}
          </div>
          <p className={styles.disclaimer}>
            For any other query, you can reach out to us at <u>care@etprime.com</u>
          </p>
        </div>
      </div>
      <div>
        <p className={styles.benefitHeading}>What’s included with ETPrime membership</p>
        <div className={styles.benefits}>
          <PaywallBenefits data={Benefits} />
        </div>
      </div>
      <LoginWidget />
    </React.Fragment>
  );
};
export default Redeemetmhril;
