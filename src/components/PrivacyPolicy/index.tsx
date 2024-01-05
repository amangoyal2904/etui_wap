import styles from "./styles.module.scss";
import GDPR_DATA from "./data.json";
import { APP_ENV, getCookie, setCookieToSpecificTime, isBotAgent, allowGDPR } from "utils";
import * as Config from "utils/common";
import React, { useState, useEffect } from "react";
import APIS_CONFIG from "network/config.json";
import Service from "network/service";

declare global {
  interface Window {
    // e$: {
    //   jStorage: {
    //     set(arg1: string, arg2: any): any;
    //     get(arg1: string): any;
    //   };
    // };
    geoinfo: {
      CountryCode: string;
      geolocation: string;
      region_code: string;
    };
  }
}

const PrivacyPolicy = () => {
  const [bannerStatus, setBannerStatus] = useState(false);
  const [ccpaRegion, setCcpaRegion] = useState(false);
  const [formShowHide, setFormShowHide] = useState({ formStatus: styles.showBlock, successMsg: styles.hide });
  const [popupStatus, setPopupStatus] = useState({ html: "", status: styles.hide });
  const [checkboxStatus, setCheckboxStatus] = useState({ ducGa: false, advertisingAgree: false });

  useEffect(() => {
    document.addEventListener("touchstart", touchStartHandler, false);
  }, []);

  const touchStartHandler = () => {
    document.removeEventListener("touchstart", touchStartHandler, false);
    typeof window.geoinfo !== "undefined" ? handlePopup() : document.addEventListener("geoLoaded", handlePopup);
  };

  const handlePopup = () => {
    setCcpaRegion(window.geoinfo.geolocation == "2" && window.geoinfo.region_code == "CA");
    const GDPR_notification = parseInt(getCookie("et_consent"));

    if (!allowGDPR()) {
      if (GDPR_notification != 1) {
        if (isBotAgent() != 1) {
          setBannerStatus(true);
          setCookieToSpecificTime("optout", 1, 365, null, null);
          const loginDisable = new Event("loginDisable");
          document.dispatchEvent(loginDisable);
        }
      } else {
        const loginDisable = new Event("loginDisable");
        document.dispatchEvent(loginDisable);
      }
    }
  };

  const hideCCPA = () => {
    typeof window.e$ != "undefined" && window.e$.jStorage.set("et_ccpa_consent", 1);
    setBannerStatus(false);
  };

  const postData = () => {
    const pfuuid = getCookie("pfuuid");
    const headers = {
      Authorization: "7a2e7de8- 95ad-44ad-80d1-af3eb9735439",
      "X-PRIMARY": pfuuid,
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    const data = setData(GDPR_DATA);
    const url = APIS_CONFIG.cookieConsent[APP_ENV],
      payload = JSON.stringify(data);
    Service.post({ url, headers, payload, params: {} })
      .then((res) => {
        console.log(JSON.stringify(res));
      })
      .catch((err) => {
        console.log("PWA cookie consent err: ", err);
      });
    submitCallback();
  };
  const setData = (data) => {
    try {
      const obj = {
        agree: 1,
        dataPoint: {
          id: 5
        },
        text: JSON.stringify({
          duc_ga: checkboxStatus.ducGa ? "Analytics and performance Cookies" : "",
          advertising_agree: checkboxStatus.advertisingAgree ? "Targeted and advertising Cookies" : ""
        })
      };

      if (data.consent && data.consent.consents) {
        data.consent.consents.push(obj);
      }
    } catch (e) {
      console.log("setData:" + e);
    }
    return data;
  };
  const submitCallback = () => {
    if (checkboxStatus.ducGa) {
      localStorage.setItem("gdpr_ga_tracking", "accepted");
    } else {
      //disable GA call if user not selecting checkbox
      const disableKey = "ga-disable-" + Config.GA.GA_ID;
      window[disableKey] = true;
      localStorage.setItem("gdpr_ga_tracking", "notAllowed");
    }
    setPopupStatus({ ...popupStatus, status: styles.hide });
    setFormShowHide({ formStatus: styles.hide, successMsg: styles.showBlock });
    setTimeout(() => {
      setBannerStatus(false);
    }, 2000);
    setCookieToSpecificTime("optout", 0, 365, null, null);
    setCookieToSpecificTime("et_consent", 1, 365, null, null);
  };
  const submitFormHandler = (event) => {
    event.preventDefault();
    postData();
  };

  return (
    bannerStatus && (
      <>
        {ccpaRegion ? (
          typeof window.e$ != "undefined" &&
          !window.e$.jStorage.get("et_ccpa_consent") && (
            <div
              className={`${styles.du_consent} ${
                formShowHide.formStatus == styles.hide ? styles.tcAccepted : ""
              } privacy_block`}
              key="ccpa_privacy_policy"
            >
              <div className={styles.data_use_info}>
                <div className={styles.ccpaBlock}>
                  <p className={styles.heading}>Welcome to The Economic Times</p>
                  <p>
                    We use cookies and other tracking technologies to provide services while browsing the Website to
                    show personalised content and targeted ads, analyse site traffic and understand where our audience
                    is coming from in order to improve your browsing experience on our Website. By continuing to use our
                    Website, you consent to the use of these cookies and accept our Privacy terms. If you wish to see
                    more information about how we process your personal data, please read our{" "}
                    <a href="https://m.economictimes.com/cookiepolicy.cms">Cookie Policy</a>,{" "}
                    <a href="https://m.economictimes.com/privacypolicy.cms?msid=72342689">Privacy Policy</a> and{" "}
                    <a rel="nofollow" href="https://m.economictimes.com/terms-conditions">
                      Terms of Use
                    </a>
                    .
                  </p>
                  <span className={styles.tt_close} onClick={hideCCPA}>
                    x
                  </span>
                </div>
              </div>
            </div>
          )
        ) : (
          <div
            className={`${styles.du_consent} ${
              formShowHide.formStatus == styles.hide ? styles.tcAccepted : ""
            } privacy_block`}
            key="gdpr_privacy_policy"
          >
            <div className={styles.data_use_info}>
              <form id="gdpr_form" onSubmit={(e) => submitFormHandler(e)} className={formShowHide.formStatus}>
                <div className={`${styles.du_message} ${styles.tac}`}>
                  <p className={styles.dum_main}>
                    We use cookies and other tracking technologies to improve your browsing experience on our site, show
                    personalize content and targeted ads, analyze site traffic, and understand where our audience is
                    coming from. You can also read our{" "}
                    <a rel="noreferrer" href="https://m.economictimes.com/privacypolicy.cms" target="_blank">
                      privacy policy.
                    </a>
                    <br />
                    We use cookies to ensure the best experience for you on our website.
                    <br />
                    <br />
                    <b>
                      By choosing I accept, you consent to our use of{" "}
                      <a rel="noreferrer" href="https://m.economictimes.com/cookiepolicy.cms" target="_blank">
                        cookies
                      </a>{" "}
                      and{" "}
                      <a rel="noreferrer" href="https://m.economictimes.com/terms-conditions" target="_blank">
                        terms and conditions.
                      </a>
                    </b>
                  </p>
                </div>
                <span className={styles.tt_close} onClick={() => setBannerStatus(false)}>
                  x
                </span>
                <div className={`${styles.du_tc} ${styles.tac}`}>
                  <input
                    type="checkbox"
                    name="duc_ga"
                    id="duc_ga"
                    data-name="duc_ga"
                    onChange={() => setCheckboxStatus({ ...checkboxStatus, ducGa: !checkboxStatus.ducGa })}
                  />
                  <label htmlFor="duc_ga">Analytics and performance Cookies</label>
                  <span
                    className={styles.info}
                    onClick={() => setPopupStatus({ html: "analytics", status: styles.show })}
                  >
                    i
                  </span>
                </div>
                <div className={`${styles.du_tc} ${styles.tac} ${styles.nac} ${styles.hidden}`}>
                  <input
                    type="checkbox"
                    name="advertising_agree"
                    id="advertising_agree"
                    data-name="advertising_agree"
                    onChange={() =>
                      setCheckboxStatus({ ...checkboxStatus, advertisingAgree: !checkboxStatus.advertisingAgree })
                    }
                  />
                  <label htmlFor="advertising_agree">Targeted and advertising Cookies</label>
                  <span
                    className={styles.info}
                    onClick={() => setPopupStatus({ html: "advertising", status: styles.show })}
                  >
                    i
                  </span>
                </div>
                <input type="submit" className={styles.du_submit} value="I Accept" />
              </form>
            </div>
            <h2 className={`${styles.du_success} ${formShowHide.successMsg} `}>
              Thank you! your feedback is important to us.
            </h2>
          </div>
        )}
        <div className={`${styles.tooltip_box} ${popupStatus.status ? popupStatus.status : styles.hide} `}>
          <span className={styles.tt_close} onClick={() => setPopupStatus({ ...popupStatus, status: styles.hide })}>
            x
          </span>
          <div>
            {popupStatus.html == "analytics" ? (
              <div>
                These cookies are used to collect information about traffic to our Services and how users use our
                Services. The information gathered does not identify any individual visitor. The information is
                aggregated and therefore anonymous. It includes the number of visitors to our Services, the websites
                that referred them to our Services, the pages that they visited on our Services, what time of day they
                visited our Services, whether they have visited our Services before, and other similar information. We
                use this information to help operate our Services more efficiently, to gather broad demographic
                information and to monitor the level of activity on our Services. We use Google Analytics for this
                purpose. Google Analytics uses its own cookies. It is only used to improve how our Services works. You
                can find out more information about Google Analytics cookies here:{" "}
                <a
                  rel="noreferrer"
                  href="https://developers.google.com/analytics/resources/concepts/gaConceptsCookies"
                  target="_blank"
                >
                  https://developers.google.com/analytics/resources/concepts/gaConceptsCookies
                </a>
                <br />
                You can find out more about how Google protects your data here:{" "}
                <a rel="noreferrer" href="https://www.google.com/analytics/learn/privacy.html" target="_blank">
                  www.google.com/analytics/learn/privacy.html.
                </a>
              </div>
            ) : (
              <p>
                These cookies track your browsing habits to enable us to show advertising which is more likely to be of
                interest to you. These cookies use information about your browsing history to group you with other users
                who have similar interests. Based on that information, and with our permission, third-party advertisers
                can place cookies to enable them to show adverts which we think will be relevant to your interests while
                you are on third-party websites. These cookies also store your location, including your latitude,
                longitude, and GeoIP region ID, which helps us show you locale-specific news and allows our Services to
                operate more efficiently. If you choose to remove targeted or advertising cookies, you will still see
                adverts but they may not be relevant to you.
              </p>
            )}
          </div>
        </div>
      </>
    )
  );
};

export default PrivacyPolicy;
