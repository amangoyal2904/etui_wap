import { FC } from "react";
import { PageProps, TopicDataProps } from "types/topic";
import styles from "./Topic.module.scss";
import DfpAds from "components/Ad/DfpAds";
import NewsCard from "components/NewsCard";
import SEO from "components/SEO";

const Topic: FC<PageProps> = (props) => {
  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { cpd_wap = "0" } = version_control;
  const { query = "", tab = "" } = parameters || {};

  const TopicContainer = () => {
    return props?.searchResult?.map((item) => {
      const topicData = item as TopicDataProps;
      return props?.searchResult[0]?.data.length > 0 ? (
        <NewsCard data={topicData} key={item.name} showSynopsis={true} originaldate={true} query={query} type={tab} />
      ) : (
        <p className={styles.noData}>Sorry, there are no results for your search!</p>
      );
    });
  };

  return (
    <>
      <div className={styles.mainContent}>
        <div className={`${styles.hdAdContainer} adContainer expando_${cpd_wap}`}>
          <DfpAds adInfo={{ key: "atf" }} identifier={`topic`} />
        </div>
        <div className={styles.title}>
          Searched For <h1>{query && query.replace(/-/g, " ").toUpperCase()}</h1>{" "}
        </div>
        {TopicContainer()}
        <SEO {...seoData} />
        <div className={`${styles.footerAd} adContainer`}>
          <DfpAds adInfo={{ key: "fbn" }} identifier={`topicFbn`} />
        </div>
      </div>
    </>
  );
};

export default Topic;
