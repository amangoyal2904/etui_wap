import { FC, useEffect, useState } from "react";
import { loadScript } from "utils";
import styles from "./ShortVideos.module.scss";

declare global {
  interface Window {
    ShortsPlayer: any;
  }
}

const ShortVideos: FC = (props: any) => {
  const result = props?.searchResult?.find((item) => item.name === "shortvideos")?.data;
  const slikeId = result.slikeid;

  function initPlayer() {
    const config = {
      containerElement: document.getElementById("shortsVids"),
      onVideoEnd: 1,
      startId: slikeId,
      playlistId: "",
      endPlayList: 1,
      nextPlaylistId: [],
      fallbackPlayList: "hqcfq9zku6_v",
      apiKey: "etmweb46324htoi24",
      ui: {
        back: true,
        mute: true,
        views: true,
        viewShowAbove: 1000,
        share: true,
        whatsapp: true,
        progress: true,
        logo: true,

        swipUpCount: 3,
        logoCTR: "https://google.com",
        logoURL: "https://static.sli.ke/dam/dev/asset/17/39/1v1739u9o9.png"
      },
      player: {
        prefetchVideoCount: 4,
        preferMp4: false
      },
      ad: {
        adStartIndex: 1,
        adFrequency: 3,
        adPreCache: 4000,
        adRetry: 3,
        skipAd: false,
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
      console.log({ data });
      if (data.index > 0) {
        const seoURL = `/${data.seoPath}/shortvideos/${data.msid}.cms`;
        window.history.pushState({}, "", seoURL);
      }
    });
  }
  /**
   * Loads slike sdks and on successful load, fires custom event objSlikeScriptsLoaded
   */
  function loadSlikeScripts() {
    const promise = loadScript("https://web.sli.ke/sdk/stg/shorts.js");

    promise.then(
      () => {
        const objSlikeScriptsLoaded = new Event("objSlikeScriptsLoaded");
        document.dispatchEvent(objSlikeScriptsLoaded);
      },
      (error) => {
        console.error("ima3 sdk failed to load: ", error);
      }
    );
  }

  useEffect(() => {
    loadSlikeScripts();
    document.addEventListener("objSlikeScriptsLoaded", () => {
      initPlayer();
    });
  }, []);

  return (
    <div className={styles.shortsWrap}>
      <div id="shortsVids"></div>
    </div>
  );
};

export default ShortVideos;
