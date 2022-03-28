import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from './VideoShow.module.scss';
import SEO from 'components/SEO';
import SocialShare from 'components/SocialShare';
import VideoEmbed from 'components/VideoEmbed';
import SeoWidget from 'components/SeoWidget';
import DynamicFooter from 'components/DynamicFooter';
import DfpAds from 'components/Ad/DfpAds';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNavBarStatus } from 'Slices/appHeader';

interface PageProps {
  query: string | string[],
  data: any
}

const VideoShow: NextPage<PageProps> = ({ query, data }) => {
  const result = data.searchResult.find(
    (item) => item.name === 'videoshow'
  ).data;
  const otherVids = data.searchResult.find(
    (item) => item.name === 'other_videos'
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setNavBarStatus(false));
    return () => {
      dispatch(setNavBarStatus(true));
    };
  }, []);
  return (
    <>
      <div className={`${styles.mrecContainer} adContainer`}>
      <DfpAds adInfo={{ "key": "mrec3" }} />
      </div>
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

      <div className={styles.otherVids}>
        <h2>{otherVids.title}</h2>
        <div className={styles.vidsSlider}>
          <ul>
            {otherVids.data.map(item => (
              <li>
                <Link href={item.url}>
                  <a>
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={135}
                      height={100}
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

      <DynamicFooter />
    </>
  );
};

export default VideoShow;
