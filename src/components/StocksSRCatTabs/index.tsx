import styles from "./styles.module.scss";
import { useState } from "react";
import Link from "next/link";
import { grxEvent } from "utils/ga";

interface StockSRCatTabsProps {
  data: {
    name: string;
    activeCategory: string;
    apiType?: string;
    array: any;
  }[];
  srTabClick?: any;
  tabsData?: any[];
  srTabsClick: any;
}

export default function StockSrCatTabs({ data, srTabsClick }: StockSRCatTabsProps) {
  const tabsData = Array.isArray(data) && data.length > 0 ? data[0].array : [];
  const [activeCategory, setActiveCategory] = useState(data[0].activeCategory);

  const srTabsHandleClick = (id: any, name: string) => {
    grxEvent(
      "event",
      {
        event_category: `SR+ Top Header Tab Change`,
        event_action: "Tab Click",
        event_label: name
      },
      1
    );
    setActiveCategory(name);
    srTabsClick(id, name);
  };
  return (
    <>
      <div className={styles.tabsWraper}>
        <ul>
          <li>
            <Link href={`/stockreports_benefits.cms`}>
              <a>Overview</a>
            </Link>
          </li>
          {Array.isArray(tabsData) &&
            tabsData.map((item: any, i: any) => {
              return (
                <li
                  key={i}
                  className={`${activeCategory === item.name ? styles.active : ""}`}
                  onClick={() => srTabsHandleClick(item.id, item.name)}
                >
                  {item.name}
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
