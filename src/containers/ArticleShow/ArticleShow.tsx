import Link from "next/link";
import styles from "./ArticleShow.module.scss";
import DfpAds from "components/Ad/DfpAds";
import SEO from "components/SEO";
import { FC } from "react";
interface PageProps {
  data: object;
}

const seoData = {
  lang: "en",
  title: "Title",
  url: "https://economictimes.com/xyz",
  actualURL: "",
  canonical: "",
  type: "article",
  description: "Page description",
  image: "https://img.etimg.com/thumb/msid-89883381,width-300,imgsize-48776,,resizemode-4,quality-100/nutella.jpg",
  inLanguage: "en",
  authors: [],
  agency: [],
  date: "27 Feb, 2022",
  updated: "27 Feb, 2022 09:40",
  story: "story excerpt goes here",
  remove_paywall_schema: 0,
  behindLogin: 0,
  hostid: 317,
  langInfo: [],
  ampURL: "",
  keywords: "",
  news_keywords: "",
  noindex: 1,
  noindexFollow: 0,
  expiry: "",
  sponsored: 0,
  maxImgPreview: 0,
  isPrime: 1,
  schemaType: "articleshow",
  subsecnames: {
    subsec1: 13352306,
    subsecname1: "Industry",
    subsec2: 13353990,
    subsecname2: "Transportation",
    subsec3: 13354027,
    subsecname3: "Airlines / Aviation"
  },
  seoschema: {},
  articleSection: "Airlines / Aviation" //fetchImmediateSubsec(seoData.subsecnames),
};

const ArticleShow: FC<PageProps> = (props) => {
  return (
    <div className={styles.header}>
      <div className={styles.articleshow}>ArticleShow</div>
      <p>{JSON.stringify(props)}</p>
      <div className={`${styles.hdAdContainer} adContainer`}>
        <DfpAds adInfo={{ key: "atf" }} />
      </div>
      <div>
        <Link href="/">
          <a>Back Home</a>
        </Link>
      </div>
      <SEO {...seoData} />
    </div>
  );
};

export default ArticleShow;
