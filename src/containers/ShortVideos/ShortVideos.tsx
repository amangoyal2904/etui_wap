import SEO from "components/SEO";
import { FC, useEffect, useState } from "react";
import { loadScript } from "utils";
import styles from "./ShortVideos.module.scss";

declare global {
  interface Window {
    ShortsPlayer: any;
  }
}

const ShortVideos: FC = (props: any) => {
  const [isPrimeUser, setIsPrimeUser] = useState(false);
  const result = props?.searchResult?.find((item) => item.name === "shortvideos")?.data || {};
  const slikeId = result.slikeid || "";

  const { seo = {}, version_control } = props;
  const seoData = { ...seo, ...version_control?.seo };

  function initPlayer() {
    const config = {
      containerElement: document.getElementById("shortsVids"),
      onVideoEnd: 1,
      startId: slikeId,
      playlistId: "",
      endPlayList: 1,
      nextPlaylistId: ["hqcfq9zku6_v", "hqbv396zzl_v", "hqbv496z6z_v", "hqbve96z66", "hqcns9zu6u_v"],
      fallbackPlayList: "hqcfq9zku6_v",
      apiKey: "etmweb46324htoi24",
      ui: {
        back: true,
        mute: true,
        views: false,
        viewShowAbove: 1000,
        share: true,
        whatsapp: true,
        progress: true,
        logo: false,

        swipUpCount: 3,
        logoCTR: "",
        logoURL: ""
      },
      player: {
        prefetchVideoCount: 4,
        preferMp4: false
      },
      ad: {
        adStartIndex: 2,
        adFrequency: 3,
        adPreCache: 4000,
        adRetry: 3,
        skipAd: isPrimeUser,
        adTags: {
          default: {
            pre: {
              url: [
                "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator="
              ]
            }
          }
        }
      },
      userData: {
        isPrime: false,
        pageUrl: "",
        pageSection: "",
        pageTpl: "",
        pid: "",
        geo: "delhi",
        Gdpr: true
      }
    };

    const ShortsPlayer = new window.ShortsPlayer({ ...config }, function (error) {
      if (error) {
        console.error(error);
        return;
      }
    });

    ShortsPlayer.on("INDEX_CHANGES", function (data) {
      const seoURL = `/${data?.seoPath}/shortvideos/${data?.msid}.cms`;
      window.history.pushState({}, "", seoURL);
      document.title = data?.title;
    });

    ShortsPlayer.on("SHARE_BUTTON_CLICK", function (data) {
      window.navigator.share &&
        window.navigator.share({
          url: window.location.href,
          title: data?.title || ""
        });
    });

    ShortsPlayer.on("WHATSAPP_CLICKED", function () {
      window.location.href = `whatsapp://send?text=${window.location.href}`;
    });

    ShortsPlayer.on("BACK_BUTTON_CLICKED", function () {
      const takeTo = document.referrer.indexOf("m.economictimes.com") > -1 ? document.referrer : "/";
      window.location.href = takeTo;
    });
  }
  /**
   * Loads slike sdks and on successful load, fires custom event objSlikeScriptsLoaded
   */
  function loadSlikeScripts() {
    const promise = loadScript("https://web.sli.ke/sdk/shorts.js");

    promise.then(
      () => {
        const objSlikeScriptsLoaded = new Event("objSlikeScriptsLoaded");
        document.dispatchEvent(objSlikeScriptsLoaded);
      },
      (error) => {
        console.error("short video slike sdk failed to load: ", error);
      }
    );
  }

  const intsCallback = () => {
    window.objInts.afterPermissionCall(() => {
      window.objInts.permissions.indexOf("subscribed") > -1 && setIsPrimeUser(true);
    });
  };
  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      intsCallback();
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }
    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);

  useEffect(() => {
    loadSlikeScripts();
    document.addEventListener("objSlikeScriptsLoaded", () => {
      initPlayer();
    });
  }, []);

  return (
    <div className={styles.shortsWrap}>
      <div id="shortsVids"></div>
      <SEO {...seoData} />
    </div>
  );
};

export default ShortVideos;
