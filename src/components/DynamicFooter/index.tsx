import styles from "./styles.module.scss";
import { FC, useState } from "react";
import GreyDivider from "components/GreyDivider";
import { ET_WAP_URL } from "../../utils/common";
import { useSelector } from "react-redux";
import Link from "next/link";
declare global {
  interface Window {
    __isBrowser__: boolean;
    gdprCheck: () => boolean;
    objAuth: {
      planPage: string;
    };
  }
}
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    displaytype?: string;
  }
}

const DynamicFooter: FC = () => {
  const hide_footer = false;
  const _html = [];
  const paymentButtonListener = () => {
    const paymentUrl = "";
    window.location.href = paymentUrl;
  };
  const showPersonalizedlink = () => {
    if (typeof window !== "undefined" && window.__isBrowser__ && !window.gdprCheck()) {
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
    /*const subscriptionurl =
      (typeof window != "undefined" &&
        window.objAuth &&
        window.objAuth.planPage) ||
      "https://prime.economictimes.indiatimes.com/?utm_source=PWA&amp;utm_medium=footer&amp;utm_campaign=ETPrimedistribution";*/
    return (
      <div className={styles.downloadSection} key="downloadSec">
        <div className={styles.row} displaytype="GDPR">
          <h3>download et app</h3>
          <a
            className={styles.appstore_parent}
            href="http://itunes.apple.com/us/app/the-economic-times/id474766725?ls=1&amp;t=8apple.com/us"
            target="_blank"
            rel="noopener nofollow noreferrer"
          >
            <span className={styles.appstoredownload} />
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.et.reader.activities"
            target="_blank"
            rel="noopener nofollow noreferrer"
          >
            <span className={styles.gpdownload} />
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
              className={styles.fbShare}
            ></a>

            <a
              href="https://www.linkedin.com/company/economictimes"
              target="_blank"
              title="Twitter"
              data-ga-onclick="PWA Footer Follow us icon Click#Twitter - Click#Twitter-href"
              rel="noopener nofollow noreferrer"
              className={styles.twShare}
            ></a>

            <a
              href="https://twitter.com/economictimes"
              target="_blank"
              title="LinkedIn"
              data-ga-onclick="PWA Footer Follow us icon Click#LinkedIn - Click#LinkedIn-href"
              rel="noopener nofollow noreferrer"
              className={styles.inShare}
            ></a>
          </div>
        </div>
        {!isSubscribed && (
          <div className={styles.row}>
            <a
              onClick={(e) => paymentButtonListener()}
              data-ga-onclick="Prime Distribution - PWA#Footer#PWA Footer Prime Click"
              rel="noopener"
            >
              <span className={styles.primeLogo} />
              <h4>become a member</h4>
            </a>
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
                  href="https://m.economictimes.com/feedback.cms"
                  displaytype="GDPR"
                  className={`${styles.policyTerm} ${styles.withPadding}`}
                >
                  Feedback
                </a>
              </>
            }
            {showPersonalizedlink()}
          </div>
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
    const store = useSelector((state: any) => {
      return state.footer;
    });

    const interLinkingData = store.data?.widgets;
    const interLinkingList = interLinkingData?.map((i, index) => (
      <div data-attr="interlinking" className={styles.category} key={`${index}_inkl`}>
        {interLinkingData[index]["data"] && <h2>{interLinkingData[index].title}</h2>}

        <ul className={styles.content}>
          {interLinkingData[index]["data"]?.map((item, key) => {
            return (
              <li
                data-ga-onclick={`PWA Footer Link Click#${item.title}#${interLinkingData[index].title}-${item.url}`}
                key={`${key}_inkd`}
              >
                <Link href={item.url}>{item.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    ));
    return (
      <>
        <div className={styles.dynamicCategories}>{interLinkingList}</div>
      </>
    );
  };
  return (
    <div id="footer" className={hide_footer ? styles.hide_footer : ""}>
      {/* {breadCrumbHeading && <h1 className={styles.breadCrumbHeading}>{ breadCrumbHeading }</h1>}
      {breadCrumb} */}
      <div className={styles.dynamicContainer}>
        <GreyDivider />
        {Interlinking()}
        {downloadSection()}
        {_html}
      </div>
    </div>
  );
};

export default DynamicFooter;
