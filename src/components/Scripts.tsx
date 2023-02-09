import { useRouter } from "next/router";
import Script from "next/script";
import { FC, useEffect } from "react";
import { APP_ENV, updateDimension } from "../utils";
import * as Config from "../utils/common";

interface Props {
  isprimeuser?: number;
  objVc?: object;
}

declare global {
  interface Window {
    optCheck: boolean;
  }
}

const Scripts: FC<Props> = ({ isprimeuser, objVc }) => {
  const router = useRouter();
  const reqData = router.query;
  const isTopicPage = router.asPath.indexOf("/topic/") !== -1;
  const isReady = router.isReady;

  const minifyJS = APP_ENV === "development" ? 0 : 1;
  const jsDomain = APP_ENV === "development" ? "https://etdev8243.indiatimes.com" : "https://js.etimg.com";
  const jsIntsURL = `${jsDomain}/js_ints.cms?v=${objVc["js_interstitial"]}&minify=${minifyJS}`;

  useEffect(() => {
    window.optCheck = router.asPath.indexOf("opt=1") != -1;
    updateDimension();
  }, []);

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
          var _comscore = _comscore || [];
          _comscore.push({ c1: "2", c2: "6036484" });
        `}
      </Script>
      <Script id="geoinfo-call">
        {`
        function getGeoInfo() {    
            var value = "", info = {};               
            var name = "geoinfo=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                value = c.substring(name.length, c.length);
              }
            }

            if(value) {
              var comps = value.split(',').map(function(item) { return item.trim(); });                                              
              var map = {'CC': 'CountryCode', 'RC': 'region_code', 'CT': 'city', 'CO': 'Continent', 'GL': 'geolocation'}
              for(var i=0; i<comps.length; i++) {
                var compSplit = comps[i].split(':');
                info[map[compSplit[0]]] = compSplit[1];
              }
            }

            return info;
          }

          var geoinfo = getGeoInfo();

          if(geoinfo && !geoinfo.CountryCode) {
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.src= 'https://m.economictimes.com/geoapiet/?cb=et';
            script.onload = function() {
              const geoLoaded = new Event("geoLoaded");
              document.dispatchEvent(geoLoaded);
            };
            document.head.appendChild(script);
          } else {
            const geoLoaded = new Event("geoLoaded");
            document.dispatchEvent(geoLoaded);
          }
        `}
      </Script>
      {/* <Script
        src="https://m.economictimes.com/geoapiet/?cb=et"
        onLoad={() => {
          const geoLoaded = new Event("geoLoaded");
          document.dispatchEvent(geoLoaded);
        }}
      /> */}
      <Script
        src={jsIntsURL}
        strategy="afterInteractive"
        onLoad={() => {
          const objIntsLoaded = new Event("objIntsLoaded");
          document.dispatchEvent(objIntsLoaded);
        }}
      />

      {!reqData.opt && isReady && (
        <>
          <Script
            id="google-analytics"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', '${Config.GA.GA_ID}', 'auto');
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
              window.customDimension = {
                ...window["customDimension"],
                url:
                  (window.location.pathname + window.location.search).length > 1
                    ? (window.location.pathname + window.location.search).substr(1)
                    : window.location.pathname + window.location.search
              };
              window.grx("track", "page_view", window.customDimension);
            }}
          />
          <Script
            id="tag-manager"
            strategy={isTopicPage ? "lazyOnload" : "worker"}
            src={`https://www.googletagmanager.com/gtag/js?id=${Config.GA.GTM_KEY}`}
          />
          {isTopicPage ? (
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
          ) : (
            <Script
              id="tag-manager-init"
              type="text/partytown"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                window.gtag = function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${Config.GA.GTM_ID}', { send_page_view: false });
              `
              }}
            />
          )}
          <Script strategy="lazyOnload" src="https://agi-static.indiatimes.com/cms-common/ibeat.min.js" />
          <Script strategy="lazyOnload" src="https://sb.scorecardresearch.com/beacon.js" />

          {!isprimeuser && (
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
            </>
          )}
        </>
      )}
    </>
  );
};

export default Scripts;
