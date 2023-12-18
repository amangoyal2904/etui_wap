import styles from "./styles.module.scss";
import { Fragment } from "react";
import Link from "next/link";

interface StockTabsProps {
  data: { name: string; apiType: any }[];
  activeMenu: string;
}

export default function StockSrTabs({ data, activeMenu }: StockTabsProps) {
  //console.log("activeMenu", activeMenu);
  return (
    <>
      <div className={styles.tabsWraper}>
        <ul>
          {data.map((item: any, i) => (
            <Fragment key={i}>
              <li className={`${activeMenu === item.apiType ? styles.active : ""}`}>
                <Link href={item.url}>
                  <a>{item.name}</a>
                </Link>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </>
  );
}
