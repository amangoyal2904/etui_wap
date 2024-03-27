import NavDrawer from "components/NavDrawer";
import NavBar from "components/NavBar";
import Search from "components/Search";
import { FC, useState, useEffect } from "react";
import { fetchMenu } from "Slices/appHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "app/store";
import { ET_WAP_URL } from "utils/common";
import { grxEvent } from "utils/ga";
import LoginWidget from "components/LoginSdk";

const NO_CTAS = [
  "videoshow",
  "videoshownew",
  "notfound",
  "topic",
  "quickreads",
  "shortvideos",
  "stockreportsplus",
  "stockreportscategory"
];
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
      <header className="header">
        <div className="top">
          <div className="hamber">
            <span className="hamberIcon commonSprite" onClick={() => setIsDrawerOpen(true)}></span>
          </div>
          <div className="logo">
            <a href={ET_WAP_URL}>
              <img width={277} height={30} src="https://img.etimg.com/photo/msid-74651805,quality-100.cms" alt="logo" />
            </a>
          </div>
          <div className="search">
            <span className="searchIcon commonSprite" onClick={() => setIsSearchOverlayOpen(true)}></span>
          </div>
        </div>
        {!NO_CTAS.includes(page) && (
          <div className="ctas">
            <span className="cta1" onClick={paymentButtonListener}>
              Super Saver Sale
            </span>
            <span className="cta2" onClick={clickAppDownload}>
              Get App
            </span>
          </div>
        )}
        {appHeader.isFetchSuccess && !NO_NAVBAR.includes(page) && <NavBar />}
      </header>
      <LoginWidget />
      <NavDrawer isOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      {isSearchOverlayOpen && <Search setIsOpen={setIsSearchOverlayOpen} />}
      <style jsx>{`
        .header {
          background: #f9f9f9;
          box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.15);
          font-family: "Montserrat", "Verdana";
          max-width: 1024px;
          margin: 0 auto;
        }
        .header .top {
          display: flex;
          align-items: center;
          padding: 15px 0;
          height: 56px;
          justify-content: space-between;
        }

        .hamber {
          text-align: center;
        }
        .hamber .hamberIcon {
          width: 32px;
          margin-left: 15px;
          height: 28px;
          background-position: -145px -57px;
          display: block;
          transform: scale(0.6);
        }
        .search {
          text-align: center;
        }
        .search .searchIcon {
          width: 36px;
          margin-right: 15px;
          height: 36px;
          background-position: -190px -50px;
          display: block;
          visibility: visible;
          transform: scale(0.6);
        }

        .ctas {
          text-align: center;
          font-family: "Montserrat", "Verdana";
          display: flex;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          padding-bottom: 12px;
          height: 40px;
        }
        .ctas span {
          border-radius: 3px;
          border: solid 1px #000000;
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
          background-color: #ffffff;
          padding: 6px 29px;
        }

        .cta1 {
          border: solid 1px #ed193b;
          color: #ed193b;
          margin-right: 10px;
        }
        .logo {
          text-align: center;
        }
        img {
          width: 80%;
          height: auto;
          max-width: 350px;
        }
      `}</style>
    </>
  );
};

export default AppHeader;
