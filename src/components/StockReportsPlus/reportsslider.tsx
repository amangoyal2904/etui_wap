import { Fragment, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { grxEvent } from "utils/ga";

interface ReportSliderProps {
  isPrimeUser?: number;
  isLogin?: boolean;
}
function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return <div className={`${className} ${styles.noprenext}`} onClick={onClick} />;
}

export default function ReportSliderSec() {
  const [stockData, setStockData] = useState([]);
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
    nextArrow: <SamplePrevArrow />,
    prevArrow: <SamplePrevArrow />,
    autoplaySpeed: 4000 // Adjust this for the speed of auto sliding
  };
  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  const fetchData = () => {
    try {
      fetch(
        `https://etmarketsapis.indiatimes.com/ET_Stats/getIndexByIds?indexid=2369&exchange=50&pagesize=50&sortorder=desc&sortby=percentChange&company=true&indexname=Nifty+50`
      )
        .then((res) => {
          if (res && res.ok) {
            return res.json();
          } else {
            console.log("get some error in slider api");
          }
        })
        .then((data) => {
          const sliderData =
            data && data.searchresult && data.searchresult[0] && data.searchresult[0].companies
              ? data.searchresult[0].companies
              : [];
          setStockData(sliderData);
        })
        .catch((error) => {
          console.log("Error found slider api nifty 50", error);
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  const gaTrackHandler = (companyName: string) => {
    grxEvent(
      "event",
      {
        event_category: "Stock Report  - Proposition Page",
        event_action: `Select Company`,
        event_label: `widget- ${companyName}`
      },
      1
    );
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className={`${styles.reportsSlider} topSec4`}>
        <div className={styles.companiesBg}>
          <h3 className={styles.heading}>
            Start Exploring
            <br />
            Stock Reports Plus
          </h3>

          <div className={`${styles.sliderItem} reportPlustSliderWrap`}>
            {stockData.length > 0 ? (
              <Slider {...settings}>
                {stockData.map((item: any, index: number) => {
                  const formattedAmount = formatIndianRupees(item.current);
                  return (
                    <div key={index} className={styles.listLi} onClick={() => gaTrackHandler(item.companyName)}>
                      <Link href={`/${item.seoName}/stockreports/reportid-${item.companyId}.cms`}>
                        <a target="_blank">
                          <span className={styles.compName}>{item.companyName}</span>
                          <span className={styles.value}>
                            <span className={styles.ltp}>{formattedAmount.replace(".00", "")}</span>
                            <span className={`${styles.change} ${item.change < 0 ? styles.down : styles.up}`}>
                              <i className={styles.stockSprite}></i>
                              <span>{item.change.toFixed(2)}</span>
                              <span>({item.percentChange.toFixed(2)}%)</span>
                            </span>
                          </span>
                        </a>
                      </Link>
                    </div>
                  );
                })}
              </Slider>
            ) : (
              "<p>No stock data available.</p>"
            )}
          </div>
        </div>
      </div>
    </>
  );
}
