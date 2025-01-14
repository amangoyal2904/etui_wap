import { useState } from "react";
import styles from "./styles.module.scss";

interface StockSRFilterProps {
  data: { keyIndices: any; sectoralIndices: any; otherIndices: any; all: any };
  onclick: (value: boolean) => void;
  valuechange: (id: string, name: string, slectedTab: string) => void;
  selectTab: string;
  childMenuTabAcive?: string;
}

export default function StockReportFilter({
  data,
  onclick,
  valuechange,
  selectTab,
  childMenuTabAcive
}: StockSRFilterProps) {
  const activeFilterValue = sessionStorage.sr_filtervalue;
  const activeIndex =
    (!!activeFilterValue && data.keyIndices.nse.some((obj) => obj.indexId == activeFilterValue)) ||
    data.keyIndices.bse.some((obj) => obj.indexId == activeFilterValue)
      ? 0
      : data.sectoralIndices.nse.some((obj) => obj.indexId == activeFilterValue) ||
        data.sectoralIndices.bse.some((obj) => obj.indexId == activeFilterValue)
      ? 1
      : data.otherIndices.nse.some((obj) => obj.indexId == activeFilterValue) ||
        data.otherIndices.bse.some((obj) => obj.indexId == activeFilterValue)
      ? 2
      : 3;
  const [nseBseMenuSelect, setNseBseMenuSelect] = useState(selectTab);
  const [activeItem, setActiveItem] = useState<number | null>(activeIndex);
  const childTabMenuActive = childMenuTabAcive && childMenuTabAcive !== "" ? childMenuTabAcive : "";

  const nseBseMenu = (e: any) => {
    const selectedMenu = e.target.textContent.toLowerCase();
    setNseBseMenuSelect(selectedMenu);
  };
  const handleItemClick = (index: number) => {
    setActiveItem(index);
  };
  const clickFilterMenu = (name: any, indexid: any) => {
    const slectedTab = nseBseMenuSelect;
    valuechange(indexid, name, slectedTab);
  };
  return (
    <>
      <div className={styles.filterWrap}>
        <div className={styles.topSec}>
          <div className={styles.leftSec}>
            <span onClick={() => onclick(false)}>Filter</span>
          </div>
          <div className={styles.rightSec}>
            <ul className={styles.menuNseBse}>
              <li className={nseBseMenuSelect === "nse" ? styles.active : ""} onClick={nseBseMenu}>
                nse
              </li>
              <li className={nseBseMenuSelect === "bse" ? styles.active : ""} onClick={nseBseMenu}>
                bse
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.bottomSec}>
          <ul className={styles.filterMenu}>
            {data && data.keyIndices && (
              <li onClick={() => handleItemClick(0)} className={activeItem === 0 ? styles.active : ""}>
                <div className={styles.subMenu}>
                  <div className={styles.mainTxt}>{data.keyIndices.name}</div>
                  <ul className={`${styles.subMenuItem}`}>
                    {data.keyIndices.nse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() => clickFilterMenu(item.name, item.indexId)}
                          className={`${nseBseMenuSelect === "nse" ? styles.activelist : ""} ${
                            childTabMenuActive === item.indexId ? styles.selectedMenu : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                    {data.keyIndices.bse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() => clickFilterMenu(item.name, item.indexId)}
                          className={`${nseBseMenuSelect === "bse" ? styles.activelist : ""} ${
                            childTabMenuActive === item.indexId ? styles.selectedMenu : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            )}
            {data && data.sectoralIndices && (
              <li onClick={() => handleItemClick(1)} className={activeItem === 1 ? styles.active : ""}>
                <div className={styles.subMenu}>
                  <div className={styles.mainTxt}>{data.sectoralIndices.name}</div>
                  <ul className={styles.subMenuItem}>
                    {data.sectoralIndices.nse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() => clickFilterMenu(item.name, item.indexId)}
                          className={`${nseBseMenuSelect === "nse" ? styles.activelist : ""} ${
                            childTabMenuActive === item.indexId ? styles.selectedMenu : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                    {data.sectoralIndices.bse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() => clickFilterMenu(item.name, item.indexId)}
                          className={`${nseBseMenuSelect === "bse" ? styles.activelist : ""} ${
                            childTabMenuActive === item.indexId ? styles.selectedMenu : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            )}
            {data && data.otherIndices && (
              <li onClick={() => handleItemClick(2)} className={activeItem === 2 ? styles.active : ""}>
                <div className={styles.subMenu}>
                  <div className={styles.mainTxt}>{data.otherIndices.name}</div>
                  <ul className={styles.subMenuItem}>
                    {data.otherIndices.nse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() => clickFilterMenu(item.name, item.indexId)}
                          className={`${nseBseMenuSelect === "nse" ? styles.activelist : ""} ${
                            childTabMenuActive === item.indexId ? styles.selectedMenu : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                    {data.otherIndices.bse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() => clickFilterMenu(item.name, item.indexId)}
                          className={`${nseBseMenuSelect === "bse" ? styles.activelist : ""} ${
                            childTabMenuActive === item.indexId ? styles.selectedMenu : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            )}
            {data && data.all && (
              <li onClick={() => handleItemClick(3)} className={activeItem === 3 ? styles.active : ""}>
                <div className={styles.subMenu} onClick={() => clickFilterMenu(`${data.all.name} Stocks`, 0)}>
                  <div className={styles.mainTxt}>{data.all.name} Stocks</div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
