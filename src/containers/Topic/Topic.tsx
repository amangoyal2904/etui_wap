import { FC, useEffect } from "react";
import { PageProps, TopicDataProps } from "types/topic";
import styles from "./Topic.module.scss";
import DfpAds from "components/Ad/DfpAds";
import NewsCard from "components/NewsCard";
import SEO from "components/SEO";
import { prepSeoListData } from "utils";

const Topic: FC<PageProps> = (props) => {
  const { seo = {}, version_control, parameters } = props || {};
  const topicListData = (props.searchResult && props.searchResult.find((item) => item.name == "topic")).data || [];
  const seoListData = prepSeoListData([...topicListData]);
  const seoData = { ...seo, ...version_control?.seo, seoListData };
  const { cpd_wap = "0" } = version_control;
  let { query = "" } = parameters || {};
  const { tab = "" } = parameters || {};
  const searchQuery = query && query.replace(/-/g, " ").toUpperCase();
  if (typeof window != "undefined") {
    query = window.location.pathname.split("/")[2];
  }

  const TopicContainer = () => {
    return props?.searchResult?.map((item) => {
      const topicData = item as TopicDataProps;
      return props?.searchResult[0]?.data.length > 0 ? (
        <NewsCard data={topicData} key={item.name} showSynopsis={true} query={query} type={tab} />
      ) : (
        <p className={styles.noData} key="paragraph">
          Sorry, there are no results for your search!
        </p>
      );
    });
  };

  return (
    <>
      <div className={styles.mainContent} data-testid="topic">
        <div className={`${styles.hdAdContainer} adContainer expando_${cpd_wap}`}>
          <DfpAds adInfo={{ key: "atf" }} identifier={`atf_${searchQuery}`} />
        </div>
        <div className={styles.title}>
          Searched For <h1>{searchQuery}</h1>{" "}
        </div>
        {TopicContainer()}
        <SEO {...seoData} />
        <div className={`${styles.footerAd} adContainer`}>
          <DfpAds adInfo={{ key: "fbn" }} identifier={`fbn_${searchQuery}`} />
        </div>
      </div>
    </>
  );
};

export default Topic;
