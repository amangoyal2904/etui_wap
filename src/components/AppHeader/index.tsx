import NavDrawer from "components/NavDrawer";
import NavBar from "components/NavBar";
import Search from "components/Search";
import Link from "next/link";
import { FC, useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { fetchMenu } from "Slices/appHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "app/store";

const AppHeader: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  const dispatch = useDispatch();
  const store = useSelector((state: AppState) => {
    return state.appHeader;
  });

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

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
            <Link href="/">
              <a>
                <img
                  src="data:image/webp;base64,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"
                  width={200}
                  height={22}
                  id="hLogo"
                  alt="logo"
                  role="logo"
                />
              </a>
            </Link>
          </div>
          <div className={styles.search}>
            <span
              className={styles.searchIcon + " " + styles.commonSprite}
              onClick={() => setIsSearchOverlayOpen(true)}
            ></span>
          </div>
        </div>
        {store.isCta && (
          <div className={styles.ctas}>
            <span className={styles.cta1}>Super Saver Sale</span>
            <span className={styles.cta2}>Get App</span>
          </div>
        )}
        {store.isFetchSuccess && store.isNavBar && <NavBar />}
      </header>
      <NavDrawer isOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      {isSearchOverlayOpen && <Search setIsOpen={setIsSearchOverlayOpen} />}
    </>
  );
};

export default AppHeader;
