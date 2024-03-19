import React, { FC, useEffect, useState } from "react";
import { getMobileOS } from "utils";
import { appLinks } from "utils/common";
import styles from "./styles.module.scss";

interface WidgetData {
  tpName: string;
}
const handleRedirect = (tpName) => {
  const CTA_url = appLinks["generic"] + "&utm_source=pwa_widget_" + tpName + "&utm_campaign=pwa_widget_" + tpName;
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
              <b>
                Our app has got more <br />
                for you!
              </b>
            </p>
            <p className={styles.innerText}>
              <span className={styles.leftTick}></span>Browse Quick Reads
            </p>
            <p className={styles.innerText}>
              <span className={styles.leftTick}></span>Access ET Print Edition
            </p>
            <p className={styles.innerText}>
              <span className={styles.leftTick}></span>Use Night Mode
            </p>
            <p className={styles.installBtn}>INSTALL ET APP</p>
          </div>
          <img
            className={styles.banner}
            src="https://img.etimg.com/photo/msid-92587267.cms"
            alt="app download banner"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </>
  );
};
export default AppDownloadWidget;
