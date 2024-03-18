import styles from "./styles.module.scss";
import { goToPlanPage } from "../../utils/common";
import { grxEvent } from "utils/ga";

export default function StockSRBTMBannerCard({ data }) {
  const planPageHandler = (cta) => {
    const params = {
      cta,
      widget: "stock_report_plus",
      item_category3: "paywall_blocker_other_cta"
    };

    grxEvent(
      "event",
      {
        event_category: "Flow Started",
        event_action: `Subscription Flow ET`,
        event_label: `SR+ Bottom Layer Subscription`
      },
      1
    );
    goToPlanPage(params);
  };
  return (
    <>
      <div className={styles.srbtnBannerWraper}>
        <div className={styles.btnSection}>
          <div className={styles.textBtm}>{data.text}</div>
          <div className={styles.primeWrap}>
            <span className={styles.primeCta} onClick={() => planPageHandler(data.ctaText)}>
              {data.ctaText}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
