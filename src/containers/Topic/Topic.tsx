import { FC, useEffect, useState } from "react";
import { PageProps, TopicDataProps } from "types/topic";
import DfpAds from "components/Ad/DfpAds";
import NewsCard from "components/NewsCard";
import SEO from "components/SEO";
import { prepSeoListData, updateDimension } from "utils";

const Topic: FC<PageProps> = (props) => {
  const [isPrimeUser, setIsPrimeUser] = useState(0);
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

  const objVc: any = version_control;

  const intsCallback = () => {
    window.objInts.afterPermissionCall(() => {
      window.objInts.permissions.indexOf("subscribed") > -1 && setIsPrimeUser(1);
    });
  };
  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      intsCallback();
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }
    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);

  useEffect(() => {
    updateDimension({ pageName: parameters?.type, msid: parameters.msid, subsecnames: seo.subsecnames });
  }, []);

  const TopicContainer = () => {
    return props?.searchResult?.map((item) => {
      const topicData = item as TopicDataProps;
      return props?.searchResult[0]?.data.length > 0 ? (
        <NewsCard
          data={topicData}
          key={item.name}
          showSynopsis={true}
          query={query}
          type={tab}
          parameters={parameters}
          seo={seo}
        />
      ) : (
        <>
          <p className="noData" key="paragraph">
            Sorry, there are no results for your search!
          </p>
          <style jsx>{`
            .noData {
              margin: 2em 0 4em 20px;
              font-size: 13px;
            }
          `}</style>
        </>
      );
    });
  };

  return (
    <>
      <div className="mainContent" data-testid="topic">
        {typeof objVc !== "undefined" && objVc.ticker_ad == 1 && !isPrimeUser && (
          <DfpAds adInfo={{ key: "mh", subsecnames: seo.subsecnames || {} }} identifier={query} />
        )}
        <div className={`hdAdContainer adContainer expando_${cpd_wap}`}>
          <DfpAds adInfo={{ key: "atf" }} identifier={`atf_${searchQuery}`} />
        </div>
        <div className="title">
          Searched For <h1>{searchQuery}</h1>{" "}
        </div>
        {TopicContainer()}
        <SEO {...seoData} />
        <div className={`footerAd adContainer`}>
          <DfpAds adInfo={{ key: "fbn" }} identifier={`fbn_${searchQuery}`} />
        </div>
      </div>
      <style jsx>
        {`
          .title {
            margin: 20px 0 0 20px;
            font-size: 16px;
          }
          .title h1 {
            font-size: 18px;
            display: inline-block;
            vertical-align: baseline;
            margin-left: 5px;
          }
        `}
      </style>
    </>
  );
};

export default Topic;
