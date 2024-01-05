import styles from "./VideoShow.module.scss";
import SocialShare from "components/SocialShare";
import VideoEmbed from "components/VideoEmbed";
import SeoWidget from "components/SeoWidget";
import DfpAds from "components/Ad/DfpAds";
import { useEffect, useState, Fragment, FC } from "react";
import AppDownloadWidget from "components/AppDownloadWidget";
import SEO from "components/SEO";
import { PageProps, VideoShowProps, OtherVidsProps } from "types/videoshow";
import BreadCrumb from "components/BreadCrumb";
import Listing from "components/Listing";
import GreyDivider from "components/GreyDivider";
import { getPageSpecificDimensions, updateDimension } from "utils";
import { ET_WAP_URL } from "utils/common";

const VideoShow: FC<PageProps> = (props) => {
  const result = props?.searchResult?.find((item) => item.name === "videoshow")?.data as VideoShowProps;
  const otherVids = props?.searchResult?.find((item) => item.name === "other_videos") as OtherVidsProps;
  const hideAds = result.hideAds == 1;

  const [isPrimeUser, setIsPrimeUser] = useState(0);
  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;

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

  const intsCallback = () => {
    updateDimension({ pageName: parameters?.type, msid: parameters.msid, subsecnames: seo.subsecnames });
    window.objInts.afterPermissionCall(() => {
      window.objInts.permissions.indexOf("subscribed") > -1 && setIsPrimeUser(1);
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
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };
  }, [props]);

  const url = `${result.iframeUrl}&skipad=${isPrimeUser || hideAds}&primeuser=${isPrimeUser}`;
  return (
    <>
      <div className={styles.mainContent}>
        {!hideAds && (
          <div className={`${styles.hdAdContainer} adContainer expando_${cpd_wap}`}>
            <DfpAds adInfo={{ key: "atf", subsecnames: seo.subsecnames || {} }} identifier={msid} />
          </div>
        )}
        <div className={styles.videoshow}>
          <VideoEmbed url={url} />

          <div className={styles.wrap}>
            <h1 role="heading">{result.title}</h1>
            <div className={styles.synopsis}>
              <p>{result.synopsis}</p>
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
        <SeoWidget data={result.relKeywords} title="READ MORE" />
        {Array.isArray(otherVids.data) && <Listing type="grid" title={otherVids.title} data={otherVids} />}
        <SEO {...seoData} />
        <GreyDivider />
        <AppDownloadWidget tpName="videoshow" />
        <BreadCrumb data={seoData.breadcrumb} />
        {!hideAds && (
          <div className={`${styles.footerAd} adContainer`}>
            <DfpAds adInfo={{ key: "fbn", subsecnames: seo.subsecnames || {} }} identifier={msid} />
          </div>
        )}
      </div>
    </>
  );
};

export default VideoShow;
