import Link from "next/link";
import { FC } from "react";
import styles from "./styles.module.scss";
import { MenuProps, MenuSecProps } from "components/AppHeader/types";
import { useSelector } from "react-redux";
import { AppState } from "app/store";
import { grxEvent } from "utils/ga";

const NavBar: FC<{ page: string }> = ({ page }) => {
  const store = useSelector((state: AppState) => state.appHeader);
  const menuData: MenuProps = store.data.searchResult[0];
  const homeActiveClass = page !== "stockreportsplus" && page !== "stockreportscategory" ? true : false;

  const marketMSID = "1977021501";
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
  //console.log("__page_", page);
  return menuData ? (
    <nav className={styles.navBar}>
      <Link href={menuData?.url}>
        <a className={`${homeActiveClass && styles.active}`} onClick={(e) => fireGAEvent}>
          {menuData?.title}
        </a>
      </Link>
      {menuData?.sec?.map((item: MenuSecProps, i) =>
        item.shorturl || item.url ? (
          <Link href={item.shorturl ? item.shorturl : item.url} key={i}>
            <a
              data-name={item.title}
              className={`${
                (page === "stockreportsplus" || page === "stockreportscategory") && item.msid == 1977021501
                  ? styles.active
                  : ""
              }`}
              onClick={(e) => fireGAEvent}
            >
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
