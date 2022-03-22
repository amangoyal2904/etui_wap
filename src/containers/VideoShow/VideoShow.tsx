import { NextPage } from 'next';
import Link from 'next/link';
import styles from './VideoShow.module.scss';
import SEO from 'components/SEO';
import Share from 'components/SocialShare';
import VideoEmbed from 'components/VideoEmbed';
import SeoWidget from 'components/SeoWidget';

interface PageProps {
  query: string | string[],
  data: any
}

const VideoShow: NextPage<PageProps> = ({ query, data }) => {

  const result = data.searchResult.find(item => item.name === 'videoshow').data;

  return (
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
      {/* <Share /> */}
      <SeoWidget data={result.relKeywords} title="READ MORE"/>
      {/* <SEO data={data.searchResult[1].dta} page="articleshow"/> */}
    </div>
  )
}

export default VideoShow;