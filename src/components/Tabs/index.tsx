import React, { useEffect, useState } from 'react';
import styles from "./styles.module.scss";
import { TopicDataProps } from "types/topic";
import { useRouter } from 'next/router'



interface ListProps {
    tabsName?: string[],
    handleTabClick:any
}
const Index = (props: ListProps) => {
    const { tabsName, handleTabClick } = props;
    const [activeTab, setActiveTab] = useState('all');
    const router = useRouter()

    useEffect(() => {
        const { all } = router.query
        setActiveTab(all[2] ? all[2] : 'all');
    });

    const handleClick = (e) => {
        const tabName = e.target.getAttribute('data-name');
        if (activeTab != tabName) {
            setActiveTab(tabName);
            handleTabClick(tabName);
        }
    }

    return (
        <div className={styles.tabWidget}>
            <div className={styles.tabs} onClick={handleClick}>
                {tabsName && tabsName.map(tabName => (
                    <p className={`${styles.tTab} ${activeTab == `${tabName.toLowerCase()}` ? styles.active : ''}`} key={tabName} data-name={tabName.toLowerCase()} >{tabName}</p>
                ))}
            </div>
        </div>
    );
};


export default Index;