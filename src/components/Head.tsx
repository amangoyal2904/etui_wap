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
      </Head>
    </>
  );
};

export default Headers;
