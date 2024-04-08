import React, { FC, useEffect, useState } from "react";
import { appLinks } from "utils/common";

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
        className="topWrap"
      >
        <div className="wrap">
          <div className="innerWrap">
            <p className="innerHead">
              <b>
                Our app has got more <br />
                for you!
              </b>
            </p>
            <p className="innerText">
              <span className="leftTick"></span>Browse Quick Reads
            </p>
            <p className="innerText">
              <span className="leftTick"></span>Access ET Print Edition
            </p>
            <p className="innerText">
              <span className="leftTick"></span>Use Night Mode
            </p>
            <p className="installBtn">INSTALL ET APP</p>
          </div>
          <img
            className="banner"
            src="https://img.etimg.com/photo/msid-92587267.cms"
            alt="app download banner"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <style jsx>
        {`
          .topWrap {
            padding: 10px 15px;
          }
          .wrap {
            border: 3px solid #ffe9e2;
            position: relative;
            overflow: hidden;
          }
          .wrap .innerWrap {
            margin-left: 14px;
            position: relative;
            z-index: 1;
          }
          .wrap .banner {
            position: absolute;
            right: 5%;
            bottom: 0;
            z-index: 0;
            width: 100px;
          }
          .wrap .innerHead {
            font-size: 15px;
            letter-spacing: 0.5px;
          }
          .wrap .innerText {
            font-size: 12px;
            padding-bottom: 4px;
            display: flex;
            margin: 3px 0;
            align-items: center;
          }
          .wrap .leftTick {
            width: 13px;
            color: #fff;
            display: inline-block;
            height: 13px;
            background-color: #ed193b;
            border-radius: 100%;
            text-align: center;
            margin-right: 5px;
          }
          .wrap .leftTick::after {
            content: "";
            display: block;
            position: relative;
            border-top: 0;
            border-left: 0;
            transform: rotate(45deg);
            height: 5px;
            width: 3px;
            left: 5px;
            top: 3px;
            border: 1px solid #fff;
            border-top: 0;
            border-left: 0;
          }
          .wrap .installBtn {
            padding: 0 8px;
            border-radius: 2px;
            background-color: #ed193b;
            font-size: 11px;
            font-weight: 800;
            color: #fff;
            margin-top: 4px;
            display: inline-block;
            line-height: 24px;
          }
        `}
      </style>
    </>
  );
};
export default AppDownloadWidget;
