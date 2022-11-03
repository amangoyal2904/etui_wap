import Link from "next/link";
import { FC } from "react";
import styles from "./styles.module.scss";
import { MenuProps, MenuSecProps } from "components/AppHeader/types";
import { useSelector } from "react-redux";
import { AppState } from "app/store";
import { grxEvent } from "utils/ga";

const NavBar: FC = () => {
  const store = useSelector((state: AppState) => state.appHeader);
  const menuData: MenuProps = store.data.searchResult[0];
  const fireGAEvent = (e) => {
    const { section } = e.currentTarget.dataset;
    grxEvent(
      "event",
      {
        event_category: "PWA Back Nav",
        event_action: section + " - Top",
        event_label: window.location.href
      },
      1
    );
  };

  return menuData ? (
    <nav className={styles.navBar}>
      <Link href={menuData?.url}>
        <a className={styles.active} onClick={(e) => fireGAEvent}>
          {menuData?.title}
        </a>
      </Link>
      {menuData?.sec?.map((item: MenuSecProps, i) =>
        item.shorturl || item.url ? (
          <Link href={item.shorturl ? item.shorturl : item.url} key={i}>
            <a data-name={item.title} onClick={(e) => fireGAEvent}>
              {item.title}
            </a>
          </Link>
        ) : (
          <a key={i}>{item.title}</a>
        )
      )}
    </nav>
  ) : null;
};

export default NavBar;
