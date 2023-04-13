import styles from "./VideoShow.module.scss";
import DfpAds from "components/Ad/DfpAds";
import { useEffect, useState, FC, useRef } from "react";
import SEO from "components/SEO";
import { PageProps, VideoShowProps } from "types/videoshow";
import BreadCrumb from "components/BreadCrumb";
import { getPageSpecificDimensions, loadScript, wait } from "utils";
import APIS_CONFIG from "network/config.json";
import Service from "network/service";
import VideoStoryCard from "./VideoStoryCard";
import Loading from "components/Loading";
import { dynamicPlayerConfig } from "utils/slike";

const MAX_SCROLL_VIDS_COUNT = 20;
const videoStoryMsids = []; // to keep track of the video story already fetched from the server
const pageViewMsids = []; // to keep track of the video story pageviews fire only once ( inside VideoStoryCard component )
const recosMsids = []; // to keep track of the slide reco api msids

const VideoShow: FC<PageProps> = (props) => {
  const result = props?.searchResult?.find((item) => item.name === "videoshow")?.data as VideoShowProps;

  const [videoStories, setVideoStories] = useState([props?.searchResult]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadErrMsg, setLoadErrMsg] = useState("");
  const [didUserInteractionStart, setDidUserInteractionStart] = useState(false);

  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;

  const loadMoreRef = useRef(null);

  let showLoaderNext = false;
  if (videoStories.length < MAX_SCROLL_VIDS_COUNT) {
    showLoaderNext = true;
  }

  /**
   * Loads slike sdks and on successful load, fires custom event objSlikeScriptsLoaded
   */
  function loadSlikeScripts() {
    if (!didUserInteractionStart) {
      setDidUserInteractionStart(true);
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
  }

  useEffect(() => {
    // Below are the two event listeners for loading the slike player scripts on user interaction.
    document.addEventListener(
      "touchstart",
      () => {
        loadSlikeScripts();
      },
      { once: true }
    );

    /*document.addEventListener(
      "scroll",
      () => {
        loadSlikeScripts();
      },
      { once: true }
    );*/

    const didUserVisitHomePage = window.sessionStorage.getItem("didUserVisitHomePage");
    if (didUserVisitHomePage !== null) {
      loadSlikeScripts();
    }

    if (loadMoreRef.current) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.25, 0.5, 0.75, 1]
      };

      /**
       * Load next videos only if -
       * 1. Slike sdks are loaded.
       * 2. Slike is successfully loaded and ready
       * 3. IntersectionObserver on next video loader finds it in viewport
       */
      document.addEventListener("objSlikeScriptsLoaded", () => {
        window.spl.load(dynamicPlayerConfig, (status) => {
          if (status) {
            const SlikePlayerReady = new Event("SlikePlayerReady");
            document.dispatchEvent(SlikePlayerReady);
            let nextVideoMsid = result.nextvideo;
            if (nextVideoMsid) {
              const observer = new IntersectionObserver(([entry]) => {
                if (
                  entry.isIntersecting &&
                  nextVideoMsid > 0 &&
                  videoStoryMsids.indexOf(nextVideoMsid) === -1 &&
                  videoStoryMsids.length < MAX_SCROLL_VIDS_COUNT
                ) {
                  videoStoryMsids.push(nextVideoMsid);

                  const api = APIS_CONFIG.FEED;
                  (async () => {
                    try {
                      setIsLoading(true);

                      // wait for 12 seconds for every next video load start
                      // await wait(12000);

                      const res = await Service.get({
                        api,
                        params: { type: "videoshow", msid: nextVideoMsid, platform: "wap", feedtype: "etjson" }
                      });
                      const data = res.data || {};
                      const output = data?.searchResult?.find((item) => item.name === "videoshow")?.data || {};

                      nextVideoMsid = recosMsids.length > 0 ? recosMsids.shift() : output.nextvideo;

                      setVideoStories((prevVideoStories) => [...prevVideoStories, data?.searchResult]);
                      setIsLoading(false);
                    } catch (err) {
                      console.error(err);
                      setIsLoading(false);
                      setLoadErrMsg(err.message);
                    }
                  })();
                }
              }, options);
              observer.observe(loadMoreRef.current);
              return () => {
                observer.unobserve(loadMoreRef.current);
              };
            } else {
              loadMoreRef.current.remove();
            }
          }
        });
      });
    }
  }, [loadMoreRef]);

  useEffect(() => {
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload, dimension25: "videoshownew" };
  }, [props]);

  useEffect(() => {
    const vidStory = videoStories?.slice(-1)[0]?.find((item) => item.name == "videoshow")?.data as VideoShowProps;

    if (vidStory && recosMsids.length === 0) {
      fetch(`https://reco.slike.in/similar/result.json?sid=${vidStory.slikeid}&msid=${vidStory.msid}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            const data3 = data.slice(0, 3);
            data3.forEach((item) => {
              recosMsids.push(item.msid);
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [videoStories]);

  return (
    <>
      <div className={styles.mainContent} id="vidContainer">
        <div className={`${styles.hdAdContainer} adContainer expando_${cpd_wap}`}>
          <DfpAds adInfo={{ key: "atf" }} identifier={msid} />
        </div>
        {videoStories.map((item, i) => (
          <VideoStoryCard
            index={i}
            result={item[0].data}
            key={`vid_${i}`}
            didUserInteractionStart={didUserInteractionStart}
            pageViewMsids={pageViewMsids}
          />
        ))}
        {showLoaderNext && (
          <div ref={loadMoreRef} className={styles.loadNext}>
            {isLoading && <Loading />}
            {loadErrMsg.length > 0 && loadErrMsg}
          </div>
        )}
        <SEO {...seoData} />
        <BreadCrumb data={seoData.breadcrumb} />
        <div className={`${styles.footerAd} adContainer`}>
          <DfpAds adInfo={{ key: "fbn" }} identifier={msid} />
        </div>
      </div>
    </>
  );
};

export default VideoShow;
