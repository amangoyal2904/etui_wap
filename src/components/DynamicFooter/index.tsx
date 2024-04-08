import { FC } from "react";
import GreyDivider from "components/GreyDivider";
import { isBrowser, isNoFollow } from "utils";
import { grxEvent } from "utils/ga";
declare global {
  interface Window {
    objAuth: {
      planPage: string;
    };
  }
}
declare let gdprCheck: () => boolean;
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    displaytype?: string;
  }
}

const DynamicFooter: FC<{ dynamicFooterData: any }> = ({ dynamicFooterData }) => {
  const hide_footer = false;
  const paymentButtonListener = () => {
    const paymentUrl = "";
    const uniqueID = Date.now() + "_" + window.objInts.readCookie("_grx");
    const eventData = {
      cta_text: `bottom_button_become_a_member`,
      unique_subscription_id: uniqueID,
      feature_name: ""
    };
    const userInfo = typeof window.objUser !== "undefined" && window.objUser.info && window.objUser.info;
    if (typeof window.grxDimension_cdp != "undefined") {
      window.grxDimension_cdp["loggedin"] = userInfo && userInfo.isLogged ? "y" : "n";
      window.grxDimension_cdp["email"] = (userInfo && userInfo.primaryEmail) || "";
      window.grxDimension_cdp["phone"] =
        userInfo && userInfo.mobileData && userInfo.mobileData.Verified && userInfo.mobileData.Verified.mobile
          ? userInfo.mobileData.Verified.mobile
          : "";
      "event_name" in window.grxDimension_cdp && delete window.grxDimension_cdp["event_name"];
    }
    window.grxDimensionCdp = { ...window.grxDimension_cdp, ...eventData, discount: "" };
    grxEvent("cdp_event", { event_category: "subscription", event_name: "paywall", event_nature: "click" });
    window.location.href = paymentUrl;
  };
  const showPersonalizedlink = () => {
    if (isBrowser() && typeof gdprCheck !== "undefined" && !gdprCheck()) {
      return (
        <div id="personalized">
          |
          <a
            href="https://www.colombiaonline.com/site_policy.html"
            target="_blank"
            rel="nofollow noreferrer"
            className="policyTerm withPadding"
          >
            Opt- out of personalized ads
          </a>
          |
          <a href="https://economictimes.indiatimes.com/feeds/gdprform.cms" className="policyTerm withPadding">
            Delete data
          </a>
        </div>
      );
    } else {
      return "";
    }
  };
  const downloadSection = (isSubscribed = false) => {
    return (
      <div className="downloadSection" key="downloadSec">
        <div className="row" displaytype="GDPR">
          <h3>download et app</h3>
          <a
            className="appstore_parent"
            href="http://itunes.apple.com/us/app/the-economic-times/id474766725?ls=1&amp;t=8apple.com/us"
            target="_blank"
            rel="noopener nofollow noreferrer"
            aria-label="Play Store"
            data-ga-onclick="Footer Element Clicks#Download ET App#href"
          >
            <span className="appstoredownload commonSprite" />
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.et.reader.activities"
            target="_blank"
            rel="noopener nofollow noreferrer"
            aria-label="App Store"
            data-ga-onclick="Footer Element Clicks#Download ET App#href"
          >
            <span className="gpdownload commonSprite" />
          </a>
        </div>
        <div className="row" displaytype="GDPR">
          <h3>follow us on</h3>
          <div className="shareIcons">
            <a
              href="https://www.facebook.com/EconomicTimes"
              title="Facebook"
              target="_blank"
              data-ga-onclick="PWA Footer Follow us icon Click#Facebook - Click#Facebook-href"
              rel="noopener nofollow noreferrer"
              aria-label="Facebook"
              className="fbShare commonSprite"
            ></a>

            <a
              href="https://www.linkedin.com/company/economictimes"
              target="_blank"
              title="Linkedin"
              data-ga-onclick="PWA Footer Follow us icon Click#Linkedin - Click#Linkedin-href"
              rel="noopener nofollow noreferrer"
              aria-label="Linkedin"
              className="twShare commonSprite"
            ></a>

            <a
              href="https://twitter.com/economictimes"
              target="_blank"
              title="Twitter"
              data-ga-onclick="PWA Footer Follow us icon Click#Twitter - Click#Twitter-href"
              rel="noopener nofollow noreferrer"
              aria-label="Twitter"
              className="inShare commonSprite"
            ></a>
          </div>
        </div>
        {!isSubscribed && (
          <div className="row">
            <div
              onClick={() => paymentButtonListener()}
              data-ga-onclick="Prime Distribution - PWA#Footer#PWA Footer Prime Click"
            >
              <span className="primeLogo commonSprite" />
              <h4>become a member</h4>
            </div>
          </div>
        )}
        <div className="row">
          <a href="https://m.economictimes.com/termsofuse.cms" className="policyTerm withPadding">
            Terms of Use &amp; Grievance Redressal Policy
          </a>
          |
          <a href="https://m.economictimes.com/codeofconduct.cms" className="policyTerm withPadding">
            DNPA Code of Ethics
          </a>
          |
          <div className="mT15">
            <a href="https://m.economictimes.com/privacypolicy.cms" className="policyTerm withPadding">
              Privacy Policy
            </a>
            {
              <>
                |
                <a
                  href="https://m.economictimes.com/contactus.cms"
                  displaytype="GDPR"
                  className="policyTerm withPadding"
                >
                  Feedback
                </a>
              </>
            }
            {showPersonalizedlink()}
          </div>
          |
          <button className={`ot-sdk-show-settings ot_sdk_btn`} id="ot-sdk-btn">
            Cookies Settings
          </button>
        </div>
        <div className="row">
          <div className="copyright">
            Copyright © {new Date().getFullYear()} Bennett Coleman & Co. All rights reserved. Powered by Indiatimes.
          </div>
        </div>
        <style jsx>
          {`
            .downloadSection {
              background-color: #1a1a1a;
              color: #ffffff;
              padding: 0 15px;
              //margin-bottom: 80px;
              padding-bottom: 80px;
            }
            .downloadSection .row {
              padding: 20px 0;
              text-align: center;
              font-family: "Montserrat", "Verdana";
            }
            .downloadSection .row::not(:last-child) {
              border-bottom: 1px solid #343434;
            }

            .downloadSection .row h3 {
              text-transform: uppercase;
              font-size: 19px;
              font-weight: 600;
              padding-bottom: 10px;
            }

            .downloadSection .row .appstore_parent {
              display: inline-block;
            }

            .downloadSection .row .appstoredownload {
              background-position: -172px -0px;
              width: 161px;
              height: 40px;
              transform: scale(0.9);
            }

            .downloadSection .row .gpdownload {
              background-position: -6px -6px;
              width: 151px;
              height: 42px;
              margin-left: 10px;
              transform: scale(0.9);
            }

            .downloadSection .row .shareIcons {
              padding: 0 20px;
            }

            .downloadSection .row .shareIcons a {
              margin: 10px 7px 0 7px;
              display: inline-block;
              width: 45px;
              height: 45px;
            }

            .downloadSection .row .shareIcons .fbShare {
              background-size: 393px 238px;
              background-position: 0px -47px;
            }

            .downloadSection .row .shareIcons .twShare {
              background-size: 393px 238px;
              background-position: -95px -47px;
            }

            .downloadSection .row .shareIcons .inShare {
              background-size: 393px 238px;
              background-position: -45px -47px;
            }

            .downloadSection .row .primeLogo {
              background-position: 0px -93px;
              display: inline-block;
              width: 130px;
              height: 24px;
            }

            .downloadSection .row h4 {
              color: #ffffff;
              border-radius: 5px;
              padding: 10px 10px;
              text-transform: uppercase;
              background-color: #ed1a3b;
              margin: 10px auto 0;
              width: 190px;
              box-sizing: border-box;
              font-size: 0.9em;
              font-weight: 500;
            }

            .downloadSection .row .policyTerm {
              font-size: 0.875em;
              color: #cccccc;
            }

            .downloadSection .row .ot_sdk_btn {
              font-size: 0.875em;
              color: #cccccc;
              border: none;
              background: none;
              padding: 10px 10px 0;
            }
            .downloadSection .row .ot_sdk_btn::hover {
              background: none;
            }

            .downloadSection .row .withPadding {
              padding: 10px 10px 0;
            }

            .downloadSection .row .copyright {
              font-size: 0.875em;
              color: #cccccc;
            }
          `}
        </style>
      </div>
    );
  };

  const Interlinking = () => {
    const interLinkingData = dynamicFooterData?.widgets || [];
    const interLinkingList = interLinkingData?.map((i, index) => (
      <div data-attr="interlinking" className="category" key={`inkl_${index}`}>
        {interLinkingData[index]["data"] && Array.isArray(interLinkingData[index]["data"]) && (
          <>
            <h2>{interLinkingData[index].title}</h2>
            <ul className="content">
              {interLinkingData[index]["data"]?.map((item, key) => {
                const noFollow = isNoFollow(item.url) && item.noFollow != "false" ? { rel: "nofollow" } : {};
                return (
                  <li
                    data-ga-onclick={`PWA Footer Link Click#${item.title}#${interLinkingData[index].title}-${item.url}`}
                    key={`${key}_inkd`}
                  >
                    <a href={item.url} {...noFollow}>
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        <style jsx>{`
          .category {
            margin-top: 15px;
          }
          .category:first-child {
            margin-top: 0px;
          }
          .category h2 {
            font-size: 1.5em;
            font-family: "Montserrat", "Verdana";
          }

          .category ul.content {
            list-style-type: none;
            margin-top: 5px;
            font-family: "Montserrat", "Verdana";
          }
          ul.content li {
            display: inline-block;
            line-height: 1em;
            margin-bottom: 0.3em;
            font-weight: normal;
            position: relative;
            margin-right: 20px;
          }
          ul.content li::after {
            border-left: 1px solid;
            margin: 0 0.5em;
            content: "";
            position: absolute;
            top: 7px;
            bottom: 5px;
          }
          ul.content li:first-child {
            padding-left: 0;
          }

          ul.content li::last-child::after {
            border-left: none;
          }

          ul.content li a {
            font-size: 0.875em;
            color: white;
            display: inline-block;
            padding: 5px 6px 5px 0;
          }
        `}</style>
      </div>
    ));

    return (
      <>
        <div className="dynamicCategories">{interLinkingList}</div>
        <style jsx>{`
          .dynamicCategories {
            padding: 15px;
          }
          .category {
            margin-top: 15px;
          }
          .category:first-child {
            margin-top: 0px;
          }
          .category h2 {
            font-size: 1.5em;
            font-family: "Montserrat", "Verdana";
          }

          .category ul.content {
            list-style-type: none;
            margin-top: 5px;
            font-family: "Montserrat", "Verdana";
          }
          ul.content li {
            display: inline-block;
            line-height: 1em;
            margin-bottom: 0.3em;
            font-weight: normal;
            position: relative;
            margin-right: 20px;
          }
          ul.content li::after {
            border-left: 1px solid;
            margin: 0 0.5em;
            content: "";
            position: absolute;
            top: 7px;
            bottom: 5px;
          }
          ul.content li:first-child {
            padding-left: 0;
          }

          ul.content li::last-child::after {
            border-left: none;
          }

          ul.content li a {
            font-size: 0.875em;
            color: white;
            display: inline-block;
            padding: 5px 6px 5px 0;
          }
        `}</style>
      </>
    );
  };

  return (
    <div id="footer" className={hide_footer ? "hide_footer" : ""}>
      <div className="dynamicContainer">
        <GreyDivider />
        {Interlinking()}
        {downloadSection()}
      </div>
      <style jsx>
        {`
          .dynamicContainer {
            box-sizing: border-box;
            border-top: 1px solid #e6e6e6;
            background-color: #000;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default DynamicFooter;
