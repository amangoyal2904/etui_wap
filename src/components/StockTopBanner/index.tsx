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
          <div className={styles.topTxt}>Stock Analysis Now Get Simplified</div>
          <ul className={styles.txtList}>
            <li>View Stock Ratings</li>
            <li>Get Analyst Recommendations</li>
            <li>Generate Investment Ideas</li>
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
