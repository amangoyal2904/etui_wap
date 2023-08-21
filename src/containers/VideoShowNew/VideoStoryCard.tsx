import { Fragment, useEffect, useRef, useState } from "react";
import styles from "./VideoShow.module.scss";
import SocialShare from "components/SocialShare";
import { dynamicPlayerConfig, handleAdEvents, handlePlayerEvents, setGetPlayerConfig } from "utils/slike";
import { grxEvent, pageview } from "utils/ga";
import { ET_WAP_URL, getSubsecString } from "utils/common";
declare global {
  interface Window {
    fromIframeNewVideo: any;
    SlikePlayer: any;
    spl: any;
    slikePlayer: any;
  }
}

export default function VideoStoryCard({ result, subsecNames, index, didUserInteractionStart, pageViewMsids }) {
  const [isMoreShown, setIsMoreShown] = useState(index === 0);
  const videoStoryCardRef = useRef(null);
  const hideAds = result.hideAds == 1;

  function getAuthors(authors) {
    if (!authors || !Array.isArray(authors) || authors.length === 0) return "";
    return (
      <span>
        By{" "}
        {authors?.map((author, i) => {
          return (
            <Fragment key={`author_${i}`}>
              {author.url ? <a href={author.url}>{author.title}</a> : author.title},
            </Fragment>
          );
        })}
      </span>
    );
  }

  /**
   * Fires tracking events.
   * Toggles video description
   */
  const handleClick = () => {
    grxEvent(
      "event",
      {
        event_category: "VIDEOSYNOPSIS",
        event_action: `Click-${isMoreShown ? "Show Less" : "Show More"}`,
        event_label: result.title
      },
      1
    );
    setIsMoreShown(!isMoreShown);
  };

  /**
   * Sets player specific configuration immutably.
   * Calls player event hooks
   */
  const setPlayer = (isPrimeUser) => {
    const autoPlay = index === 0;
    const subSecs = getSubsecString(subsecNames);

    let adSection = "videoshow",
      isDeferredPreRoll = false;
    if (subsecNames.subsec1 == 13352306) {
      // industry
      adSection = "industry";
      isDeferredPreRoll = true;
    }

    if (subsecNames.subsec1 == 1977021501) {
      adSection = "markets";
    }

    const playerConfig = setGetPlayerConfig({
      dynamicPlayerConfig,
      result,
      autoPlay,
      pageTpl: "videoshownew",
      isPrimeUser,
      subSecs,
      hideAds: isPrimeUser || hideAds,
      adSection,
      isDeferredPreRoll
    });

    window.slikePlayer = window.slikePlayer || {};
    const player = new window.SlikePlayer(playerConfig);
    window.slikePlayer[index] = player;

    handleAdEvents(player);
    handlePlayerEvents(player);
  };
  const intsCallback = () => {
    window.objInts.afterPermissionCall(() => {
      if (window.objInts.permissions.indexOf("subscribed") > -1) {
        /**
         * SlikePlayerReady is dispatched from VideoShow(parent) component.
         * index > 0 can happen only after slike is fully initialized.
         */
        if (index === 0) {
          document.addEventListener("SlikePlayerReady", () => {
            setPlayer(1);
          });
        } else {
          setPlayer(1);
        }
      } else {
        if (index === 0) {
          document.addEventListener("SlikePlayerReady", () => {
            setPlayer(0);
          });
        } else {
          setPlayer(0);
        }
      }
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
    if (videoStoryCardRef.current) {
      /**
       * Observe each video story box using IntersectionObserver.
       * Observe so as to update URL in the browser address bar whenever a video story is in the viewport.
       * Fires pageview tracking event once for each video story.
       */
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const vidStoryUrl = `${result.url}${window.location.search}`;
            index > 0 && window.history.pushState({}, "", vidStoryUrl);
            if (pageViewMsids.indexOf(result.msid) === -1 && index > 0) {
              pageViewMsids.push(result.msid);
              pageview(vidStoryUrl);
            }
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5
        }
      );

      observer.observe(videoStoryCardRef.current);

      return () => {
        observer.unobserve(videoStoryCardRef.current);
      };
    }
  }, [videoStoryCardRef]);

  //=== 'isFirstVidBeforeLoad' variable is to show the video poster image and style on first video while slike sdk is not ready.
  const isFirstVidBeforeLoad = index === 0 && !didUserInteractionStart;

  return (
    <div className={styles.videoshow} ref={videoStoryCardRef}>
      {/* {isFirstVidBeforeLoad && (
        <Head>
          <link rel="preload" as="image" fetchpriority="high" href={result.img}></link>
        </Head>
      )} */}
      <div
        className={`${styles.vidDiv} ${isFirstVidBeforeLoad ? styles.firstVidBeforeLoad : ""}`}
        id={`id_${result.msid}`}
      >
        {/* {isFirstVidBeforeLoad && <img src={result.img} className={styles.video_thumb} fetchpriority="high" />} */}
        {isFirstVidBeforeLoad && (
          <iframe
            srcDoc={`<img src=${result.img} style="position: absolute;top:0;width:100%;height:100%;left:0;"  />`}
            className={styles.video_thumb}
          />
        )}
      </div>
      <div className={styles.wrap}>
        <h1 role="heading">{result.title}</h1>
        <div className={styles.synopsis}>
          {
            <p>
              {isMoreShown && result.synopsis}
              <span className={styles.moreLess} onClick={handleClick}>
                {isMoreShown ? " show less" : "More..."}
              </span>
            </p>
          }
        </div>
        <div className={styles.date}>
          {getAuthors(result.authors)} {result.agency} | {result.date}
        </div>
      </div>
      <SocialShare
        shareParam={{
          shareUrl: ET_WAP_URL + result.url,
          title: result.title,
          msid: result.msid,
          hostId: result.hostid,
          type: "5"
        }}
      />
    </div>
  );
}
