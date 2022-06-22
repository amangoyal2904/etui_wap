import styles from "./VideoShow.module.scss";
import SocialShare from "components/SocialShare";
import VideoEmbed from "components/VideoEmbed";
import SeoWidget from "components/SeoWidget";
import DfpAds from "components/Ad/DfpAds";
import { useEffect, Fragment, FC } from "react";
import { useSelector } from "react-redux";
import AppDownloadWidget from "components/AppDownloadWidget";
import SEO from "components/SEO";
import { PageProps, VideoShowProps, OtherVidsProps } from "types/videoshow";
import BreadCrumb from "components/BreadCrumb";
import Listing from "components/Listing";
import GreyDivider from "components/GreyDivider";
import { AppState } from "app/store";
import { getPageSpecificDimensions } from "utils";

const VideoShow: FC<PageProps> = (props) => {
  const { seo = {}, version_control } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const loginState = useSelector((state: AppState) => state.login);

  useEffect(() => {
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };
  }, []);

  const VideoContainer = () => {
    {
      return props?.searchResult?.map((item) => {
        if (item.name === "videoshow") {
          const result = item.data as VideoShowProps;
          const url = `${result.iframeUrl}&skipad=${loginState.isprimeuser}`;
          return (
            <Fragment key={item.name}>
              <div className={styles.videoshow}>
                <VideoEmbed url={url} />

                <div className={styles.wrap}>
                  <h1 role="heading">{result.title}</h1>
                  <div className={styles.synopsis}>
                    <p>{result.synopsis}</p>
                  </div>
                  <div className={styles.date}>
                    {result.agency} | {result.date}
                  </div>
                </div>
                <SocialShare
                  shareParam={{
                    shareUrl: result.url,
                    title: result.title,
                    msid: result.msid,
                    hostId: result.hostid,
                    type: "5"
                  }}
                />
              </div>
              <SeoWidget data={result.relKeywords} title="READ MORE" />
            </Fragment>
          );
        } else if (item.name === "other_videos") {
          const otherVids = item as OtherVidsProps;
          return <Listing type="grid" title={otherVids.title} data={otherVids} key={item.name} />;
        }
      });
    }
  };
  return (
    <>
      <div className={`${styles.hdAdContainer} adContainer`}>
        <DfpAds adInfo={{ key: "atf" }} />
      </div>
      <div className={styles.mainContent}>{VideoContainer()}</div>
      <SEO {...seoData} />
      <GreyDivider />
      <AppDownloadWidget tpName="videoshow" />
      <BreadCrumb data={seoData.breadcrumb} />
      <div className={`${styles.footerAd} adContainer`}>
        <DfpAds adInfo={{ key: "fbn" }} />
      </div>
    </>
  );
};

export default VideoShow;
