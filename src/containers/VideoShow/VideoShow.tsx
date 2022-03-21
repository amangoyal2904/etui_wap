import { NextPage } from 'next';
import Link from 'next/link';
import styles from './VideoShow.module.scss';
import SEO from 'components/SEO';

interface PageProps {
  query: string | string[],
  data: any
}

const VideoShow: NextPage<PageProps> = ({ query, data }) => {
  
  return (
    <div className={styles.header}>
      <h1>Video Show</h1>

      {/* <SEO data={data.searchResult[1].dta} page="articleshow"/> */}
    </div>
  )
}

export default VideoShow;