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
  const subscrineUserCta = () => {
    grxEvent(
      "event",
      {
        event_category: `Subscription Flow ET`,
        event_action: `Flow Started`,
        event_label: `SR+ ${srTabActivemenu} Subscribe to ETPrime`
      },
      1
    );
    goToPlanPage();
  };

  //console.log("data", data);
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
          <span onClick={subscrineUserCta} className={styles.bannerCta}>
            {data.ctaTxt}
          </span>
        </div>
      </div>
    </>
  );
};

export default StockTopBanner;
