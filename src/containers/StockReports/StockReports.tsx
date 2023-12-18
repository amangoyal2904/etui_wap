import styles from "./StockReports.module.scss";
import DfpAds from "components/Ad/DfpAds";
import { useEffect, useState, Fragment, FC } from "react";
import { PageProps, StockReportsProps, StocksTabs, StockOverViewProps } from "types/stockreports";
import BreadCrumb from "components/BreadCrumb";
import GreyDivider from "components/GreyDivider";
import { getPageSpecificDimensions } from "utils";
import { ET_WAP_URL } from "utils/common";
import StockReportCard from "components/StockReportCard";
import StockReportUpside from "components/StockReportUpside";
import StockSrTabs from "components/StocksSRTabs";
import StockTopBanner from "components/StockTopBanner";
import StockReportFilter from "components/StockReportFilter";
import SEO from "components/SEO";

const StockReports: FC<PageProps> = (props) => {
  const result = props?.searchResult?.find((item) => item.name === "stockreports")?.data as StockReportsProps;
  //console.log("_______props", props);
  const stockData = props?.searchResult?.find((item) => item.name === "stockreportsoverview")?.data as any;
  const hideAds = result && result.hideAds == 1;
  const defaultFilterMenuTxt = { name: props.defaultFiterName, id: props.defaultFilerId, slectedTab: "nse" };
  const [isPrimeUser, setIsPrimeUser] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const [filterMenuTxtShow, setFilterMenuTxtShow] = useState(defaultFilterMenuTxt);
  const [stockDataFilter, setStockDataFilter] = useState(stockData);
  const [loader, setLoader] = useState(false);
  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;
  const tabData = props && props.tabs;
  const activeMenu = props?.searchResult?.find((item) => item.name === "stockreports")?.stockapitype;
  const intsCallback = () => {
    window.objInts.afterPermissionCall(() => {
      window.objInts.permissions.indexOf("subscribed") > -1 && setIsPrimeUser(1);
    });
  };
  const menuChangeDataSet = () => {
    setStockDataFilter(stockData);
    setFilterMenuTxtShow(defaultFilterMenuTxt);
  };
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const APICallForFilterData = (id: any) => {
    const _apiTypeValue =
      activeMenu === "overview"
        ? "overview"
        : activeMenu === "stockscore"
        ? "stockscore"
        : activeMenu === "stockforecast"
        ? "stockforecast"
        : "";
    // $'{\"deviceId\":\"web\",\"filterType\":\"index\",\"filterValue\":[2371],\"pageno\":1,\"pagesize\":20,\"screenerId\":2530,\"sort\":[{\"displayName\":\"Last Traded Price\",\"field\":\"lastTradedPrice\",\"order\":\"asc\"}]}'
    const _id = id !== 0 ? [parseFloat(id)] : [];
    const dataBody = {
      deviceId: "web",
      filterType: "index",
      filterValue: _id,
      pageno: 1,
      pagesize: 20,
      screenerId: _id,
      sort: [
        {
          displayName: "Last Traded Price",
          field: "lastTradedPrice",
          order: "asc"
        }
      ]
    };
    const APIURL = "https://screener.indiatimes.com/screener/stockReportAllTabs";
    const postData = { apiType: _apiTypeValue, filterType: "index", filterValue: _id };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    };
    setLoader(true);
    fetch(APIURL, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setLoader(false);
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        setLoader(false);
        setStockDataFilter(data);
      })
      .catch((error) => {
        setLoader(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const handleChagneData = (id: any, name: string, slectedTab: string) => {
    setShowFilter(false);
    console.log("ID", id, "Name", name);
    setFilterMenuTxtShow({ name: name, id: id, slectedTab: slectedTab });
    APICallForFilterData(id);
  };
  const filterApiCall = () => {
    fetch("https://economictimes.indiatimes.com/feed/feed_indexfilterdata.cms?feedtype=etjson")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log("error filer data is not fetch");
        }
      })
      .then((data) => {
        console.log("get Fitler Data", data);
        setFilterMenuData(data);
      })
      .catch((err) => {
        console.log("get error", err);
      });
  };
  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      intsCallback();
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }
    filterApiCall();
    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);

  useEffect(() => {
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };
    menuChangeDataSet();
  }, [props]);

  return (
    <>
      <SEO {...seoData} />
      <div className={styles.mainContent}>
        {/* {!hideAds && (
          <div className={`${styles.hdAdContainer} adContainer expando_${cpd_wap}`}>
            <DfpAds adInfo={{ key: "atf", subsecnames: seo.subsecnames || {} }} identifier={msid} />
          </div>
        )} */}
        <StockSrTabs data={tabData} activeMenu={activeMenu} />
        <StockTopBanner />
        {stockDataFilter &&
          stockDataFilter.length &&
          stockDataFilter.map((item: any, index: any) => {
            return (
              <>
                <div className={styles.stockReportsWrap}>
                  <h2 className={styles.heading2}>
                    {item.name}
                    <span onClick={() => showFilterMenu(true)} className={styles.menuWraper}>
                      {filterMenuTxtShow.name}
                    </span>
                  </h2>

                  {item.type === "type-1" ? (
                    <StockReportCard
                      data={item.dataList}
                      cardType="scoreCard"
                      totalRecords={item.totalRecords}
                      id={item.id}
                      isPrimeUser={isPrimeUser}
                    />
                  ) : item.type === "type-2" ? (
                    <StockReportCard
                      data={item.dataList}
                      cardType="upgradeCard"
                      totalRecords={item.totalRecords}
                      id={item.id}
                      isPrimeUser={isPrimeUser}
                    />
                  ) : item.type === "type-3" ? (
                    <StockReportUpside
                      data={item.dataList}
                      totalRecords={item.totalRecords}
                      id={item.id}
                      isPrimeUser={isPrimeUser}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <GreyDivider />
              </>
            );
          })}

        {/* <div className={styles.stockReportsWrap}>
          <h2 className={styles.heading2}>
            Top Score Companies{" "}
            <span onClick={() => showFilterMenu(true)} className={styles.menuWraper}>
              Nifty 50
            </span>
          </h2>
          <StockReportCard data={seoData.breadcrumb} cardType="scoreCard" />
        </div>
        <GreyDivider />
        <div className={styles.stockReportsWrap}>
          <h2 className={styles.heading2}>Score Upgrade</h2>
          <StockReportCard data={seoData.breadcrumb} cardType="upgradeCard" />
        </div>
        <GreyDivider />
        <div className={styles.stockReportsWrap}>
          <h2 className={styles.heading2}>High Upside Stocks</h2>
          <StockReportUpside data={seoData.breadcrumb} />
        </div> */}

        <BreadCrumb data={seoData.breadcrumb} />
        {!hideAds && (
          <div className={`${styles.footerAd} adContainer`}>
            <DfpAds adInfo={{ key: "fbn", subsecnames: seo.subsecnames || {} }} identifier={msid} />
          </div>
        )}
      </div>
      {showFilter && (
        <StockReportFilter
          data={filterMenuData}
          onclick={showFilterMenu}
          valuechange={handleChagneData}
          selectTab={filterMenuTxtShow.slectedTab}
        />
      )}
      {loader && (
        <div className={styles.loading}>
          <div className={styles.loader}></div>
        </div>
      )}
    </>
  );
};

export default StockReports;
