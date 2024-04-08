import styles from "./styles.module.scss";

export function StockSRNoDataFoundCard() {
  return (
    <>
      <div className={styles.noDatafoundCat}>
        <div className={styles.nodataImage}></div>
        <div className={styles.nodataText}>
          Sorry! No Stocks Found matching the current criteria. Try again with different filters.
        </div>
      </div>
    </>
  );
}
