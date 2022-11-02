import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { TopicDataProps } from "types/topic";
import LazyLoadImg from "../LazyLoad";
import { updateDimension } from "../../utils/helper";
import Tabs from "../Tabs";
import { AppState } from "app/store";
import { fetchMoreTopic, fetchCategories } from "../../Slices/topics";
import { useDispatch, useSelector } from "react-redux";
import Loading from "components/Loading";
import DfpAds from "components/Ad/DfpAds";
import { grxEvent } from "utils/ga";
import { removeBackSlash } from "utils";

interface ListProps {
  type: string;
  query: string;
  data: TopicDataProps;
  showSynopsis: boolean;
}
const tabsName = ["All", "News", "Videos"];
let dfp_position = 0;
let curpg = 1;

const NewsCard = (props: ListProps) => {
  const { data, showSynopsis, query, type }: ListProps = props;
  const { topic } = useSelector((state: AppState) => state);
  const { isFetching } = topic || {};
  const [tab, setTab] = useState("all");
  const [loadingMoreTopic, setLoadingMoreTopic] = useState<boolean>(false);
  const [cardsData, setCardsData] = useState(data.data);
  const dispatch = useDispatch();

  const loadMore = () => {
    setLoadingMoreTopic(true);
    curpg += 1;
    const reqData = {
      curpg: curpg
    };
    const params = {
      query: query,
      type: type
    };
    dispatch(fetchMoreTopic({ ...params, reqData, topicData: cardsData }));
  };

  useEffect(() => {
    if (topic?.data?.data?.length) {
      setCardsData(topic.data.data);
      setLoadingMoreTopic(false);
    }
  }, [topic?.data?.data]);

  const handleTabClick = (tabName: string) => {
    dispatch(fetchCategories(query, tabName));
    setTab(tabName);
    const tab = tabName != "all" ? `/${tabName}` : "";
    window.history.pushState({}, "", `/topic/${query}${tab}`);
    updateDimension();
  };

  const renderList = (item, index) => {
    return item.name === "dfp" && item.type.indexOf("mrec") != -1 ? (
      ((dfp_position += 1),
      (
        <div className={`${styles.mrecContainer} adContainer`} key={`mrec_${index}`}>
          <DfpAds adInfo={{ key: `${item.type}`, index: tab }} identifier={`${dfp_position + item.type}`} />
        </div>
      ))
    ) : (
      <li key={index} className={styles.borderedContent}>
        <Link href={item?.url}>
          <a
            onClick={() =>
              grxEvent(
                "event",
                {
                  event_category: "PWA Topic click",
                  event_action: `Top News`,
                  event_label: item.url
                },
                1
              )
            }
          >
            <Fragment>
              <div className={styles.newsContent}>
                <h2 data-testid="newsCardTitle">{item.title}</h2>
                <div className={styles.imgWrapper}>
                  <LazyLoadImg
                    clsName={styles.cardImg}
                    large={false}
                    img={item.img}
                    alt={item.title}
                    width={135}
                    height={100}
                  />
                  {item.type != "articleshow" && <div className={styles[`icon_${item.type}`]} />}
                </div>
              </div>
              {showSynopsis ? (
                <p className={`${styles.synopsis}`}>
                  {removeBackSlash(item.synopsis).length > 140
                    ? `${removeBackSlash(item.synopsis).slice(0, 140)}...`
                    : removeBackSlash(item.synopsis)}
                </p>
              ) : (
                ""
              )}
              {item.date && <p className={styles.timeago}>{item.date}</p>}
            </Fragment>
          </a>
        </Link>
      </li>
    );
  };
  return (
    <Fragment>
      <div className={styles.listing} data-testid="NewsCard">
        <ul>
          {(cardsData?.length > 4 ? cardsData : data.data).map((item, index) =>
            index < 4 ? renderList(item, index) : ""
          )}

          <Tabs tabsName={tabsName} handleTabClick={handleTabClick} urlActiveTab={tab} />
          <div className={styles.tabList}>
            {isFetching && !loadingMoreTopic ? (
              <div className={styles.loading}>
                <Loading />
              </div>
            ) : cardsData?.length > 0 ? (
              (cardsData?.slice(4)?.length > 0 ? cardsData?.slice(4) : cardsData)?.map((item, index) =>
                renderList(item, index)
              )
            ) : (
              <p className={styles.noData}>No data Found</p>
            )}
          </div>
          {cardsData?.length > 4 && (
            <div className={styles.loadMore} onClick={loadMore}>
              {isFetching ? "Loading..." : "Load More"}
            </div>
          )}
        </ul>
      </div>
    </Fragment>
  );
};

export default NewsCard;
