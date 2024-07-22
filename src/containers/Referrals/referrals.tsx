import React, { useEffect, useState, FC } from "react";
import { useRouter } from "next/router";

import { fetchAllMetaInfo, isLiveApp } from "utils/articleUtility";
import { initializeUnifiedAppLoginHandlers } from "utils/webview";
import { PageProps } from "types/stockreportscategory";
import APIS_CONFIG from "../../network/config.json";
import LoginWidget from "components/LoginSdk";
import { getCookie, APP_ENV } from "utils";
import ErrorDialog from "./ErrorDialog";
import { grxEvent } from "utils/ga";
import SEO from "components/SEO";

import styles from "./referrals.module.scss";
import { loginInitiatedGA4 } from "utils/common";

declare global {
  interface Window {
    tilAppWebBridge: any;
    webkit: any;
  }
}

const Referrals: FC<PageProps> = (props) => {
  const router = useRouter();

  const [appUserData, setAppUserData] = useState({ platform: "", ssoid: "" });
  const [isEligible, setIsElegible] = useState({ loading: true, flag: false });
  const [referralLink, setReferralLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metaInfo, setMetaInfo] = useState<any>({});
  const [isCopied, setIsCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const { seo = {}, version_control } = props;
  const seoData = { ...seo, ...version_control?.seo };

  const fromApp = router.query.frmapp ? router.query.frmapp : "";
  const platform = router.query.platform ? router.query.platform : "";
  const isWebView = fromApp ? ["aos", "ios", "yes"].includes(`${fromApp}`) : false;

  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      isWebView ? initiateWebBridgeConnection() : window.objInts.afterPermissionCall(getUserInfo);
    } else {
      document.addEventListener("objIntsLoaded", () => {
        isWebView ? initiateWebBridgeConnection() : window.objInts.afterPermissionCall(getUserInfo);
      });
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(isMobile);

    grxEvent("event", { event_category: "Referral Page", event_action: "Page loaded", event_label: "N/A" }, 1);
    fetchMeta();

    return () => {
      isWebView && document.removeEventListener("objIntsLoaded", initiateWebBridgeConnection);
    };
  }, []);

  const initiateWebBridgeConnection = () => {
    initializeUnifiedAppLoginHandlers(fromApp, (user) => {
      console.log("CB of Start Web Bridge", user);
      if (typeof window.objInts != undefined && typeof window.objUser != undefined && user) {
        user["platform"] = platform;
        setAppUserData(user);
        const userData = user || {};
        const permissionsArr: Array<string> =
          (typeof userData.permissions != "undefined" && userData.permissions) || [];
        const isValidUser = isWebView || permissionsArr?.includes("loggedin");
        if (isValidUser) {
          const isSubscribed = permissionsArr.includes("subscribed") || permissionsArr.includes("etadfree_subscribed");
          setIsElegible({ loading: false, flag: isSubscribed });
        } else {
          setIsElegible({ loading: false, flag: false });
        }
      } else {
        window.saveLogs({ type: "referearn", res: "error", msg: `Params missing ${user}` });
      }
    });
  };

  const fetchMeta = async () => {
    const data = await fetchAllMetaInfo(105842328);
    setMetaInfo(data);
  };

  const getUserInfo = () => {
    if (window.objUser.info.isLogged) {
      const isSubscribed =
        typeof window.objInts != "undefined" && window.objInts.permissions.indexOf("subscribed") > -1;
      setIsElegible({ loading: false, flag: isSubscribed });
    }
  };

  const loginMapping = () => {
    if (window.objUser.info.isLogged) {
      window.objUser.logout(() => {
        window.location.reload();
      });
    } else {
      loadLogin();
    }
  };

  const loadLogin = () => {
    loginInitiatedGA4({
      isPaywalled: false,
      entrypoint: "Feature Login",
      screenName: "Referrals"
    });
    if (typeof window != "undefined" && typeof window.objInts != "undefined" && window.objInts) {
      window.objInts.initSSOWidget();
    } else {
      const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
      window.location.href = `${loginUrl}?ru=${window.location.href}`;
    }
  };

  const socialShare = (flag) => {
    grxEvent(
      "event",
      { event_category: "Referral Page", event_action: "Share", event_label: flag === "Copy" ? "N/A" : flag },
      1
    );
    if (flag === "Copy") {
      if (isWebView) {
        const dataToPost = { type: "copy", value: referralLink };
        if (appUserData?.platform === "ios") {
          window.webkit.messageHandlers.tilAppWebBridge.postMessage(JSON.stringify(dataToPost));
        } else {
          window.tilAppWebBridge.postMessage(JSON.stringify(dataToPost));
        }
      } else {
        window.navigator.clipboard.writeText(referralLink);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      }
    } else {
      const text =
        "Hello! I am an ETPrime member & I have access to exclusive updates & member-only benefits. It has made my daily investment decisions simple and better. Use my invite link to make informed decisions with in-depth insights";
      if (isWebView) {
        const dataToPost = { type: "share", value: `${text} ${referralLink}` };
        if (appUserData.platform === "ios") {
          window.webkit.messageHandlers.tilAppWebBridge.postMessage(JSON.stringify(dataToPost));
        } else {
          window.tilAppWebBridge.postMessage(JSON.stringify(dataToPost));
        }
      } else if (isMobile) {
        const shareData = {
          text: text,
          title: "ET Referrals",
          url: referralLink
        };
        try {
          window.navigator.share(shareData);
        } catch (err) {
          console.log(err);
        }
      } else {
        let shareUrl: string;
        switch (flag) {
          case "Twitter":
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
              referralLink
            )}`;
            break;
          case "Whatsapp":
            shareUrl = `https://api.whatsapp.com//send?text=${encodeURIComponent(text)} ${encodeURIComponent(
              referralLink
            )}`;
            break;
          case "LinkedIn":
            shareUrl = `https://www.linkedin.com/shareArticle?url=${referralLink}`;
            break;
        }
        window.open(shareUrl, "_blank", "");
      }
    }
  };

  const shortLink = (longLink) => {
    const endPoint = `https://${
        isLiveApp() ? "economictimes" : "etdev8243"
      }.indiatimes.com/tinyurl_feed.cms?upcache=2&feedtype=etjson&url=${encodeURIComponent(longLink)}`,
      requestOptions = { method: "GET" };

    fetch(endPoint, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setReferralLink(result?.url);
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  const generateReferralCode = () => {
    setIsLoading(true);
    const ssoID = getCookie("ssoid") || appUserData?.ssoid;
    const endPoint = APIS_CONFIG.etReferrals[APP_ENV],
      requestOptions = {
        method: "GET",
        headers: { Authorization: ssoID }
      };
    fetch(endPoint, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const refLink =
          (metaInfo?.CCIOnlineAuthorName ||
            "https://buy.indiatimes.com/ET/not/plans?groupCodes=NonLoggedIn_2&dealCode=ref1000&offerType=Social&optz=1&acqSource=Referral&acqSubSource=") +
          result.referralCode;
        grxEvent("event", { event_category: "Referral Page", event_action: "Generate Link", event_label: "N/A" });
        shortLink(refLink);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <React.Fragment>
      <SEO {...seoData} />
      <div className={styles.referreralContainer}>
        <div className={`skipInts ${styles.et_referrals}`}>
          {!isWebView && (
            <div className={styles.head_sec}>
              <a className={styles.head_logo} href="/"></a>
              <span className={styles.head_seperator}></span>
              <span className={styles.head_seperator}></span>
              <a className={styles.head_primelogo} href="/"></a>
            </div>
          )}

          <section className={styles.info_section}>
            <p className={styles.title}>
              Invite your friends to experience <span className={styles.brandColor}>ETPrime.</span>
            </p>
            <p className={styles.desc}>Refer &amp; Get Rewarded.</p>
            <span className={styles.referralCreative} />
            <div className={styles.share_content}>
              <div className={styles.hideOnMWeb}>
                <p className={styles.offer_heading}>Not just knowledge, they get an amazing offer too!</p>
                <ul>
                  <li>{metaInfo?.Abbreviation}</li>
                  <li>You get an Amazon voucher worth ₹500</li>
                </ul>
              </div>
              <p className={`${styles.offer_heading} ${styles.hideOnWeb}`}>You get an Amazon Voucher worth Rs. 500/-</p>
              <div className={styles.link_box}>
                <span className={styles.referralLink}>{referralLink}</span>
                <button
                  disabled={!!referralLink || isLoading || !isEligible?.flag}
                  onClick={generateReferralCode}
                  className={styles.generate_btn}
                >
                  Generate Link
                </button>
              </div>
              <p className={styles.share_heading}>Share Referral Link:</p>
              <div className={styles.share_btns}>
                <button disabled={!referralLink} onClick={() => socialShare("Copy")} className={styles.copylink}>
                  <span className={styles.copyicon}></span>{" "}
                  <span className="txt">{isCopied ? "Copied" : "Copy Link"}</span>
                </button>
                <button disabled={!referralLink} onClick={() => socialShare("Whatsapp")} className={styles.wa}>
                  <span className={styles.waicon}></span>Whatsapp
                </button>
                <button disabled={!referralLink} onClick={() => socialShare("LinkedIn")} className={styles.linkedin}>
                  <span className={styles.linkedInIcon}></span> Linked In
                </button>
                <button disabled={!referralLink} onClick={() => socialShare("Twitter")} className={styles.twt}>
                  <span className={styles.twtIcon}></span> Twitter
                </button>
                <button disabled={!referralLink} onClick={() => socialShare("share")} className={styles.share}>
                  <span className={styles.shareicon}></span>Share
                </button>
              </div>
            </div>
          </section>
          <section className={styles.tnc_section}>
            <p className={styles.terms_use}>Terms of Use</p>
            <ul>
              <li>
                Offer can be redeemed only via <u>www.economictimes.com</u> website (Not redeemable on Apps)
              </li>
              <li>Only paid members can refer their friends &amp; colleagues.</li>
              <li>Referrer’s membership plan should be active and not expired or in grace period.</li>
              <li>A referrer can refer to maximum of 5 contacts</li>
              <li>Maximum cashback that a referrer can get is ₹2500</li>
              <li>
                Referee needs to purchase ETPrime membership for 1 Year &amp; above in order to claim the discount.
              </li>
              <li>
                Referees will be able to claim the discount on purchase of ET Prime membership only once (new user
                only).
              </li>
              <li>
                Referee needs to be a new user and should not have any previous history of ETPrime purchase with the
                same email or mobile number.
              </li>
              <li>Referral benefit would not be combined with any other offers / discounts.</li>
              <li>
                Referrer will receive the Amazon Voucher within 7 days, upon successful purchase of ET Prime membership
                by the referee.
              </li>
              <li>
                In case of a dispute, TIL reserves the right to a final decision on the interpretation of these
                T&amp;Cs.
              </li>
            </ul>
          </section>

          {!isEligible?.loading && !isEligible.flag && <ErrorDialog onSignin={loginMapping} />}
        </div>
      </div>
      <LoginWidget />
    </React.Fragment>
  );
};
export default Referrals;
