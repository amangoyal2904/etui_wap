import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "./VideoShow.module.scss";
import SocialShare from "components/SocialShare";
import VideoEmbed from "components/VideoEmbed";
import SeoWidget from "components/SeoWidget";
import DynamicFooter from "components/DynamicFooter";
import DfpAds from "components/Ad/DfpAds";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNavBarStatus } from "Slices/appHeader";
import AppDownloadWidget from "components/AppDownloadWidget";
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
interface PageProps {
  data: {
    searchResult: [
      {
        name: string;
        data: VideoShowProps;
      },
      OtherVidsProps
    ];
  };
}

const VideoShow: NextPage<PageProps> = ({ data }) => {
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
                {/* <SEO data={data.searchResult[1].dta} page='articleshow'/> */}
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
      <DynamicFooter />
    </>
  );
};

export default VideoShow;
