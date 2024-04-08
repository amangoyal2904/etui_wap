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
  const jsIntsURL = `${jsDomain}/js_ints.cms?v=${objVc["js_interstitial"] || 1000}&minify=${minifyJS}`;

  useEffect(() => {
    window.optCheck = router.asPath.indexOf("opt=1") != -1;

    document.addEventListener(
      "grxLoaded",
      () => {
        if (window.ga && window.grx && window.dataLayer) {
          updateDimension();
        }
      },
      { once: true }
    );

    document.addEventListener(
      "gaLoaded",
      () => {
        if (window.ga && window.grx && window.dataLayer) {
          updateDimension();
        }
      },
      { once: true }
    );

    document.addEventListener(
      "gtmLoaded",
      () => {
        if (window.ga && window.grx && window.dataLayer) {
          updateDimension();
        }
      },
      { once: true }
    );
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
          document.addEventListener("geoLoaded", () => {
            if (window.geoinfo && window.geoinfo.CountryCode != "IN") {
                function loadOnetrustSdk() {
                  const script = document.createElement('script');
                  script.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
                  script.async = true; 
                  script.charSet = 'UTF-8';
                  script.setAttribute('data-domain-script', '2e8261f2-d127-4191-b6f6-62ba7e124082');
                  document.head.appendChild(script);
                }
                if('requestIdleCallback' in window){
                  window.requestIdleCallback(function(){          
                    loadOnetrustSdk();
                  }, { timeout: 2500 })
                } else {
                  loadOnetrustSdk();
                }
            }
          });
          const hdomain = "economictimes.com";
          if (document.domain != hdomain && document.domain.indexOf(hdomain) != -1) {
              document.domain = hdomain;
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
              window.customDimension = { ...window["customDimension"], page: window.location.href };
              // ga('send', 'pageview', window.customDimension);
              const gaLoaded = new Event('gaLoaded');
              document.dispatchEvent(gaLoaded);
              `
            }}
          />

          <Script
            id="growthrx-analytics"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
               (function (g, r, o, w, t, h, rx) {
                    g[t] = g[t] || function () {(g[t].q = g[t].q || []).push(arguments)
                    }, g[t].l = 1 * new Date();
                    g[t] = g[t] || {}, h = r.createElement(o), rx = r.getElementsByTagName(o)[0];
                    h.async = 1;h.src = w;rx.parentNode.insertBefore(h, rx)
                })(window, document, 'script', 'https://static.growthrx.in/js/v2/web-sdk.js', 'grx');
                grx('init', window.objVc.growthRxId || 'gc2744074');
                window.customDimension = { ...window["customDimension"], url: window.location.href };
                //grx('track', 'page_view', {url: window.location.href});
                const grxLoaded = new Event('grxLoaded');
                document.dispatchEvent(grxLoaded);                
              `
            }}
          />

          <Script id="cookielaw">
            {`              
            function OptanonWrapper() { }
              `}
          </Script>

          {/* <Script
            src="https://static.growthrx.in/js/v2/web-sdk.js"
            strategy="lazyOnload"
            onLoad={() => {
              try{
                window.grx("init", window.objVc.growthRxId || "gc2744074");
                window.customDimension = { ...window["customDimension"], url: window.location.href };
                // window.grx("track", "page_view", window.customDimension);
                updateDimension();
              } catch(e) {
                updateDimension();
              }
              
            }}
          />
           */}
          <Script
            id="tag-manager"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${Config.GA.GTM_KEY}`}
            onLoad={() => {
              const gtmLoaded = new Event("gtmLoaded");
              document.dispatchEvent(gtmLoaded);
            }}
          />
          {/* {isTopicPage ? ( */}
          {/* <Script
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
          /> */}
          <Script
            id="tag-manager-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
               (function() {
                      // Ensure document is fully loaded before loading GTM script
                      window.addEventListener('load', function() {
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-566NCXC');
                      });
                     })();              
              `
            }}
          />

          {/* ) : (
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
          )} */}
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
                <Script src="https://static.clmbtech.com/ad/commons/js/2308/colombia_v2.js" strategy="lazyOnload" />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Scripts;
