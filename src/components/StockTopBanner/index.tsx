import styles from "./styles.module.scss";
import { goToPlanPage } from "../../utils/common";

const StockTopBanner = () => {
  const subscrineUserCta = () => {
    goToPlanPage();
  };
  return (
    <>
      <div className={styles.bannerWraper}>
        <div className={styles.leftSec}></div>
        <div className={styles.rightSec}>
          <div className={styles.topTxt}>Stock Analysis Now Gets Simplified</div>
          <ul className={styles.txtList}>
            <li>Track weekly stock scores, ratings & forecast</li>
            <li>Comprehensive peer level analysis</li>
            <li>Get analyst recommendations. </li>
          </ul>
          <span onClick={subscrineUserCta} className={styles.bannerCta}>
            Subscribe to ET Prime
          </span>
        </div>
      </div>
    </>
  );
};

export default StockTopBanner;
