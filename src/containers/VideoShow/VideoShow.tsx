import Link from "next/link";
import Image from "next/image";
import styles from "./VideoShow.module.scss";
import SocialShare from "components/SocialShare";
import VideoEmbed from "components/VideoEmbed";
import SeoWidget from "components/SeoWidget";
import DfpAds from "components/Ad/DfpAds";
import { useEffect, Fragment, FC } from "react";
import { useDispatch } from "react-redux";
import { setNavBarStatus, setCtaStatus } from "Slices/appHeader";
import AppDownloadWidget from "components/AppDownloadWidget";
import SEO from "components/SEO";
import { PageProps, VideoShowProps, OtherVidsProps } from "types/videoshow";

const VideoShow: FC<PageProps> = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setNavBarStatus(false));
    dispatch(setCtaStatus(false));
    return () => {
      dispatch(setNavBarStatus(true));
      dispatch(setCtaStatus(true));
    };
  }, [dispatch]);
  const seoData = { ...props?.seo, ...props?.common_config?.seo };
  return (
    <>
      <div className={`${styles.mrecContainer} adContainer`}>
        <DfpAds adInfo={{ key: "mrec3" }} />
      </div>
      {props?.searchResult.map((item) => {
        if (item.name === "videoshow") {
          const result = item.data as VideoShowProps;
          return (
            <Fragment key={item.name}>
              <div className={styles.videoshow}>
                <VideoEmbed url={result.iframeUrl} />

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
                    title: result.title
                  }}
                />
              </div>
              <SeoWidget data={result.relKeywords} title="READ MORE" />
            </Fragment>
          );
        } else if (item.name === "other_videos") {
          const otherVids = item as OtherVidsProps;

          return (
            <Fragment key={item.name}>
              <div className={styles.otherVids}>
                <h2>{otherVids.title}</h2>
                <div className={styles.vidsSlider}>
                  <ul>
                    {otherVids.data.map((item, index) => (
                      <li key={"OtherVideo" + index}>
                        <Link href={item.url}>
                          <a>
                            <Image
                              src={item.img}
                              alt={item.title}
                              width={135}
                              height={100}
                              placeholder="blur"
                              blurDataURL="https://img.etimg.com/photo/42031747.cms"
                              unoptimized
                            />
                            <p>{item.title}</p>
                            <span className={styles.slideVidIcon}></span>
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Fragment>
          );
        }
      })}
      {/* <SEO data={seoData} /> */}
      <AppDownloadWidget tpName="videoShow" />
    </>
  );
};

export default VideoShow;
