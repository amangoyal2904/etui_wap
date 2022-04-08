import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "./VideoShow.module.scss";
import SocialShare from "components/SocialShare";
import VideoEmbed from "components/VideoEmbed";
import SeoWidget from "components/SeoWidget";
import DfpAds from "components/Ad/DfpAds";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNavBarStatus } from "Slices/appHeader";
import AppDownloadWidget from "components/AppDownloadWidget";
import SEO from "components/SEO";
interface OtherVidsProps {
  data: {
    duration: string;
    img: string;
    title: string;
    url: string;
    views: string;
  }[];
  title: string;
  name: string;
}
interface VideoShowProps {
  relKeywords: {
    title: string;
    url: string;
  }[];
  iframeUrl: string;
  title: string;
  synopsis: string;
  agency: string;
  date: string;
}
interface SeoProps {
  lang: string;
  title: string;
  url: string;
  actualURL: string;
  canonical: string;
  type: string; // e.g. article
  description: string;
  image: string;
  inLanguage: string;
  authors?: string[];
  agency?: string[];
  date: string;
  updated: string;
  articleSection?: string;
  story?: string;
  remove_paywall_schema?: number;
  behindLogin?: number;
  hostid: number;
  langInfo?: { url: string; lang: string }[];
  ampURL?: string;
  keywords?: string;
  news_keywords?: string;
  noindex?: number;
  noindexFollow?: number;
  expiry?: string;
  sponsored?: number;
  maxImgPreview?: number;
  isPrime?: number;
  subsecnames?: {
    subsec1?: number;
    subsecname1?: string;
    subsec2?: number;
    subsecname2?: string;
    subsec3?: number;
    subsecname3?: string;
  };
  schemaType?: string;
  schemaMeta?: string;
  seoschema?: {
    webPage?: object;
    newsArticle?: object;
    videoObject?: object;
  };
  org_img?: string;
  org_img_hin?: string;
  page: string;
  seoListData?: { url: string; title: string; date: string; img: string }[];
}
interface CommonConfigProps {
  seo?: {
    org_img?: string;
    org_img_hin?: string;
  };
}
interface PageProps {
  data: {
    searchResult: [
      {
        name: string;
        data: VideoShowProps;
      },
      OtherVidsProps
    ];
    seo: SeoProps;
    common_config: CommonConfigProps;
  };
}

const VideoShow: NextPage<PageProps> = ({ data }) => {
  const seoData = { ...data.seo, ...data.common_config.seo };
  // const result:VideoShowProps  = data.searchResult[0].data;
  // const otherVids = data.searchResult.find(
  //   (item) => item.name === 'other_videos'
  // );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setNavBarStatus(false));
    return () => {
      dispatch(setNavBarStatus(true));
    };
  }, [dispatch]);
  return (
    <>
      <div className={`${styles.mrecContainer} adContainer`}>
        <DfpAds adInfo={{ key: "mrec3" }} />
      </div>
      {data?.searchResult.map((item) => {
        if (item.name === "videoshow") {
          const result = item.data as VideoShowProps;
          console.log(result);
          return (
            <>
              <div className={styles.videoshow}>
                <VideoEmbed url={result.iframeUrl} />

                <div className={styles.wrap}>
                  <h1>{result.title}</h1>
                  <div>
                    <p>{result.synopsis}</p>
                  </div>
                  <div className={styles.date}>
                    {result.agency} | {result.date}
                  </div>
                </div>
                <SocialShare />
                <SEO data={seoData} />
              </div>
              <SeoWidget data={result.relKeywords} title="READ MORE" />
            </>
          );
        } else if (item.name === "other_videos") {
          const otherVids = item as OtherVidsProps;

          return (
            <>
              <div className={styles.otherVids}>
                <h2>{otherVids.title}</h2>
                <div className={styles.vidsSlider}>
                  <ul>
                    {otherVids.data.map((item, index) => (
                      <li key={"OtherVideo" + index}>
                        <Link href={item.url}>
                          <a>
                            <Image src={item.img} alt={item.title} width={135} height={100} />
                            <p>{item.title}</p>
                            <span className={styles.slideVidIcon}></span>
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          );
        }
      })}

      <AppDownloadWidget tpName="videoShow" />
    </>
  );
};

export default VideoShow;
