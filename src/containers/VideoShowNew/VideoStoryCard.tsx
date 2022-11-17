import { useEffect, useRef, useState } from "react";
import styles from "./VideoShow.module.scss";
import SocialShare from "components/SocialShare";
import { dynamicPlayerConfig, handleAdEvents, handlePlayerEvents } from "utils/slike";
import { grxEvent, pageview } from "utils/ga";
import { ET_WAP_URL } from "utils/common";
import Head from "next/head";
declare global {
  interface Window {
    fromIframeNewVideo: any;
    SlikePlayer: any;
    spl: any;
  }
}

export default function VideoStoryCard({ result, index, didUserInteractionStart, pageViewMsids }) {
  const [isMoreShown, setIsMoreShown] = useState(index === 0);
  const videoStoryCardRef = useRef(null);

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
  const setPlayer = () => {
    const playerConfig = JSON.parse(JSON.stringify(dynamicPlayerConfig));
    playerConfig.contEl = "id_" + result.msid;
    playerConfig.video.id = result.slikeid;
    playerConfig.video.playerType = result.playertype;
    playerConfig.video.shareUrl = ET_WAP_URL + result.url;
    playerConfig.video.description_url = ET_WAP_URL + result.url; // no need to modify; added specifically for tracking purpose by Slike team
    playerConfig.video.image = result.img;
    playerConfig.video.title = result.title;
    playerConfig.player.msid = result.msid;
    playerConfig.player.autoPlay = index === 0;
    playerConfig.player.pagetpl = "videoshownew";

    const player = new window.SlikePlayer(playerConfig);

    handleAdEvents(player);
    handlePlayerEvents(player);
  };

  useEffect(() => {
    /**
     * SlikePlayerReady is dispatched from VideoShow(parent) component.
     * index > 0 can happen only after slike is fully initialized.
     */
    if (index === 0) {
      document.addEventListener("SlikePlayerReady", () => {
        setPlayer();
      });
    } else {
      setPlayer();
    }
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
      {/* {isFirstVidBeforeLoad && <img src={result.img} fetchpriority="high" style={{ display: "none" }} />} */}
      <Head>
        <link rel="preload" as="image" href={result.img}></link>
      </Head>
      <div
        className={`${styles.vidDiv} ${isFirstVidBeforeLoad ? styles.firstVidBeforeLoad : ""}`}
        id={`id_${result.msid}`}
        style={
          isFirstVidBeforeLoad
            ? {
                backgroundImage: `url(${result.img})`,
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat"
              }
            : {}
        }
      ></div>
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
          {result.agency} | {result.date}
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
