import Head from "next/head";
import { FC } from "react";

interface Props {
  isprimeuser?: number;
  reqData?: any;
}
const Headers: FC<Props> = ({ isprimeuser, reqData }) => {
  const isVideoShowNew = reqData?.all?.includes("videoshownew");

  const prefetchDomains = !isprimeuser ? (
    <>
      <link rel="dns-prefetch" href="https://securepubads.g.doubleclick.net" />
      <link rel="dns-prefetch" href="https://sb.scorecardresearch.com" />
      <link rel="dns-prefetch" href="https://static.clmbtech.com" />
      <link rel="dns-prefetch" href="https://googletagmanager.com" />
      <link rel="dns-prefetch" href="https://gstatic.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://htlb.casalemedia.com" />
      <link rel="dns-prefetch" href="https://timesinternet-d.openx.net" />
      <link rel="dns-prefetch" href="https://ib.adnxs.com" />
    </>
  ) : null;

  return (
    <>
      <Head>
        <title>Not Found</title>
        {/* <link rel="shortcut icon" href="https://m.economictimes.com/favicon.ico" type="image/x-icon" /> */}
        <meta name="generator" content="React" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height,initial-scale=1.0,user-scalable=yes,maximum-scale=5"
        />
        <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
        <meta httpEquiv="" content="IE=edge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge,chrome=1" />
        <meta content="yes" name="apple-touch-fullscreen" />
        <link rel="dns-prefetch" href="https://jssocdn.indiatimes.com/" />
        <link rel="dns-prefetch" href="https://jsso.indiatimes.com/" />
        <link rel="dns-prefetch" href="https://img.etimg.com/" />
        <link rel="dns-prefetch" href="https://js.etimg.com/" />
        <link rel="dns-prefetch" href="https://etpwaapi.economictimes.com/" />
        <link rel="dns-prefetch" href="https://static.growthrx.in/" />
        <link rel="dns-prefetch" href="https://economictimes.indiatimes.com/" />
        <link rel="dns-prefetch" href="https://google-analytics.com/" />
        <link rel="dns-prefetch" href="https://cdn.mouseflow.com" />
        <link rel="dns-prefetch" href="https://google.com" />
        <link rel="dns-prefetch" href="https://google.co.in" />
        <link rel="dns-prefetch" href="https://etprecos.economictimes.indiatimes.com" />
        <link rel="dns-prefetch" href="https://etusers1.economictimes.com" />
        <link rel="dns-prefetch" href="https://agi-static.indiatimes.com" />
        <link rel="dns-prefetch" href="https://idm.economictimes.com" />
        {isVideoShowNew && (
          <>
            <link rel="dns-prefetch" href="http://slike.indiatimes.com" />
            <link rel="dns-prefetch" href="http://tvid.in" />
          </>
        )}
        {/* {!isVideoShowNew && <link rel="preload" as="image" href="https://img.etimg.com/photo/42031747.cms" />} */}
        {prefetchDomains}
        {/* <script
          data-partytown-config
          dangerouslySetInnerHTML={{
            __html: `
              partytown = {
                lib: "/_next/static/~partytown/",
                forward: ["gtag"]           
              };
            `
          }}
        /> */}
        <link rel="preload" href="/fonts/montserrat-v14-latin-regular.woff" as="font" type="font/woff" crossOrigin="" />
        <link rel="preload" href="/fonts/montserrat-v14-latin-700.woff" as="font" type="font/woff" crossOrigin="" />
        {/* <link
          rel="preload"
          href="/fonts/faustina-v6-latin-regular.woff"
          as="font"
          type="font/woff"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/faustina-v6-latin-700.woff"
          as="font"
          type="font/woff"
          crossOrigin=""
        />         */}
        <style>
          {`

      @font-face {
        font-family: "Montserrat";
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url("/fonts/montserrat-v14-latin-regular.woff");
      }

      @font-face {
        font-family: "Montserrat";
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url("/fonts/montserrat-v14-latin-700.woff");
      }

      html,
      body {
        padding: 0;
        margin: 0;
        font-family: Montserrat, sans-serif;
      }

      ul,
      ul li {
        padding: 0px;
        margin: 0px;
        list-style-type: none;
      }

      ol li {
        padding: 0px;
        margin: 0px;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      * {
        box-sizing: border-box;
      }

      .isprimeuser .adContainer {
        display: none;
      }
      .adContainer.expando_1 {
        min-height: 250px;
      }

      #shortsVids .common .moreTextImg {
        display: none;
      }

      #shortsVids #more-text {
        background: transparent;
        right: 4rem;
        width: auto;
      }

      #shortsVids #more-text div {
        color: #fff;
      }

      #shortsVids #footer-common {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.969087) 87.8%, #000000 100%);
      }
      .reportPlustSliderWrap .slick-list .slick-slide > div:first-child {
        padding: 10px 20px;
      }

      #mh {
        text-align: center;
        margin-top: 10px;
        min-height: 50px;
      }

      .loginWidgetWrapper {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 9999999999;
        background-color: rgba(0, 0, 0, 0.8);
        overflow: auto;
      }

    .hdAdContainer {
      max-width: 100vw;
      overflow: auto;
      text-align: center;
      margin-top: 10px;
      min-height: 50px;
    }
    .footerAd {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 5;
      text-align: center;
      background-color: #fff;
      max-height: 50px;
    }

    .mrecContainer {
      text-align: center;
      margin: 20px 0;
      padding-bottom: 10px;
      background: #f7f7f7;
      min-height: 200px;
    }
    .mrecContainer::before {
        content: "ADVERTISEMENT";
        font-size: 11px;
        font-weight: 300;
        display: block;
        padding: 10px 0;
    }
    .mrecContainer .mrec {
        display: inline-block;
    }

    .adContainer {
      text-align: center;
    }

    .mainContent {
      min-height: 450px;
      max-width: 1024px;
      margin: 0 auto;
    }
    .commonSprite {
        background: url("https://img.etimg.com/photo/msid-105039132,quality-100.cms") no-repeat;
        display: inline-block;
      }
          `}
        </style>
        <script src="https://cdn.debugbear.com/6wo3vLGELIvI.js" async></script>
      </Head>
    </>
  );
};

export default Headers;
