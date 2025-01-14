import { Fragment } from "react";
import styles from "./styles.module.scss";
import LazyLoadImg from "../LazyLoad";
import Link from "next/link";
import { grxEvent } from "utils/ga";

interface PrimeSecInfoProps {
  isPrimeUser?: number;
  isLogin?: number;
  userName?: string;
  goToPlanPage?: any;
}

export default function PrimeSecInfoSec({ isPrimeUser, isLogin, userName, goToPlanPage }: PrimeSecInfoProps) {
  const planPageHandler = (cta: string) => {
    const params = {
      cta,
      item_name: "stock_report_plus_stock_report_detail",
      item_category2: "stock_report_plus_stock_report_detail",
      item_id: "stock_report_plus_stock_report_detail_benefits",
      widget: "paywall_blocker_detail_benefits_cta",
      item_category3: "paywall_blocker_other_benefits_cta"
    };
    grxEvent(
      "event",
      {
        event_category: "Subscription Flow",
        event_action: `Subscribe Now`,
        event_label: `Stock Report  - View ETPrime Plans`
      },
      1
    );
    goToPlanPage(params);
  };
  return (
    <>
      <section className={`${styles.etPrimeSec} topSec3`}>
        <div className={styles.stockWrapper}>
          <div className={styles.ctaSec}>
            <h4 className={styles.ctaHead}>
              Get these Reports worth
              <strong>₹1,499*</strong> with
              <span className={styles.redTxt}>ETPrime</span>
              <strong className={styles.moreBold}> at no extra cost</strong>
            </h4>
            <div className={styles.btnSec}>
              <button className={styles.etBtnPrime} onClick={() => planPageHandler("View ETPrime Plans")}>
                View ETPrime Plans
              </button>
              <p className={styles.conditionText}>
                *As per competitive benchmarking of annual price.
                <Link href="/terms-conditions">
                  <a target="_blank">T&amp;C apply</a>
                </Link>
              </p>
            </div>
          </div>
          <div className={styles.f_list}>
            <h3 className={styles.normal}>
              <span className={styles.prel}>
                What more you get with
                <span className={styles.ePrime}></span>
                <small>?</small>
              </span>
            </h3>
            <ul>
              <li>
                <LazyLoadImg
                  large={false}
                  img={`https://img.etimg.com/photo/msid-74493815,quality-100/et.jpg`}
                  alt="logo"
                  width={50}
                  height={50}
                />
                <div className={styles.fl_i_title}>
                  <p>
                    <strong></strong>
                    <strong></strong>
                    <strong>Exclusive Economic Times Stories, Editorials &amp; Expert opinion</strong> across 20+
                    sectors
                  </p>
                </div>
              </li>
              <li>
                <LazyLoadImg
                  large={false}
                  img={`https://img.etimg.com/photo/msid-74493814,quality-100/et.jpg`}
                  alt="logo"
                  width={50}
                  height={50}
                />
                <div className={styles.fl_i_title}>
                  <p>
                    <strong></strong>
                    <strong>Stock analysis. Market Research. Industry Trends</strong> on 4000+ Stocks<strong></strong>
                    <strong></strong>
                  </p>
                </div>
              </li>
              <li>
                <LazyLoadImg
                  large={false}
                  img={`https://img.etimg.com/photo/msid-74493812,quality-100/et.jpg`}
                  alt="logo"
                  width={50}
                  height={50}
                />
                <div className={styles.fl_i_title}>
                  Clean experience with
                  <br />
                  <strong>Minimal Ads</strong>
                </div>
              </li>
              <li>
                <LazyLoadImg
                  large={false}
                  img={`https://img.etimg.com/photo/msid-74493806,quality-100/et.jpg`}
                  alt="logo"
                  width={50}
                  height={50}
                />
                <div className={styles.fl_i_title}>
                  <strong>Comment &amp; Engage</strong> with ET Prime community
                </div>
              </li>
              <li>
                <LazyLoadImg
                  large={false}
                  img={`https://img.etimg.com/photo/msid-74493810,quality-100/et.jpg`}
                  alt="logo"
                  width={50}
                  height={50}
                />
                <div className={styles.fl_i_title}>
                  Exclusive invites to <strong>Virtual Events with Industry Leaders</strong>
                </div>
              </li>
              <li>
                <LazyLoadImg
                  large={false}
                  img={`https://img.etimg.com/photo/msid-74493809,quality-100/et.jpg`}
                  alt="logo"
                  width={50}
                  height={50}
                />
                <div className={styles.fl_i_title}>
                  A trusted team of <strong>Journalists &amp; Analysts </strong>who can best filter signal from noise
                  <br />
                </div>
              </li>
              <li>
                <LazyLoadImg
                  large={false}
                  img={`https://img.etimg.com/photo/msid-99030928,quality-100/et.jpg`}
                  alt="logo"
                  width={50}
                  height={50}
                />
                <div className={styles.fl_i_title}>
                  <p>
                    &ZeroWidthSpace;Get <strong>1 Year Complimentary Subscription of TOI+</strong> worth
                    Rs.799/-&ZeroWidthSpace;
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
