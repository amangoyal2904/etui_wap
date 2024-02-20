import React, { useEffect, useState } from "react";
import Image from "next/image";

import LoginWidget from "components/LoginWidget";
import TOIBenefitsWap from "./TOIBenefitsWap";
import TOIBenefitsWeb from "./TOIBenefitsWeb";
import { grxEvent } from "utils/ga";
import { getCookie } from "utils";

import styles from "./redeemstyles.module.scss";

const TOIRedeemBenefit = () => {
  const [vouchedRedeemed, setVouchedRedeemed] = useState({ redeemed: false, msg: "" });
  const [invalidVoucher, setInvalidVoucher] = useState({ invalid: false, msg: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const voucherCode = queryParams.get("redeemvoucher");
    if (voucherCode) {
      setVoucherCode(voucherCode);
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(isMobile);

    if (typeof window.objInts !== "undefined") {
      window.objInts.afterPermissionCall(userState);
    } else if (typeof document !== "undefined") {
      document.addEventListener("objIntsLoaded", () => {
        window.objInts.afterPermissionCall(userState);
      });
    }
  }, []);

  const userState = () => {
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
    const lh = window.location.host,
      isLive = lh.indexOf("localhost:3000") !== -1 || lh.indexOf("dev8243") != -1 || lh.indexOf("etpwa") != -1 ? 0 : 1;
    const headers = {
      "X-SITE-APP-CODE": isLive ? "04e2b3dc222d26d7ffa0ed3d3285cce6" : "7a3514a35e5493b739659ba1bb9ea0a9",
      "X-TOKEN": window.objInts.readCookie("OTR") || getCookie("OTR")
    };

    const endPoint = `https://${window.objVc.subscriptions}.economictimes.indiatimes.com/api/subscription/redeemVoucher?productCode=TOIPLUS&merchantCode=TOI&country_code=IN&voucherCode=${voucherCode}`;
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
              event_category: "TOI Landing Page",
              event_action: "Redeem Clicked - LoggedIn",
              event_label: `{${voucherCode}} Invalid Voucher Code`
            },
            1
          );
        } else {
          setVouchedRedeemed({ redeemed: true, msg });
          grxEvent(
            "event",
            {
              event_category: "TOI Landing Page",
              event_action: "Redeem Clicked - LoggedIn",
              event_label: `{${voucherCode}} Redeemed Voucher Code`
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
            event_category: "TOI Landing Page",
            event_action: "Redeem Clicked - LoggedIn",
            event_label: `{${voucherCode}} Invalid Voucher Code`
          },
          1
        );
        setInvalidVoucher({ invalid: true, msg: errorMsg });
      });
  };

  const handleChange = (e) => setVoucherCode(e?.target?.value);

  const onCtaClick = () => {
    const lh = window.location.host,
      isLive = lh.indexOf("localhost:3000") !== -1 || lh.indexOf("dev8243") != -1 || lh.indexOf("etpwa") != -1 ? 0 : 1;
    if (!voucherCode?.trim()) {
      setInvalidVoucher({ invalid: true, msg: "Voucher Code should not be blank" });
    } else if (!loggedIn) {
      grxEvent(
        "event",
        {
          event_category: "TOI Landing Page",
          event_action: "Redeem Clicked - LoggedOut",
          event_label: `{${voucherCode}} Voucher Code`
        },
        1
      );

      if (typeof window != "undefined" && typeof window.objInts != "undefined" && window.objInts) {
        window.objInts.initSSOWidget();
      } else {
        // typeof window.e$ != 'undefined' && window.e$.jStorage.set('userlogin_ru', window.location.href, {TTL:(15*60*1000)});
        window.location.href = `https://${
          isLive ? "buy" : "dev-buy"
        }.indiatimes.com/clogin.cms?ref=TOI&flag=toiredeem&ru=${window.location.href}`;
      }
    } else {
      apiHit();
    }
  };

  return (
    <React.Fragment>
      <header className={styles.pageHeader}>
        <Image alt="TOI Logo" width={80} height={24} src="https://economictimes.indiatimes.com/photo/107824390.cms" />
      </header>
      <div className={styles.redeemContainer}>
        <div className={styles.content}>
          <p className={styles.title}>You&apos;re just a step away from TOI+ member-only benefits.</p>
          <p className={styles.desc}>Redeem your voucher to activate your TOI+ membership.</p>
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
            For any other query you can reach out to us at toipluscare@timesofindia.com
          </p>
        </div>
      </div>
      {!isMobile && <TOIBenefitsWeb />}
      {isMobile && <TOIBenefitsWap />}
      <LoginWidget />
    </React.Fragment>
  );
};
export default TOIRedeemBenefit;
