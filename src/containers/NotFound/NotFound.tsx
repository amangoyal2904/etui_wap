import { ET_WAP_URL } from "utils/common";
import styles from "./NotFound.module.scss";
import { FC, Fragment, useEffect } from "react";
import { grxEvent } from "utils/ga";
import DfpAds from "components/Ad/DfpAds";
interface PageProps {
  data: object;
}
declare global {
  interface Window {
    saveLogs: any;
  }
}
const NotFound: FC<PageProps> = (props) => {
  useEffect(() => {
    window.objVc = window.objVc || {};
    window.objVc = {
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

    typeof window !== "undefined" &&
      window.grxEvent &&
      grxEvent("event", { event_category: "Error Code 404", event_action: "", event_label: window.location.href }, 1);
  }, []);

  if (props && props.data && typeof window !== "undefined" && !sessionStorage.getItem("isNotFoundLog")) {
    sessionStorage.setItem("isNotFoundLog", "true");
    window.addEventListener("load", function () {
      try {
        const obj = {
          type: "NotFoundError",
          data: props.data,
          url: window.location.href
        };
        window.saveLogs(obj);
      } catch (e) {
        console.log("Can't send log to server in Notfound component", e);
      }
    });
  }

  return (
    <>
      {/* <Head title="Economic Times • Not Found" /> */}
      <div className={`${styles.hdAdContainer} adContainer expando_0`}>
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
