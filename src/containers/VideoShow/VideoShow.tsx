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
  const [loadVideo, setLoadVideo] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;

  const objVc: any = version_control;

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
    window.objInts.afterPermissionCall(() => {
      window.objInts.permissions.indexOf("subscribed") > -1 && setIsPrimeUser(1);
    });
  };
  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      intsCallback();
      updateDimension({ pageName: parameters?.type, msid: parameters.msid, subsecnames: seo.subsecnames });
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
  const loadVideoIframe = () => {
    setLoadVideo(true);
    setShowLoader(true);
  };
  const onIframeLoadTask = () => {
    setShowLoader(false);
  };

  const url = `${result.iframeUrl}&skipad=${isPrimeUser || hideAds}&primeuser=${isPrimeUser}`;
  let imgUrl = result?.img && result?.img.replace("width-440", "width-267");
  imgUrl = imgUrl && imgUrl.replace("height-330", "height-200");

  return (
    <>
      <div className="mainContent">
        {typeof objVc !== "undefined" && objVc.ticker_ad == 1 && !isPrimeUser && (
          <DfpAds adInfo={{ key: "mh", subsecnames: seo.subsecnames || {} }} identifier={msid} />
        )}
        {!hideAds && (
          <div className={`hdAdContainer adContainer expando_${cpd_wap}`}>
            <DfpAds adInfo={{ key: "atf", subsecnames: seo.subsecnames || {} }} identifier={msid} />
          </div>
        )}
        <div className={"videoshow"}>
          {!loadVideo ? (
            <div className="videoShowWrapper" onClick={loadVideoIframe}>
              <img height={200} src={imgUrl || result?.img} fetchpriority="high" />
              <span className="playButton">&#9658;</span>
            </div>
          ) : (
            <VideoEmbed url={url} showLoader={showLoader} onIframeLoadTask={onIframeLoadTask} />
          )}

          <div className={"wrap"}>
            <h1 role="heading">{result.title}</h1>
            <div className={"synopsis"}>
              <p>{result.synopsis}</p>
            </div>
            <div className={"date"}>
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
          <div className={`footerAd adContainer`}>
            <DfpAds adInfo={{ key: "fbn", subsecnames: seo.subsecnames || {} }} identifier={msid} />
          </div>
        )}
      </div>
      <style jsx>{`
        .videoshow {
          background: #f0f0f0;
          margin-top: 10px;
          min-height: 500px;
          padding-bottom: 4px;
        }
        .wrap {
          padding: 1rem;
        }
        .date {
          color: #666;
          font-size: 0.95em;
          line-height: 1.5;
        }
        .date a {
          color: #000;
        }

        h1 {
          font-size: 1.35rem;
          font-weight: 700;
          line-height: 1.7rem;
        }

        .synopsis p {
          font-size: 15px;
          line-height: 1.5rem;
        }
        .videoShowWrapper {
          background: #000;
          text-align: center;
          position: relative;
        }
        .playButton {
          color: #fff;
          border: 5px solid;
          border-radius: 50%;
          padding: 6px 10px;
          position: absolute;
          top: 35%;
          left: 44%;
          font-size: 22px;
        }
      `}</style>
    </>
  );
};

export default VideoShow;
