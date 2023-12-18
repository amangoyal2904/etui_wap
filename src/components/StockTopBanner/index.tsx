import styles from "./styles.module.scss";

const StockTopBanner = () => {
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
        </div>
      </div>
    </>
  );
};

export default StockTopBanner;
