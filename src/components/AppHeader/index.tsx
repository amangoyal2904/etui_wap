import NavDrawer from "components/NavDrawer";
import NavBar from "components/NavBar";
import Search from "components/Search";
import { FC, useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { fetchMenu } from "Slices/appHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "app/store";
import { ET_WAP_URL } from "utils/common";
import { grxEvent } from "utils/ga";

const NO_CTAS = ["videoshow", "videoshownew", "notfound", "topic", "quickreads", "shortvideos"];
const NO_NAVBAR = [
  "videoshow",
  "videoshownew",
  "notfound",
  "topic",
  "quickreads",
  "shortvideos",
  "stockreportsplus",
  "stockreportscategory"
];

const AppHeader: FC<{ page: string }> = ({ page }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  const dispatch = useDispatch();
  const store = useSelector((state: AppState) => state);
  const { appHeader } = store;
  let requestIdleCallbackId = 0;

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallbackId = window.requestIdleCallback(
        () => {
          dispatch(fetchMenu());
        },
        { timeout: 2000 }
      );
    } else {
      dispatch(fetchMenu());
    }
    return () => {
      if ("requestIdleCallback" in window) {
        window.cancelIdleCallback(requestIdleCallbackId);
      }
    };
  }, [dispatch]);

  const clickAppDownload = () => {
    grxEvent(
      "event",
      {
        event_category: "App Download",
        event_action: "Header App Download",
        event_label: "click"
      },
      1
    );
  };

  const paymentButtonListener = () => {
    grxEvent(
      "event",
      {
        event_category: "Subscription Flow",
        event_action: "SYFT",
        event_label: "ATF - " + location.href
      },
      1
    );
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.top}>
          <div className={styles.hamber}>
            <span
              className={styles.hamberIcon + " " + styles.commonSprite}
              onClick={() => setIsDrawerOpen(true)}
            ></span>
          </div>
          <div className={styles.logo}>
            <a href={ET_WAP_URL}>
              <img width={277} height={30} src="https://img.etimg.com/photo/msid-74651805,quality-100.cms" alt="logo" />
            </a>
          </div>
          <div className={styles.search}>
            <span
              className={styles.searchIcon + " " + styles.commonSprite}
              onClick={() => setIsSearchOverlayOpen(true)}
            ></span>
          </div>
        </div>
        {!NO_CTAS.includes(page) && (
          <div className={styles.ctas}>
            <span className={styles.cta1} onClick={paymentButtonListener}>
              Super Saver Sale
            </span>
            <span className={styles.cta2} onClick={clickAppDownload}>
              Get App
            </span>
          </div>
        )}
        {appHeader.isFetchSuccess && !NO_NAVBAR.includes(page) && <NavBar />}
      </header>
      <NavDrawer isOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      {isSearchOverlayOpen && <Search setIsOpen={setIsSearchOverlayOpen} />}
    </>
  );
};

export default AppHeader;
