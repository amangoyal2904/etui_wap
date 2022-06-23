import React from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

import { MenuProps } from "components/AppHeader/types";
import { FC, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "app/store";
import Login from "components/Login";
import { ET_WAP_URL } from "utils/common";
interface DrawerProps {
  setIsDrawerOpen: (s: boolean) => void;
  isOpen: boolean;
}

const NavDrawer: FC<DrawerProps> = ({ setIsDrawerOpen, isOpen }) => {
  const [isSiblingsOpen, setIsSiblingsOpen] = useState({});
  const [isSubmenuOpen, setIsSubmenuOpen] = useState({});
  const ref = useRef<HTMLDivElement>();
  const store = useSelector((state: AppState) => state.appHeader);
  const menuData: MenuProps = store.data.searchResult[0];

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      //clean up
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [setIsDrawerOpen]);

  const handleClick = (e) => {
    if (e.target.tagName.toLowerCase() === "a") {
      setIsDrawerOpen(false);
    }
  };

  const showMore = (i: string) => {
    setIsSiblingsOpen((prev) => {
      return { ...prev, [i]: true };
    });
  };

  const showSubmenu = (i: string) => {
    setIsSubmenuOpen((prev) => {
      return { ...prev, [i]: !prev[i] };
    });
  };

  const getMenu = (data: MenuProps, level: number, index: number | string) => {
    const r = data.sec.map((item, i) => {
      return (
        <React.Fragment key={level + "_" + i}>
          <li className={level === 1 && i > 3 && !isSiblingsOpen[level + "_" + index] ? styles.hidden : ""}>
            {makeLink(item, level, index, i)}
            {level === 1 && item.sec && (
              <span
                className={
                  !isSubmenuOpen[level + "_" + index + "_" + i]
                    ? styles.rDown + " " + styles.commonSprite
                    : styles.rUp + " " + styles.commonSprite
                }
                onClick={() => showSubmenu(level + "_" + index + "_" + i)}
              ></span>
            )}
            {item.sec && getMenu(item, level + 1, index + "_" + i)}
          </li>
          {level === 1 && i === 4 && !isSiblingsOpen[level + "_" + index] && (
            <li data-more={item.title} onClick={() => showMore(level + "_" + index)}>
              VIEW MORE FROM {data.title} +
            </li>
          )}
          {level === 0 && <li className={styles.oneDotBdr}></li>}
        </React.Fragment>
      );
    });

    return level !== 0 ? (
      <ul className={level === 2 && !isSubmenuOpen[level - 1 + "_" + index] ? styles.hidden : styles.submenu}>{r}</ul>
    ) : (
      r
    );
  };

  const makeLink = (data: MenuProps, level: number, iOuter: number | string, iInner: number | string) => {
    let linkURL = data.shorturl || data.url;
    if (!linkURL) {
      return (
        <>
          {data.title} {level === 0 && <span className={`${styles.rArr} ${styles.commonSprite}`}></span>}
        </>
      );
    }
    linkURL = !linkURL.includes("http") ? ET_WAP_URL + linkURL : linkURL;
    return (
      <Link href={linkURL}>
        <a className={isSubmenuOpen[level + "_" + iOuter + "_" + iInner] ? styles.bold : ""}>
          {data.title} {level === 0 && <span className={`${styles.rArr} ${styles.commonSprite}`}></span>}
        </a>
      </Link>
    );
  };
  return menuData ? (
    <>
      <nav className={`${styles.drawer} ${isOpen ? styles.isOpen : ""}`} ref={ref}>
        <Login />
        {store.isFetchSuccess && isOpen && (
          <div className={styles.menuWrap}>
            <ul onClick={handleClick}>
              <li>
                <Link href={ET_WAP_URL}>
                  <a>{menuData.title}</a>
                </Link>
              </li>
              <li className={styles.oneDotBdr}></li>
              {getMenu(menuData, 0, 0)}
            </ul>
          </div>
        )}
      </nav>
    </>
  ) : null;
};

export default NavDrawer;
