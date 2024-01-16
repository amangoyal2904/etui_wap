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
import StockReportsPlus from "components/StockReportsPlus";
import { grxEvent, pageview } from "utils/ga";

const StockReports: FC<PageProps> = (props) => {
  const result = props?.searchResult?.find((item) => item.name === "stockreports")?.data as StockReportsProps;
  //console.log("_______props", props);
  const stockData = props?.searchResult?.find((item) => item.name === "stockreportsoverview")?.data as any;
  const reportsPlusFaq = props?.searchResult?.find((item) => item.name === "stockreportsoverview")?.faq as any;
  const hideAds = result && result.hideAds == 1;
  const defaultFilterMenuTxt = { name: props.defaultFiterName, id: props.defaultFilerId, slectedTab: "nse" };
  const [isPrimeUser, setIsPrimeUser] = useState(0);
  const [isLoginUser, setIsLoginUser] = useState(0);
  const [accessibleFeatures, setAccessibleFeatures] = useState([]);
  const [userName, setUserName] = useState("");
  const [stockReportActive, setStockReportActive] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const [filterMenuTxtShow, setFilterMenuTxtShow] = useState(defaultFilterMenuTxt);
  const [stockDataFilter, setStockDataFilter] = useState(stockData);
  const [loader, setLoader] = useState(false);
  const [srTabActivemenu, setSrTabActivemenu] = useState("overview");
  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;
  const tabData = props && props.tabs;
  const stPlusBannerData = props && props.srpluscontent;
  const overlayBlockerData = props && props.overlayBlocker;
  //const activeMenu = props?.searchResult?.find((item) => item.name === "stockreports")?.stockapitype;
  const intsCallback = () => {
    window.objInts.afterPermissionCall(() => {
      const userFullName = window.objUser?.info?.firstName
        ? window.objUser.info.firstName + " " + window.objUser?.info?.lastName
        : "";
      const __accessibleFeatures = window.objInts?.accessibleFeatures || [];
      const __primeuser =
        window.objInts.permissions.indexOf("subscribed") > -1 &&
        __accessibleFeatures.length > 0 &&
        __accessibleFeatures.indexOf("ETSRP") !== -1
          ? 1
          : 0;
      window.objInts.permissions.indexOf("subscribed") > -1 && setIsPrimeUser(__primeuser);
      window.objUser?.info?.isLogged && setIsLoginUser(1);
      setUserName(userFullName);
      setAccessibleFeatures(__accessibleFeatures);
    });
  };
  const menuChangeDataSet = () => {
    setStockDataFilter(stockData);
    setFilterMenuTxtShow(defaultFilterMenuTxt);
  };
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const APICallForFilterData = (id: any, apitype: string) => {
    const _apiTypeValue = srTabActivemenu || "";
    // $'{\"deviceId\":\"web\",\"filterType\":\"index\",\"filterValue\":[2371],\"pageno\":1,\"pagesize\":20,\"screenerId\":2530,\"sort\":[{\"displayName\":\"Last Traded Price\",\"field\":\"lastTradedPrice\",\"order\":\"asc\"}]}'
    const _id = id && id !== 0 ? [parseFloat(id)] : [];
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
    const postData = { apiType: _apiTypeValue, filterType: "index", filterValue: _id, deviceId: "web" };
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
        //console.log("Response data:", data);
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
    //const apiType = srTabActivemenu;
    //APICallForFilterData(id, apiType);
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
  const srTabHandleClick = (apitype: string) => {
    console.log("click tabs apitype", apitype);

    if (apitype === "stockreports") {
      setStockReportActive(true);
      console.log("here go to stock page condtion here");
    } else {
      setStockReportActive(false);
    }
    setSrTabActivemenu(apitype);
  };
  /**
   * Fires tracking events.
   * for sample
   */
  const handleClickForGRX = () => {
    grxEvent(
      "event",
      {
        event_category: "title",
        event_action: `Click-Show More`,
        event_label: `heretitleofPageLable`
      },
      1
    );
    //pageview("https://etnext.economictimes.com/stockreports_benefits.cms");
  };
  useEffect(() => {
    //handleClickForGRX();
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
  useEffect(() => {
    const id = filterMenuTxtShow.id;
    if (srTabActivemenu && srTabActivemenu !== "stockreports") {
      APICallForFilterData(id, srTabActivemenu);
    }
  }, [srTabActivemenu, filterMenuTxtShow.id]);
  //console.log("____________stockDataFilter", filterMenuTxtShow.id);
  return (
    <>
      <SEO {...seoData} />
      <div className={styles.mainContent}>
        {/* {!hideAds && (
          <div className={`${styles.hdAdContainer} adContainer expando_${cpd_wap}`}>
            <DfpAds adInfo={{ key: "atf", subsecnames: seo.subsecnames || {} }} identifier={msid} />
          </div>
        )} */}
        <StockSrTabs data={tabData} activeMenu={srTabActivemenu} srTabClick={srTabHandleClick} />
        {!isPrimeUser && <StockTopBanner data={stPlusBannerData} />}

        {!stockReportActive ? (
          <Fragment>
            {stockDataFilter &&
              stockDataFilter.length &&
              stockDataFilter.map((item: any, index: any) => {
                return (
                  <Fragment key={index}>
                    <div className={styles.stockReportsWrap}>
                      <h2 className={styles.heading2}>
                        {item.filterScreenerName && item.filterScreenerName !== ""
                          ? item.filterScreenerName
                          : item.name}
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
                          isLoginUser={isLoginUser}
                          overlayBlockerData={overlayBlockerData}
                          stockname={item.name}
                          filterSeoName={item.filterSeoName}
                          filterId={filterMenuTxtShow.id}
                        />
                      ) : item.type === "type-2" ? (
                        <StockReportCard
                          data={item.dataList}
                          cardType="upgradeCard"
                          totalRecords={item.totalRecords}
                          id={item.id}
                          isPrimeUser={isPrimeUser}
                          isLoginUser={isLoginUser}
                          overlayBlockerData={overlayBlockerData}
                          stockname={item.name}
                          filterSeoName={item.filterSeoName}
                          filterId={filterMenuTxtShow.id}
                        />
                      ) : item.type === "type-3" ? (
                        <StockReportUpside
                          data={item.dataList}
                          totalRecords={item.totalRecords}
                          id={item.id}
                          isPrimeUser={isPrimeUser}
                          isLoginUser={isLoginUser}
                          overlayBlockerData={overlayBlockerData}
                          stockname={item.name}
                          filterSeoName={item.filterSeoName}
                          filterId={filterMenuTxtShow.id}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <GreyDivider />
                  </Fragment>
                );
              })}
          </Fragment>
        ) : (
          <StockReportsPlus
            isLoginUser={isLoginUser}
            userName={userName}
            isPrimeUser={isPrimeUser}
            faqdata={reportsPlusFaq}
          />
        )}

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
          childMenuTabAcive={filterMenuTxtShow.id}
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
