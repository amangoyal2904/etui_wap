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

const VideoShow: FC<PageProps> = (props) => {
  const result = props?.searchResult?.find((item) => item.name === "videoshow")?.data as VideoShowProps;
  const nextMsid = result?.nextvideo;

  const [articles, setArticles] = useState([props?.searchResult]);
  const [isLoading, setIsLoading] = useState(false);

  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;

  const nextVideoMsid = useRef(nextMsid);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (loadMoreRef.current) {
      document.addEventListener("objSlikeScriptsLoaded", () => {
        window.spl.load(dynamicPlayerConfig, (status) => {
          if (status) {
            const SlikePlayerReady = new Event("SlikePlayerReady");
            document.dispatchEvent(SlikePlayerReady);

            const observer = new IntersectionObserver(([entry]) => {
              if (entry.isIntersecting && nextVideoMsid.current > 0 && articles.length < MAX_SCROLL_VIDS_COUNT) {
                const api = APIS_CONFIG.FEED;
                (async () => {
                  try {
                    setIsLoading(true);
                    const res = await Service.get({
                      api,
                      params: { type: "videoshow", msid: nextVideoMsid.current, platform: "wap", feedtype: "etjson" }
                    });
                    const data = res.data || {};
                    const result = data?.searchResult?.find((item) => item.name === "videoshow")?.data || {};
                    const nextMsid1 = result.nextvideo;
                    nextVideoMsid.current = nextMsid1;
                    articles.push(data?.searchResult);
                    setArticles(articles);
                    setIsLoading(false);
                  } catch (err) {
                    console.error(err);
                  }
                })();
              }
            });

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
      <div className={styles.mainContent}>
        <div className={`${styles.hdAdContainer} adContainer expando_${cpd_wap}`}>
          <DfpAds adInfo={{ key: "atf" }} identifier={msid} />
        </div>
        {articles.map((item, i) => (
          <VidCard index={i} result={item[0].data} key={`vid_${i}`} />
        ))}
        <div ref={loadMoreRef} className={styles.center}>
          {isLoading && <Loading />}
        </div>
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
