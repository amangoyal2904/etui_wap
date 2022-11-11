import { ET_WAP_URL } from "utils/common";
import styles from "./NotFound.module.scss";
import { FC, Fragment, useEffect } from "react";
import { grxEvent } from "utils/ga";
import DfpAds from "components/Ad/DfpAds";
interface PageProps {
  searchResult: object[];
  parameters: object;
}
declare global {
  interface Window {
    saveLogs: any;
  }
}
const dfpAdSlots = {
  dfp: {
    atf: {
      adSlot: "/7176/ET_MWeb/ET_Mweb_ETNow/ET_Mweb_ETNow_ATF",
      adSize: [
        [320, 50],
        [320, 100],
        [468, 60],
        [728, 90]
      ]
    },
    andbeyond: {
      adSlot: "/7176/ET_MWeb/ET_MWeb_ROS/ET_Mweb_ROS_Andbeyond_1x1",
      adSize: [[1, 1]]
    },
    fbn: {
      adSlot: "/7176/ET_MWeb/ET_Mweb_ETNow/ET_Mweb_ETNow_FBN",
      adSize: [
        [320, 50],
        [468, 60],
        [728, 90]
      ]
    }
  }
};
const NotFound: FC<PageProps> = (props) => {
  useEffect(() => {
    window.objVc = dfpAdSlots;
    const handleGaLoaded = () => {
      window.ga("send", "event", " Error Code 404", "", window.location.href, window.customDimension);
    };
    const handleoObjIntsLoaded = () => {
      try {
        const obj = {
          type: "NotFoundError",
          data: props.searchResult,
          url: window.location.href
        };
        window.saveLogs(obj);
      } catch (e) {
        console.log("Can't send log to server in Notfound component", e);
      }
    };

    document.addEventListener("gaLoaded", handleGaLoaded);
    document.addEventListener("objIntsLoaded", handleoObjIntsLoaded);

    return () => {
      document.removeEventListener("gaLoaded", handleGaLoaded);
      document.removeEventListener("objIntsLoaded", handleoObjIntsLoaded);
    };
  }, [props]);

  return (
    <>
      <div className={`${styles.hdAdContainer} adContainer expando_1`}>
        <DfpAds adInfo={{ key: "atf" }} identifier="NotFoundPage" />
      </div>
      <div className={styles.notFound}>
        <h2 className={styles.title}>Page not found</h2>
        <p>
          The page you have requested might no longer exist, has had its name changed, or is temporarily unavailable.
        </p>
        <br />
        <p>
          Go to <a href={ET_WAP_URL}>EconomicTimes.com</a> Home Page
        </p>
      </div>
      <div className={`${styles.footerAd} adContainer`}>
        <DfpAds adInfo={{ key: "fbn" }} identifier="floatingAd" />
      </div>
    </>
  );
};

export default NotFound;
