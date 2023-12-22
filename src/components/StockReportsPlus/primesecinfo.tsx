import { Fragment } from "react";
import styles from "./styles.module.scss";
import LazyLoadImg from "../LazyLoad";

interface PrimeSecInfoProps {
  isPrimeUser?: number;
  isLogin?: boolean;
}

export default function PrimeSecInfoSec({ isPrimeUser, isLogin }: PrimeSecInfoProps) {
  return (
    <>
      <section className={styles.etPrimeSec}>
        <div className={styles.stockWrapper}>
          <div className={styles.ctaSec}>
            <h4 className={styles.ctaHead}>
              Get these Reports worth
              <strong>₹1,499*</strong> with
              <span className={styles.redTxt}>ETPrime</span>
              <strong className={styles.moreBold}> at no extra cost</strong>
            </h4>
            <div className={styles.btnSec}>
              <button
                className={styles.etBtnPrime}
                data-url="/stockreport/plans.cms?dc=ETPMONSN5T&amp;track=stockreport"
              >
                View ETPrime Plans
              </button>
              <p className={styles.conditionText}>
                *As per competitive benchmarking of annual price. <a href="/terms-conditions">T&amp;C apply</a>
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
