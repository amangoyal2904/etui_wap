import { useRouter } from "next/router";
import Script from "next/script";
import { FC } from "react";
import { APP_ENV } from "../utils";
import * as Config from "../utils/common";

interface Props {
  isprimeuser?: number;
  objVc?: object;
}
const Scripts: FC<Props> = ({ isprimeuser, objVc }) => {
  const router = useRouter();
  const reqData = router.query;
  const isReady = router.isReady;

  const minifyJS = APP_ENV === "development" ? 0 : 1;
  const jsDomain = APP_ENV === "development" ? "https://etdev8243.indiatimes.com" : "https://js.etimg.com";
  const jsIntsURL = `${jsDomain}/js_ints.cms?v=${objVc["js_interstitial"]}&minify=${minifyJS}`;
  return (
    <>
      <Script id="main-script">
        {`
            window.__APP = {
                env: "${APP_ENV}"
            }
            window.customDimension = window.customDimension || {};
            window.adDivIds = [];
            window._log = function(){
                let currDate = new Date().toString().split(" GMT")[0];
                let args = Array.prototype.slice.call(arguments);
                console.log(currDate + ' >', args.toString());
            }
        `}
      </Script>
      <Script
        src="https://m.economictimes.com/geoapiet/?cb=et"
        onLoad={() => {
          const geoLoaded = new Event("geoLoaded");
          document.dispatchEvent(geoLoaded);
        }}
      />
      <Script
        src={jsIntsURL}
        strategy="afterInteractive"
        onLoad={() => {
          const objIntsLoaded = new Event("objIntsLoaded");
          document.dispatchEvent(objIntsLoaded);
        }}
      />

      {!reqData.opt && !isprimeuser && isReady && (
        <>
          <Script
            src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
            strategy="lazyOnload"
            onLoad={() => {
              const gptLoaded = new Event("gptLoaded");
              document.dispatchEvent(gptLoaded);
            }}
          />
          {router.asPath.indexOf("skip_ctn=1") == -1 && (
            <Script src="https://static.clmbtech.com/ad/commons/js/2501/colombia_v2.js" strategy="lazyOnload" />
          )}
          <Script
            id="google-analytics"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', '${Config.GA.GA_ID}', 'auto');
              window.customDimension = { ...window["customDimension"], page: window.location.href };
              ga('send', 'pageview', window.customDimension);
              const gaLoaded = new Event('gaLoaded');
              document.dispatchEvent(gaLoaded);
              `
            }}
          />
          <Script
            src="https://static.growthrx.in/js/v2/web-sdk.js"
            strategy="lazyOnload"
            onLoad={() => {
              window.grx("init", window.objVc.growthRxId || "gc2744074");
              window.customDimension = { ...window["customDimension"], url: window.location.href };
              window.grx("track", "page_view", window.customDimension);
            }}
          />
          <Script
            id="tag-manager"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${Config.GA.GTM_KEY}`}
          />
          <Script
            id="tag-manager-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${Config.GA.GTM_ID}', { page_path: window.location.pathname });
              `
            }}
          />
        </>
      )}
    </>
  );
};

export default Scripts;
