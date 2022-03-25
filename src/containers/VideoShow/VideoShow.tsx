import { NextPage } from 'next';
import Link from 'next/link';
import styles from './VideoShow.module.scss';
import SEO from 'components/SEO';

interface PageProps {
  query: string | string[],
  data: any
}

const VideoShow: NextPage<PageProps> = ({ query, data }) => {
  const _seoOrgImgUrl = data.searchResult[3].data.seo;
  let seoData = data.searchResult[2].data;
      seoData.seoOrgImgUrl = _seoOrgImgUrl;
      
  console.log('data', data.searchResult[2].data)
  return (
    <div className={styles.header}>
      <h1>Video Show</h1>

      <SEO data={seoData} />
    </div>
  )
}

export default VideoShow;