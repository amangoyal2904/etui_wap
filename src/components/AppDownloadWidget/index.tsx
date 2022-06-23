import React, { FC, useEffect, useState } from "react";
import { getMobileOS } from "utils";
import { appLinks } from "utils/common";
import styles from "./styles.module.scss";

interface WidgetData {
  tpName: string;
}
const handleRedirect = (tpName) => {
  let CTA_url = "";
  const os = getMobileOS();
  if (os === "Android") {
    CTA_url = appLinks["android"] + "&utm_source=pwa_widget_" + tpName + "&utm_campaign=pwa_widget_" + tpName;
  } else if (os === "iOS") {
    CTA_url = appLinks["ios"];
  } else {
    CTA_url = appLinks["generic"] + "&utm_source=pwa_widget_" + tpName + "&utm_campaign=pwa_widget_" + tpName;
  }
  window.location.href = CTA_url;
};
const AppDownloadWidget: FC<WidgetData> = ({ tpName }) => {
  return (
    <>
      <div
        onClick={() => {
          handleRedirect(tpName);
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
          <img
            className={styles.banner}
            src="https://img.etimg.com/photo/msid-83719345.cms"
            alt="app download banner"
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
};
export default AppDownloadWidget;
