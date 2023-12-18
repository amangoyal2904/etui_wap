import Link from "next/link";
import { Fragment, useState } from "react";
import styles from "./styles.module.scss";

interface StockSRSortFilterProps {
  data: any[];
  oncloseMenu: (value: boolean) => void;
  sortApplyHandler: (id: string, sort: boolean, displayName: string) => void;
  defaultActiveTabData: any;
}

export default function StockReportSortFilter({
  data,
  oncloseMenu,
  sortApplyHandler,
  defaultActiveTabData
}: StockSRSortFilterProps) {
  const [sortMenuSelected, setSortMenuSelected] = useState(defaultActiveTabData);
  const [sortIcon, setSortIcon] = useState(true);
  const [displayname, setDisplayname] = useState("");
  const sortIconChangeHandler = () => {
    setSortIcon(!sortIcon);
  };
  console.log("________sortMenuSelected", sortMenuSelected);
  const menuSortHandler = (id: string, name: string) => {
    setSortIcon(false);
    setSortMenuSelected(id);
    setDisplayname(name);
  };
  const applyHandler = () => {
    console.log("appply filter value ___", sortMenuSelected, sortIcon, displayname);
    sortApplyHandler(sortMenuSelected, sortIcon, displayname);
  };
  return (
    <>
      <div className={styles.filterWrap}>
        <div className={styles.filterSection}>
          <div className={styles.topSec}>
            <span>Sort by</span>
            <div
              onClick={() => {
                oncloseMenu(false);
              }}
              className={styles.closeIcon}
            ></div>
          </div>
          <div className={styles.middleSec}>
            <ul className={styles.listItem}>
              {data &&
                data.length &&
                data.map((item: any) => {
                  return (
                    <li key={item.id}>
                      <span onClick={() => menuSortHandler(item.id, item.displayName)}>{item.displayName}</span>
                      {sortMenuSelected.id === item.id && (
                        <span
                          className={`${styles.sortIcon} ${sortIcon && styles.decending}`}
                          onClick={sortIconChangeHandler}
                        ></span>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className={styles.bottomSec}>
            <span className={styles.applyBtnCta} onClick={applyHandler}>
              Apply
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
