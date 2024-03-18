import styles from "./styles.module.scss";
import { FC } from "react";
import GreyDivider from "components/GreyDivider";
import { useSelector } from "react-redux";
import { AppState } from "app/store";
import { isBrowser, isNoFollow } from "utils";
import { grxEvent } from "utils/ga";
import { goToPlanPage } from "utils/common";
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
    const params = {
      cta: "become a member",
      widget: "footer"
    };
    const items = {
      item_name: window.customDimension["dimension25"] || "",
      item_id: "btf",
      item_brand: "product_interventions",
      item_category: "btf",
      item_category2: window.customDimension["dimension26"] || "",
      item_category3: "btf_cta",
      item_category4: "become a member",
      location_id: "footer"
    };
    grxEvent(
      "event",
      {
        event_category: "Prime Distribution - PWA",
        event_action: `Footer`,
        event_label: "PWA Footer Prime Click"
      },
      1
    );
    goToPlanPage(params, items);
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
            className={`${styles.policyTerm} ${styles.withPadding}`}
          >
            Opt- out of personalized ads
          </a>
          |
          <a
            href="https://economictimes.indiatimes.com/feeds/gdprform.cms"
            className={`${styles.policyTerm} ${styles.withPadding}`}
          >
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
      <div className={styles.downloadSection} key="downloadSec">
        <div className={styles.row} displaytype="GDPR">
          <h3>download et app</h3>
          <a
            className={styles.appstore_parent}
            href="http://itunes.apple.com/us/app/the-economic-times/id474766725?ls=1&amp;t=8apple.com/us"
            target="_blank"
            rel="noopener nofollow noreferrer"
            aria-label="Play Store"
            data-ga-onclick="Footer Element Clicks#Download ET App#href"
          >
            <span className={`${styles.appstoredownload} ${styles.commonSprite}`} />
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.et.reader.activities"
            target="_blank"
            rel="noopener nofollow noreferrer"
            aria-label="App Store"
            data-ga-onclick="Footer Element Clicks#Download ET App#href"
          >
            <span className={`${styles.gpdownload} ${styles.commonSprite}`} />
          </a>
        </div>
        <div className={styles.row} displaytype="GDPR">
          <h3>follow us on</h3>
          <div className={styles.shareIcons}>
            <a
              href="https://www.facebook.com/EconomicTimes"
              title="Facebook"
              target="_blank"
              data-ga-onclick="PWA Footer Follow us icon Click#Facebook - Click#Facebook-href"
              rel="noopener nofollow noreferrer"
              aria-label="Facebook"
              className={`${styles.fbShare} ${styles.commonSprite}`}
            ></a>

            <a
              href="https://www.linkedin.com/company/economictimes"
              target="_blank"
              title="Linkedin"
              data-ga-onclick="PWA Footer Follow us icon Click#Linkedin - Click#Linkedin-href"
              rel="noopener nofollow noreferrer"
              aria-label="Linkedin"
              className={`${styles.twShare} ${styles.commonSprite}`}
            ></a>

            <a
              href="https://twitter.com/economictimes"
              target="_blank"
              title="Twitter"
              data-ga-onclick="PWA Footer Follow us icon Click#Twitter - Click#Twitter-href"
              rel="noopener nofollow noreferrer"
              aria-label="Twitter"
              className={`${styles.inShare} ${styles.commonSprite}`}
            ></a>
          </div>
        </div>
        {!isSubscribed && (
          <div className={styles.row}>
            <div
              onClick={() => paymentButtonListener()}
              data-ga-onclick="Prime Distribution - PWA#Footer#PWA Footer Prime Click"
            >
              <span className={`${styles.primeLogo} ${styles.commonSprite}`} />
              <h4>become a member</h4>
            </div>
          </div>
        )}
        <div className={styles.row}>
          <a href="https://m.economictimes.com/termsofuse.cms" className={`${styles.policyTerm} ${styles.withPadding}`}>
            Terms of Use &amp; Grievance Redressal Policy
          </a>
          |
          <a
            href="https://m.economictimes.com/codeofconduct.cms"
            className={`${styles.policyTerm} ${styles.withPadding}`}
          >
            DNPA Code of Ethics
          </a>
          |
          <div className={styles.mT15}>
            <a
              href="https://m.economictimes.com/privacypolicy.cms"
              className={`${styles.policyTerm} ${styles.withPadding}`}
            >
              Privacy Policy
            </a>
            {
              <>
                |
                <a
                  href="https://m.economictimes.com/contactus.cms"
                  displaytype="GDPR"
                  className={`${styles.policyTerm} ${styles.withPadding}`}
                >
                  Feedback
                </a>
              </>
            }
            {showPersonalizedlink()}
          </div>
          |
          <button className={`ot-sdk-show-settings ${styles.ot_sdk_btn}`} id="ot-sdk-btn">
            Cookies Settings
          </button>
        </div>
        <div className={styles.row}>
          <div className={styles.copyright}>
            Copyright © {new Date().getFullYear()} Bennett Coleman & Co. All rights reserved. Powered by Indiatimes.
          </div>
        </div>
      </div>
    );
  };

  const Interlinking = () => {
    const interLinkingData = dynamicFooterData?.widgets || [];
    const interLinkingList = interLinkingData?.map((i, index) => (
      <div data-attr="interlinking" className={styles.category} key={`inkl_${index}`}>
        {interLinkingData[index]["data"] && Array.isArray(interLinkingData[index]["data"]) && (
          <>
            <h2>{interLinkingData[index].title}</h2>
            <ul className={styles.content}>
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
      </div>
    ));

    return <div className={styles.dynamicCategories}>{interLinkingList}</div>;
  };

  return (
    <div id="footer" className={hide_footer ? styles.hide_footer : ""}>
      <div className={styles.dynamicContainer}>
        <GreyDivider />
        {Interlinking()}
        {downloadSection()}
      </div>
    </div>
  );
};

export default DynamicFooter;
