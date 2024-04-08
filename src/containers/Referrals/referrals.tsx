import React, { useEffect, useState, FC } from "react";

import { fetchAllMetaInfo, isLiveApp } from "utils/articleUtility";
import { PageProps } from "types/stockreportscategory";
import APIS_CONFIG from "../../network/config.json";
import LoginWidget from "components/LoginSdk";
import { getCookie, APP_ENV } from "utils";
import ErrorDialog from "./ErrorDialog";
import { grxEvent } from "utils/ga";
import SEO from "components/SEO";

import styles from "./referrals.module.scss";
import { loginInitiatedGA4 } from "utils/common";

const Referrals: FC<PageProps> = (props) => {
  const [referralLink, setReferralLink] = useState("");
  const [isEligible, setIsElegible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [metaInfo, setMetaInfo] = useState<any>({});

  const { seo = {}, version_control } = props;
  const seoData = { ...seo, ...version_control?.seo };

  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      window.objInts.afterPermissionCall(getUserInfo);
    } else if (typeof document !== "undefined") {
      document.addEventListener("objIntsLoaded", () => {
        window.objInts.afterPermissionCall(getUserInfo);
      });
    }
    grxEvent("event", { event_category: "Referral Page", event_action: "Page loaded", event_label: "N/A" }, 1);
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    const data = await fetchAllMetaInfo(105842328);
    setMetaInfo(data);
  };

  const getUserInfo = () => {
    if (window.objUser.info.isLogged) {
      const isSubscribed =
        typeof window.objInts != "undefined" && window.objInts.permissions.indexOf("subscribed") > -1;
      if (!isSubscribed) {
        setIsElegible(false);
      }
    } else {
      setIsElegible(false);
      loginMapping();
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
      window.navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } else {
      let text: string, shareUrl: string;
      switch (flag) {
        case "Twitter":
          text = `Hello! I am an ETPrime member & I have access to exclusive updates & member-only benefits. It has made my daily investment decisions simple and better. Use my invite link to make informed decisions with in-depth insights.`;
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
            referralLink
          )}`;
          break;
        case "Whatsapp":
          text = `Hello! I am an ETPrime member & I have access to exclusive updates & member-only benefits. It has made my daily investment decisions simple and better. Use my invite link to make informed decisions with in-depth insights.`;
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
  };

  const shortLink = (longLink) => {
    const endPoint = `https://${
        isLiveApp() ? "economictimes" : "etdev8243"
      }.indiatimes.com/tinyurl_feed.cms?feedtype=etjson&url=${encodeURIComponent(longLink)}`,
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

    const endPoint = APIS_CONFIG.etReferrals[APP_ENV],
      requestOptions = {
        method: "GET",
        headers: { Authorization: getCookie("ssoid") }
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
          <div className={styles.head_sec}>
            <a className={styles.head_logo} href="/"></a>
            <span className={styles.head_seperator}></span>
            <span className={styles.head_seperator}></span>
            <a className={styles.head_primelogo} href="/"></a>
          </div>

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
                  disabled={!!referralLink || isLoading || !isEligible}
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

          {!isEligible && <ErrorDialog onSignin={loginMapping} />}
        </div>
      </div>
      <LoginWidget />
    </React.Fragment>
  );
};
export default Referrals;
