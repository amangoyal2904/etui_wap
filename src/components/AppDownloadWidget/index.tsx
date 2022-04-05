import React from "react";
import styles from "./styles.module.scss";
import Link from "next/link";

interface WidgetData {
  tpName: string;
}
const AppDownloadWidget = (props: WidgetData) => {
  const { tpName } = props;
  return (
    <>
      <div className={styles.topWrap}>
        <Link href={"/" + tpName} passHref>
          <div className={styles.wrap}>
            <div className={styles.innerWrap}>
              <p className={styles.innerHead}>
                Enjoy <b>seamless experience</b>
                <br />
                on our App!
              </p>
              <p className={styles.innerText}>
                <span className={styles.leftTick}></span>We’re 10X faster on app
              </p>
              <p className={styles.innerText}>
                <span className={styles.leftTick}></span>Better viewing
                experience
              </p>
              <p className={styles.installBtn}>INSTALL ET APP</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};
export default AppDownloadWidget;
