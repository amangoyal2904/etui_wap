import Link from "next/link";
import { Fragment, useState } from "react";
import { TopicDataProps } from "types/topic";
import LazyLoadImg from "../LazyLoad";
import Tabs from "../Tabs";
import Loading from "components/Loading";
import DfpAds from "components/Ad/DfpAds";
import { grxEvent } from "utils/ga";
import { removeBackSlash, updateDimension } from "utils";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
interface ListProps {
  type: string;
  query: string;
  data: TopicDataProps;
  showSynopsis: boolean;
  parameters: any;
  seo: any;
}
const tabsName = ["All", "News", "Videos"];
let dfp_position = 0;
let curpg = 1;

const NewsCard = (props: ListProps) => {
  const { data, showSynopsis, query, type, parameters, seo }: ListProps = props;
  const [isFetching, setIsFetching] = useState(false);
  const [tab, setTab] = useState(type || "all");
  const [loadingMoreTopic, setLoadingMoreTopic] = useState<boolean>(false);
  const [cardsData, setCardsData] = useState(data.data);

  const api = APIS_CONFIG.FEED;

  const loadMore = async () => {
    setLoadingMoreTopic(true);
    curpg += 1;

    const res = await Service.get({
      api,
      params: {
        type: "topic",
        query: query,
        tab: `${tab ? tab : ""}`,
        platform: "wap",
        feedtype: "etjson",
        curpg: curpg
      }
    });
    setLoadingMoreTopic(false);
    const resData = res.data || {};
    const topicObj = resData.searchResult && resData.searchResult.find((item) => item.name == "topic");
    const latestNewsData = topicObj ? topicObj.data : [];
    const topicItems = [...cardsData, ...latestNewsData];
    setCardsData(topicItems);
  };

  const handleTabClick = async (tabName: string) => {
    setTab(tabName);
    curpg = 1; // reset on tab change
    const tab = tabName != "all" ? `/${tabName}` : "";
    window.history.pushState({}, "", `/topic/${query}${tab}`);
    updateDimension({ pageName: parameters?.type, msid: parameters.msid, subsecnames: seo.subsecnames });
    const Query = query.replace(/-/g, "%20");
    setIsFetching(true);
    const res = await Service.get({
      api,
      params: { type: "topic", query: Query, tab: `${tabName ? tabName : ""}`, platform: "wap", feedtype: "etjson" }
    });
    setIsFetching(false);
    const topicData = res.data || {};
    const topicItems = topicData.searchResult && topicData.searchResult.find((item) => item.name == "topic");
    setCardsData(topicItems.data);
  };

  const renderList = (item, index) => {
    return item.name === "dfp" && item.type.indexOf("mrec") != -1
      ? ((dfp_position += 1),
        (
          <div className={`mrecContainer adContainer`} key={`mrec_${index}`}>
            <DfpAds adInfo={{ key: `${item.type}`, index: tab }} identifier={`${dfp_position + item.type}`} />
          </div>
        ))
      : item.title && (
          <>
            <li key={index} className="borderedContent">
              <Fragment>
                <a
                  className="newsContent"
                  href={item?.url}
                  onClick={() => {
                    grxEvent(
                      "event",
                      {
                        event_category: "PWA Topic click",
                        event_action: `Top News`,
                        event_label: item.url
                      },
                      1
                    );
                  }}
                >
                  <span className="title" data-testid="newsCardTitle">
                    {item.title}
                  </span>
                  {item.img && (
                    <span className="imgWrapper">
                      <LazyLoadImg
                        large={false}
                        img={item.img}
                        alt={item.title}
                        width={100}
                        height={75}
                        style={{ marginRight: "20px", marginTop: "5px" }}
                        isNotLazy={index < 4 ? true : false}
                      />
                      {item.type != "articleshow" && <span className={`icon_${item.type}`} />}
                    </span>
                  )}
                </a>
                {showSynopsis ? (
                  <p className="synopsis">
                    {removeBackSlash(item.synopsis).length > 140
                      ? `${removeBackSlash(item.synopsis).slice(0, 140)}...`
                      : removeBackSlash(item.synopsis)}
                  </p>
                ) : (
                  ""
                )}
                {item.date && <p className="timeago">{item.date}</p>}
              </Fragment>
            </li>
            <style jsx>{`
              .newsContent .title {
                font-size: 20px;
                color: #000;
                font-family: "Faustina", "sans";
                padding: 0 20px;
                line-height: 1.17;
                margin: 0px;
                font-weight: bold;
              }
              .borderedContent {
                padding: 10px 0 0 0;
              }
              .borderedContent:not(:last-child):after,
              .borderedContent:only-child:after {
                content: "";
                display: block;
                margin: 0 20px;
                border-bottom: 1px solid #e4e4e4;
                padding: 10px 0;
              }
              .newsContent {
                display: flex;
              }
              .imgWrapper {
                position: relative;
              }
              .icon_videoshow {
                background-position: -96px -235px !important;
                position: absolute;
                top: 50px;
                left: -5px;
                background: url("https://img.etimg.com/photo/msid-87756482,quality-100.cms");
                background-size: 185px;
                width: 25px;
                height: 25px;
                vertical-align: middle;
              }
               {
                /* li p {
                margin: 0px;
                padding: 0px;
              } */
              }
              .synopsis {
                font-family: "Faustina", "sans";
                font-size: 16px;
                color: #1b1b1b;
                padding: 0 20px;
                margin: 10px 0 0 0;
                line-height: 1.3;
                width: 100%;
              }
              .timeago {
                font-family: "Montserrat", "Verdana";
                font-size: 12px;
                color: #808080;
                padding: 10px 20px 0 20px;
                margin: 0px;
              }
            `}</style>
          </>
        );
  };
  return (
    <Fragment>
      <div className="listing" data-testid="NewsCard">
        <ul>
          {(cardsData?.length > 4 ? cardsData : data.data).map((item, index) =>
            index < 4 ? renderList(item, index) : ""
          )}

          <Tabs tabsName={tabsName} handleTabClick={handleTabClick} urlActiveTab={type} />
          <div className="tabList">
            {isFetching && !loadingMoreTopic ? (
              <div className="loading">
                <Loading />
              </div>
            ) : cardsData?.length > 0 ? (
              (cardsData?.slice(4)?.length > 0 ? cardsData?.slice(4) : cardsData)?.map((item, index) =>
                renderList(item, index)
              )
            ) : (
              <p className="noData">No data Found</p>
            )}
          </div>
          {cardsData?.slice(4)?.length > 4 && (
            <div className="loadMore" onClick={loadMore}>
              {loadingMoreTopic ? "Loading..." : "Load More"}
            </div>
          )}
        </ul>
      </div>
      <style jsx>
        {`
          .tabList {
            min-height: 50px;
          }
          .loadMore {
            text-align: center;
            font-family: "Montserrat", "Verdana";
            font-size: 15px;
            padding: 10px 0;
            background-color: #f5f5f5;
            color: #666;
            cursor: pointer;
            border: 1px solid #f0f0f0;
            width: 90%;
            margin: 10px auto;
          }
          .noData {
            padding: 15px;
            color: #909090;
          }
          .loading {
            text-align: center;
          }
        `}
      </style>
    </Fragment>
  );
};

export default NewsCard;
