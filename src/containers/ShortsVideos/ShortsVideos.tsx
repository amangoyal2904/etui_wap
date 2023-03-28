import { FC, useEffect, useState } from "react";
import styles from "./ShortsVideos.module.scss";
import { dynamicPlayerConfig, handleAdEvents, handlePlayerEvents } from "utils/slike";
import { loadScript } from "utils";
import { useSwipeable } from "react-swipeable";

const config = {
  delta: 1, // min distance(px) before a swipe starts. *See Notes*
  preventScrollOnSwipe: false, // prevents scroll during swipe (*See Details*)
  trackTouch: true, // track touch input
  trackMouse: true, // track mouse input
  rotationAngle: 0, // set a rotation angle
  swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
  touchEventOptions: { passive: true } // options for touch listeners (*See Details*)
};

const ShortsVideos: FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videos = [
    {
      msid: 98361575,
      slikeid: "1xrtyhw9oo",
      title: `5 factors why sensex went down in the last 5 days`
    },
    {
      msid: 98361385,
      slikeid: "1xrtyh19oo",
      title: `Heroic nurses save NICU incubators from falling during Turkey earthquake`
    },
    {
      msid: 98361319,
      slikeid: "1xrtyft9oo",
      title: `Paytm, Zomato among 4 tech stocks that saw ₹1,000 crore combined loss in Q3`
    }
  ];

  const handlers = useSwipeable({
    onSwipedUp: () => {
      currentVideoIndex + 1 < videos.length && setCurrentVideoIndex(currentVideoIndex + 1);
    },
    onSwipedDown: () => {
      currentVideoIndex > 0 && setCurrentVideoIndex(currentVideoIndex - 1);
    },
    ...config
  });

  /**
   * Sets player specific configuration immutably.
   * Calls player event hooks
   */
  const setPlayer = (isPrimeUser = 0) => {
    const playerConfig = JSON.parse(JSON.stringify(dynamicPlayerConfig));
    playerConfig.contEl = "id_" + videos[currentVideoIndex].msid;
    playerConfig.video.id = videos[currentVideoIndex].slikeid;
    playerConfig.video.playerType = 1;
    playerConfig.video.mute = false;
    // playerConfig.video.shareUrl = ET_WAP_URL + result.url;
    // playerConfig.video.description_url = ET_WAP_URL + result.url; // no need to modify; added specifically for tracking purpose by Slike team
    // playerConfig.video.image = result.img;
    playerConfig.video.title = videos[currentVideoIndex].title;
    // playerConfig.player.msid = msid;
    playerConfig.player.autoPlay = true;
    playerConfig.player.pagetpl = "ShortsVideos";
    playerConfig.player.skipAd = isPrimeUser;
    playerConfig.controls.dock.fallback = false;
    const player = new window.SlikePlayer(playerConfig);

    console.log(playerConfig);

    handleAdEvents(player);
    handlePlayerEvents(player);
  };

  /**
   * Loads slike sdks and on successful load, fires custom event objSlikeScriptsLoaded
   */
  function loadSlikeScripts() {
    const promise = loadScript("https://imasdk.googleapis.com/js/sdkloader/ima3.js");

    promise.then(
      () => {
        loadScript("https://tvid.in/sdk/loader.js").then(() => {
          const objSlikeScriptsLoaded = new Event("objSlikeScriptsLoaded");
          document.dispatchEvent(objSlikeScriptsLoaded);
        });
      },
      (error) => {
        console.error("ima3 sdk failed to load: ", error);
      }
    );
  }

  useEffect(() => {
    if (currentVideoIndex === 0) {
      loadSlikeScripts();

      document.addEventListener("objSlikeScriptsLoaded", () => {
        window.spl.load(dynamicPlayerConfig, (status) => {
          if (status) {
            setPlayer();
          }
        });
      });
    } else {
      setPlayer();
    }
  }, [currentVideoIndex]);

  return (
    <div className={styles.shortsWrap} {...handlers}>
      <div id={`id_${videos[currentVideoIndex].msid}`}></div>
    </div>
  );
};

export default ShortsVideos;
