import Link from "next/link";
import { Fragment, useState, useRef, useEffect } from "react";
import styles from "./styles.module.scss";

interface StockSRSortFilterProps {
  data: any[];
  oncloseMenu: (value: boolean) => void;
  sortApplyHandler: (id: string, sort: string, displayName: string) => void;
  defaultActiveTabData: any;
}

export default function StockReportSortFilter({
  data,
  oncloseMenu,
  sortApplyHandler,
  defaultActiveTabData
}: StockSRSortFilterProps) {
  const [sortMenuSelected, setSortMenuSelected] = useState({ ...defaultActiveTabData });
  const [sortIconClass, setSortIconClass] = useState(defaultActiveTabData.sort);
  const [displayname, setDisplayname] = useState("");
  const modalRef = useRef(null);
  const sortIconChangeHandler = () => {
    const revertClass = sortIconClass === "desc" ? "asc" : "desc";
    setSortIconClass(revertClass);
    setSortMenuSelected((preData: any) => ({
      ...preData,
      sort: revertClass
    }));
  };

  const menuSortHandler = (id: string, name: string) => {
    setSortMenuSelected((preData: any) => ({
      ...preData,
      id: id,
      displayname: name
    }));
    // for filter section
    const revertClass = sortIconClass === "desc" ? "asc" : "desc";
    if (sortMenuSelected.id === id) {
      setSortIconClass(revertClass);
      setSortMenuSelected((preData: any) => ({
        ...preData,
        sort: revertClass
      }));
    }
  };
  const applyHandler = () => {
    //console.log(sortMenuSelected.id, "______", sortMenuSelected.sort, "______", sortMenuSelected.displayname);
    sortApplyHandler(sortMenuSelected.id, sortMenuSelected.sort, sortMenuSelected.displayname);
  };
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        oncloseMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className={styles.filterWrap}>
        <div className={styles.filterSection} ref={modalRef}>
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
                    <li key={item.id} onClick={() => menuSortHandler(item.id, item.displayName)}>
                      <span>{item.displayName}</span>
                      {sortMenuSelected.id === item.id && (
                        <span
                          className={`${styles.sortIcon} ${styles[sortIconClass]}`}
                          // onClick={sortIconChangeHandler}
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
