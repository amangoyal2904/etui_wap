import React, { useEffect, useState } from 'react';
import styles from "./styles.module.scss";
import { TopicDataProps } from "types/topic";
import { useRouter } from 'next/router'



interface ListProps {
    tabsName?: string[]
    handleTabClick: Function;
}
const index = (props: ListProps) => {
    const { tabsName, handleTabClick } = props;
    const [activeTab, setactiveTab] = useState('all');
    const [loadingMoretopic, setLoadingMoretopic] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const { all } = router.query
        setactiveTab(all[2] ? all[2] : activeTab);
    });

    const handleClick = (e) => {
        let tabName = e.target.getAttribute('data-name');
        if (activeTab != tabName) {
            setactiveTab(tabName);
            handleTabClick(tabName);
        }
    }

    return (
        <div className={styles.tabWidget}>
            <div className={styles.tabs} onClick={handleClick}>
                {tabsName && tabsName.map(tabName => (
                    <p className={`${styles.tTab} ${activeTab == `${tabName.toLowerCase()}` ? styles.active : ''}`} data-name={tabName.toLowerCase()} >{tabName}</p>
                ))}
            </div>
        </div>
    );
};


export default index;