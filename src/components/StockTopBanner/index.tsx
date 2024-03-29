import styles from "./styles.module.scss";
import { goToPlanPage } from "../../utils/common";
import { grxEvent } from "utils/ga";

interface StockTopBannerProps {
  data: {
    head: any;
    ctaTxt: string;
    listItem: any;
  };
  srTabActivemenu?: string;
}

const StockTopBanner = ({ data, srTabActivemenu }: StockTopBannerProps) => {
  const subscrineUserCta = (cta: string) => {
    const params = {
      cta,
      item_name: `stock_report_plus_${srTabActivemenu.replace("stock", "stock_")}`,
      item_category2: `stock_report_plus_${srTabActivemenu.replace("stock", "stock_")}`,
      item_id: `stock_report_plus_${srTabActivemenu.replace("stock", "stock_")}_screener`,
      widget: "stock_top_banner",
      item_category3: "paywall_blocker_other_cta"
    };
    grxEvent(
      "event",
      {
        event_category: `Subscription Flow ET`,
        event_action: `Flow Started`,
        event_label: `StockReports ${srTabActivemenu} - Top banner`
      },
      1
    );
    goToPlanPage(params);
  };

  return (
    <>
      <div className={styles.bannerWraper}>
        <div className={styles.leftSec}></div>
        <div className={styles.rightSec}>
          <div className={styles.topTxt}>{data.head}</div>
          <ul className={styles.txtList}>
            {data &&
              data.listItem &&
              data.listItem.length &&
              data.listItem.map((item: any) => {
                return <li key={item}>{item}</li>;
              })}
          </ul>
          <span onClick={() => subscrineUserCta(data.ctaTxt)} className={styles.bannerCta}>
            {data.ctaTxt}
          </span>
        </div>
      </div>
    </>
  );
};

export default StockTopBanner;
