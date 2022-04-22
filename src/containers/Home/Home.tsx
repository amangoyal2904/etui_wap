import { FC } from "react";
import Link from "next/link";
import styles from "./Home.module.scss";
import DfpAds from "components/Ad/DfpAds";
import Colombia from "components/Ad/Colombia";
import SampleListing from "components/Listing";

const Home = (props) => {
  return (
    <div className={styles.header}>
      <div className={styles.root} role="heading">
        Home
      </div>
      <div className={`${styles.hdAdContainer} adContainer`}>
        <DfpAds adInfo={{ key: "atf" }} />
      </div>
      <div className={`adContainer`}>
        <Colombia key={`li_${1}`} id="208159" index={1} />
      </div>
      <div className={`adContainer`}>
        <Colombia key={`li_${2}`} id="208159" index={2} />
      </div>
      <div className={`${styles.mrecContainer} adContainer`}>
        <DfpAds adInfo={{ key: "mrec" }} />
      </div>
      <div className={`${styles.mrecContainer} adContainer`}>
        <DfpAds adInfo={{ key: "mrec1" }} />
      </div>
      <div className={`${styles.mrecContainer} adContainer`}>
        <DfpAds adInfo={{ key: "mrec2" }} />
      </div>
      <div className={`${styles.mrecContainer} adContainer`}>
        <DfpAds adInfo={{ key: "mrec3" }} />
      </div>
      <div>
        <Link href="/news/economy/indicators/goodbye-easy-money-as-hawkish-central-banks-speed-up-rate-hikes/articleshow/89379056.cms">
          <a>Go to Articleshow</a>
        </Link>
        <p data-ga-impression={`Crypto Corner#Impression 1#url`}>
          <button data-ga-onclick="ET_Sale_PWA#ONClick#url">Click me for GA Events</button>
        </p>
      </div>
      <Link href="/markets/stocks/news/govt-defers-lic-ipo-amid-volatile-market-situation-can-launch-without-seeking-fresh-sebi-approval-till-may-12/videoshow/90200064.cms">
        <a>VideoShow</a>
      </Link>
      <SampleListing />
    </div>
  );
};

export default Home;
