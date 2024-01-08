import styles from "./styles.module.scss";
import { Fragment, useState } from "react";
import Link from "next/link";

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
                <Fragment key={i}>
                  <li
                    className={`${activeCategory === item.name ? styles.active : ""}`}
                    onClick={() => srTabsHandleClick(item.id, item.name)}
                  >
                    {item.name}
                  </li>
                </Fragment>
              );
            })}
        </ul>
      </div>
    </>
  );
}
