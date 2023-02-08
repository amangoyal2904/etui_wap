import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface ListProps {
  tabsName?: string[];
  handleTabClick: any;
  urlActiveTab: string;
}
const Index = (props: ListProps) => {
  const { tabsName, handleTabClick, urlActiveTab } = props;
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setActiveTab(urlActiveTab);
  }, [urlActiveTab]);

  const handleClick = (e) => {
    const divId = `mrec1${activeTab}`;
    const index = window.adDivIds.indexOf(divId);
    if (index > -1) {
      window.adDivIds.splice(index, 1);
      if (
        typeof window.googletag != "undefined" &&
        window.googletag.apiReady &&
        window.adDivIdSlots &&
        window.adDivIdSlots[divId]
      ) {
        window.googletag.destroySlots([window.adDivIdSlots[divId]]);
      }
    }

    const tabName = e.target.getAttribute("data-name");
    if (activeTab != tabName) {
      setActiveTab(tabName);
      handleTabClick(tabName);
    }
  };

  return (
    <div className={styles.tabWidget}>
      <div className={styles.tabs}>
        {tabsName &&
          tabsName.map((tabName) => (
            <p
              className={`${styles.tTab} ${activeTab.toLowerCase() == `${tabName.toLowerCase()}` ? styles.active : ""}`}
              key={tabName}
              data-name={tabName.toLowerCase()}
              data-testid="tabs"
              onClick={handleClick}
            >
              {tabName}
            </p>
          ))}
      </div>
    </div>
  );
};

export default Index;
