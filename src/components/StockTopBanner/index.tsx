import styles from "./styles.module.scss";
import { goToPlanPage } from "../../utils/common";

interface StockTopBannerProps {
  data: {
    head: any;
    ctaTxt: string;
    listItem: any;
  };
}

const StockTopBanner = ({ data }: StockTopBannerProps) => {
  const subscrineUserCta = () => {
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
