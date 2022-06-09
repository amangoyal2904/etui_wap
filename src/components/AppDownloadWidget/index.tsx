import React from "react";
import { getMobileOS } from "utils";
import { appLinks } from "utils/common";
import styles from "./styles.module.scss";

interface WidgetData {
  tpName: string;
}
const AppDownloadWidget = (props: WidgetData) => {
  const handleRedirect = () => {
    let CTA_url = "";
    const os = getMobileOS();
    if (os === "Android") {
      CTA_url = appLinks["android"] + "&utm_source=pwa_widget_homepage&utm_campaign=pwa_widget_homepage";
    } else if (os === "iOS") {
      CTA_url = appLinks["ios"];
    } else {
      CTA_url = appLinks["generic"] + "?utm_source=pwa_widget_homepage&utm_medium=pwa_widget_homepage";
    }
    window.location.href = CTA_url;
  };

  const { tpName } = props;
  return (
    <>
      <div
        onClick={() => {
          handleRedirect();
        }}
        className={styles.topWrap}
      >
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
              <span className={styles.leftTick}></span>Better viewing experience
            </p>
            <p className={styles.installBtn}>INSTALL ET APP</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default AppDownloadWidget;
