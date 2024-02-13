import styles from "./styles.module.scss";
import { grxEvent } from "utils/ga";

interface StockTabsProps {
  data: { name: string; apiType: any }[];
  activeMenu: string;
  srTabClick?: any;
}

export default function StockSrTabs({ data, activeMenu, srTabClick }: StockTabsProps) {
  //console.log("activeMenu", activeMenu);
  const handleClick = (apiType: any, name: string) => {
    grxEvent(
      "event",
      {
        event_category: `SR+ Top Header Tab Change`,
        event_action: "Tab Click",
        event_label: name
      },
      1
    );
    srTabClick(apiType);
  };
  return (
    <>
      <div className={styles.tabsWraper}>
        <ul>
          {data.map((item: any, i) => (
            <li
              key={i}
              className={`${activeMenu === item.apiType ? styles.active : ""}`}
              onClick={() => handleClick(item.apiType, item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
