import { useEffect, useRef, useState } from "react";
import styles from "./VideoShow.module.scss";
import SocialShare from "components/SocialShare";
import { dynamicPlayerConfig, handleAdEvents, handlePlayerEvents } from "utils/slike";
import { grxEvent, pageview } from "utils/ga";
import { ET_WAP_URL } from "utils/common";
declare global {
  interface Window {
    fromIframeNewVideo: any;
    SlikePlayer: any;
    spl: any;
  }
}

export default function VideoBox({ result, index, didUserInteractionStart }) {
  const [isMoreShown, setIsMoreShown] = useState(index === 0);

  const vidBoxRef = useRef(null);

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

  const setPlayer = () => {
    const playerConfig = JSON.parse(JSON.stringify(dynamicPlayerConfig));
    playerConfig.contEl = "id_" + result.msid;
    playerConfig.video.id = result.slikeid;
    playerConfig.video.playerType = result.playertype;
    playerConfig.video.shareUrl = result.url;
    playerConfig.video.image = result.img;
    playerConfig.video.title = result.title;
    playerConfig.player.msid = result.msid;
    playerConfig.player.autoPlay = index === 0;

    const player = new window.SlikePlayer(playerConfig);

    handleAdEvents(player);
    handlePlayerEvents(player);
  };

  useEffect(() => {
    if (index === 0) {
      document.addEventListener("SlikePlayerReady", () => {
        setPlayer();
      });
    } else {
      setPlayer();
    }
  }, []);

  useEffect(() => {
    if (vidBoxRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const vidStoryUrl = `${result.url}${window.location.search}`;
            window.history.pushState({}, "", vidStoryUrl);
            pageview(vidStoryUrl);
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5
        }
      );

      observer.observe(vidBoxRef.current);

      return () => {
        observer.unobserve(vidBoxRef.current);
      };
    }
  }, [vidBoxRef]);

  return (
    <div className={styles.videoshow} ref={vidBoxRef}>
      <div
        className={`${styles.vidDiv} ${index === 0 && !didUserInteractionStart ? styles.firstVidBeforeLoad : ""}`}
        id={`id_${result.msid}`}
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
