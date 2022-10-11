import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { TopicDataProps } from "types/topic";
import LazyLoadImg from "../LazyLoad";
import { removeBackSlash } from '../../utils/helper';
import Tabs from '../Tabs'
import { AppState } from "app/store";
import { fetchMoreTopic, fetchCategories } from '../../Slices/topics';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import Loading from "components/Loading";
import DfpAds from "components/Ad/DfpAds";

interface ListProps {
    type: string;
    query: string;
    data: TopicDataProps;
    showSynopsis: boolean;
    originaldate: boolean;
}
const tabsName = ["All", "News", "Videos"];

const NewsCard = (props: ListProps) => {
    const { data, showSynopsis, query, type }: ListProps = props;
    const { topic } = useSelector((state: AppState) => state);
    const { isFetching } = topic || {};
    const [loadingMoreTopic, setLoadingMoreTopic] = useState<boolean>(false);
    const [curpg, setCurpg] = useState(1);
    const [cardsData, setCardsData] = useState(data.data);
    const router = useRouter()
    const dispatch = useDispatch();

    const loadMore = () => {
        setLoadingMoreTopic(true);
        setCurpg(curpg + 1);
        let reqData = {
            curpg: curpg
        }
        let params = {
            query: query,
            type: type
        }
        dispatch(fetchMoreTopic({ ...params, reqData, topicData: cardsData }));
    }

    useEffect(() => {
        if (topic?.data?.data?.length) {
            setCardsData(topic.data.data);
            setLoadingMoreTopic(false);
        }
    }, [topic?.data?.data]);

    const handleTabClick = (tabName: string) => {
        dispatch(fetchCategories(query, tabName));
        const tab = tabName != "all" ? tabName :""; 
        router.push(`/topic/${query}`, `/topic/${query}/${tab}`, { shallow: true });
    }

    const renderList = (item, index) => {
        return (
              (item.name === "dfp" && item.type.indexOf("mrec") != -1))?
                       // this.dfp_position += 1;
                        <div className={`${styles.mrecContainer} adContainer`} key={`mrec_${index}`}>
                          <DfpAds adInfo={{ key: `${item.type}` }}/>
                        </div>
            :
            <li key={index} className={styles.borderedContent}>
                <Link href={item?.url}>
                    <a>
                        <div>
                            <div className={styles.newsContent}>
                                <h2>{item.title}</h2>
                                <LazyLoadImg clsName={styles.cardImg} large={false} img={item.img} alt={item.title} width={135} height={100} />
                            </div>
                            {showSynopsis ?
                                <p className={`${styles.synopsis}`}>
                                    {removeBackSlash(item.synopsis).length > 140 ?
                                        `${removeBackSlash(item.synopsis).slice(0, 140)}...` :
                                        removeBackSlash(item.synopsis)}</p> : ''}
                            {item.date &&
                                <p className={styles.timeago}>{item.date}</p>}
                        </div>
                    </a>
                </Link>
            </li>
        
    }
    return (
        <Fragment>
            <div className={styles.listing}>
                <ul>
                    {(cardsData?.length > 4 ? cardsData : data.data).map((item, index) => (
                        index < 4 ? renderList(item, index) : ""
                    ))}

                    <Tabs tabsName={tabsName} handleTabClick={handleTabClick} />
                    <div className={styles.tabList}>
                        {(isFetching && !loadingMoreTopic)  ? <div className={styles.loading}> <Loading /> </div> :
                            cardsData.length > 0 ? (cardsData?.slice(4).length > 0 ? cardsData?.slice(4) : cardsData).map((item, index) => renderList(item, index)) :
                                <p className={styles.noData}>No data Found</p>
                        }
                    </div>
                    {
                        cardsData?.length > 4 && <div className={styles.loadMore} onClick={loadMore}>{isFetching ? 'Loading...' : 'Load More'}</div>
                    }
                </ul>
            </div>
        </Fragment>
    )
}

export default NewsCard;