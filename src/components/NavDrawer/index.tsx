import React from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

import { MenuProps } from "components/AppHeader/types";
import { FC, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
interface DrawerProps {
  setIsDrawerOpen: (s: boolean) => void;
  isOpen: boolean;
}

const NavDrawer: FC<DrawerProps> = ({ setIsDrawerOpen, isOpen }) => {
  const [isSiblingsOpen, setIsSiblingsOpen] = useState({});
  const [isSubmenuOpen, setIsSubmenuOpen] = useState({});
  const ref = useRef<HTMLDivElement>();

  const store = useSelector((state: any) => state.appHeader);
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
  }, []);

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
  const handleClick = (e) => {
    // e.preventDefault();
    setIsDrawerOpen(false);
  };

  const getMenu = (data: MenuProps, level: number, index: number | string) => {
    const r = data.sec.map((item, i) => {
      return (
        <React.Fragment key={level + "_" + i}>
          <li
            className={
              level === 1 && i > 3 && !isSiblingsOpen[level + "_" + index]
                ? styles.hidden
                : ""
            }
          >
            {makeLink(item, level, index, i)}
            {level === 1 && item.sec && (
              <span
                className={
                  !isSubmenuOpen[level + "_" + index + "_" + i]
                    ? styles.rDown
                    : styles.rUp
                }
                onClick={() => showSubmenu(level + "_" + index + "_" + i)}
              ></span>
            )}
            {item.sec && getMenu(item, level + 1, index + "_" + i)}
          </li>
          {level === 1 && i === 4 && !isSiblingsOpen[level + "_" + index] && (
            <li
              data-more={item.title}
              onClick={() => showMore(level + "_" + index)}
            >
              VIEW MORE FROM {data.title} +
            </li>
          )}
          {level === 0 && <li className={styles.oneDotBdr}></li>}
        </React.Fragment>
      );
    });

    return level !== 0 ? (
      <ul
        className={
          level === 2 && !isSubmenuOpen[level - 1 + "_" + index]
            ? styles.hidden
            : styles.submenu
        }
      >
        {r}
      </ul>
    ) : (
      r
    );
  };

  const makeLink = (
    data: MenuProps,
    level: number,
    iOuter: number | string,
    iInner: number | string
  ) => {
    if (!(data.shorturl || data.url)) {
      return (
        <>
          {data.title} {level === 0 && <span className={styles.rArr}></span>}
        </>
      );
    }

    return (
      <Link href={data.shorturl ? data.shorturl : data.url}>
        <a
          onClick={handleClick}
          className={
            isSubmenuOpen[level + "_" + iOuter + "_" + iInner]
              ? styles.bold
              : ""
          }
        >
          {data.title} {level === 0 && <span className={styles.rArr}></span>}
        </a>
      </Link>
    );
  };

  return menuData ? (
    <nav
      className={`${styles.drawer} ${isOpen ? styles.isOpen : ""}`}
      ref={ref}
    >
      <div className={styles.user}>
        <div className={styles.userName}>
          <div>Welcome</div>
          <div>User</div>
        </div>
        <div className={styles.signIn}>
          <div className={styles.userIcon}></div>
          <div>Sign In</div>
        </div>
      </div>
      <div className={styles.menuWrap}>
        <ul>
          <li>
            <Link href={menuData.url}>
              <a onClick={handleClick}>{menuData.title}</a>
            </Link>
          </li>
          <li className={styles.oneDotBdr}></li>
          {getMenu(menuData, 0, 0)}
        </ul>
      </div>
    </nav>
  ) : null;
};

export default NavDrawer;
