import React, { useEffect, useState } from "react";

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
    <>
      <div className="tabs">
        {tabsName &&
          tabsName.map((tabName) => (
            <p
              className={`tTab ${activeTab.toLowerCase() == `${tabName.toLowerCase()}` ? "active" : ""}`}
              key={tabName}
              data-name={tabName.toLowerCase()}
              data-testid="tabs"
              onClick={handleClick}
            >
              {tabName}
            </p>
          ))}
      </div>
      <style jsx>
        {`
          .tabs {
            display: flex;
            padding: 5px 15px 0;
            border: 1px solid #909090;
            border-left: 0;
            border-right: 0;
          }
          .tTab {
            padding: 5px;
            color: #909090;
            margin-right: 5px;
          }
          .active {
            border-bottom: 2px solid black;
            color: black;
            font-weight: bold;
          }
        `}
      </style>
    </>
  );
};

export default Index;
