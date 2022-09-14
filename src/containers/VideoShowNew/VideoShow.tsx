import styles from "./VideoShow.module.scss";
import DfpAds from "components/Ad/DfpAds";
import { useEffect, useState, FC, useRef } from "react";
import SEO from "components/SEO";
import { PageProps, VideoShowProps } from "types/videoshow";
import BreadCrumb from "components/BreadCrumb";
import { getPageSpecificDimensions } from "utils";
import APIS_CONFIG from "network/config.json";
import Service from "network/service";
import VidCard from "./VidCard";
import Loading from "components/Loading";
import { dynamicPlayerConfig } from "utils/slike";

const MAX_SCROLL_VIDS_COUNT = 20;
const videoStoryMsids = [];

const VideoShow: FC<PageProps> = (props) => {
  const result = props?.searchResult?.find((item) => item.name === "videoshow")?.data as VideoShowProps;

  const [videoStories, setVideoStories] = useState([props?.searchResult]);
  const [isLoading, setIsLoading] = useState(false);

  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;

  const loadMoreRef = useRef(null);

  let showLoaderNext = false;
  if (videoStories.length < MAX_SCROLL_VIDS_COUNT) {
    showLoaderNext = true;
  }

  useEffect(() => {
    console.log("useEffect vidshow");

    if (loadMoreRef.current) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.25, 0.5, 0.75, 1]
      };

      document.addEventListener("objSlikeScriptsLoaded", () => {
        console.log("vidshow objSlikeScriptsLoaded");

        window.spl.load(dynamicPlayerConfig, (status) => {
          console.log("Vidshow status: ");
          if (status) {
            const SlikePlayerReady = new Event("SlikePlayerReady");
            document.dispatchEvent(SlikePlayerReady);
            let nextVideoMsid = result.nextvideo;
            console.log("Vidshow observer bound: ");

            const observer = new IntersectionObserver(([entry]) => {
              if (
                entry.isIntersecting &&
                nextVideoMsid > 0 &&
                videoStoryMsids.indexOf(nextVideoMsid) === -1 &&
                videoStoryMsids.length < MAX_SCROLL_VIDS_COUNT
              ) {
                videoStoryMsids.push(nextVideoMsid);
                console.log("called: ", videoStoryMsids.length, videoStories.length);

                const api = APIS_CONFIG.FEED;
                (async () => {
                  try {
                    setIsLoading(true);
                    const res = await Service.get({
                      api,
                      params: { type: "videoshow", msid: nextVideoMsid, platform: "wap", feedtype: "etjson" }
                    });
                    const data = res.data || {};
                    const output = data?.searchResult?.find((item) => item.name === "videoshow")?.data || {};
                    nextVideoMsid = output.nextvideo;
                    setVideoStories((prevVideoStories) => [...prevVideoStories, data?.searchResult]);
                    setIsLoading(false);
                  } catch (err) {
                    console.error(err);
                  }
                })();
              }
            }, options);

            observer.observe(loadMoreRef.current);
            return () => {
              observer.unobserve(loadMoreRef.current);
            };
          }
        });
      });
    }
  }, [loadMoreRef]);

  useEffect(() => {
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };
  }, [props]);

  return (
    <>
      <div className={styles.mainContent} id="vidContainer">
        <div className={`${styles.hdAdContainer} adContainer expando_${cpd_wap}`}>
          <DfpAds adInfo={{ key: "atf" }} identifier={msid} />
        </div>
        {videoStories.map((item, i) => (
          <VidCard index={i} result={item[0].data} key={`vid_${i}`} />
        ))}
        {showLoaderNext && (
          <div ref={loadMoreRef} className={styles.loadNext}>
            {isLoading && <Loading />}
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
