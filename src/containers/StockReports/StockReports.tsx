import styles from "./StockReports.module.scss";
import { useEffect, useState, Fragment, FC } from "react";
import { PageProps, StockReportsProps } from "types/stockreports";
import BreadCrumb from "components/BreadCrumb";
import GreyDivider from "components/GreyDivider";
import { getPageSpecificDimensions, updateDimension } from "utils";
import StockReportCard from "components/StockReportCard";
import StockReportUpside from "components/StockReportUpside";
import StockSrTabs from "components/StocksSRTabs";
import StockTopBanner from "components/StockTopBanner";
import StockReportFilter from "components/StockReportFilter";
import SEO from "components/SEO";
import StockReportsPlus from "components/StockReportsPlus";
import { grxEvent } from "utils/ga";
import Link from "next/link";
import StockSRBTMBannerCard from "components/StockSRBTMBanner";
import StockSrTop from "components/StocksSRTop";

const StockReports: FC<PageProps> = (props) => {
  const result = props?.searchResult?.find((item) => item.name === "stockreports")?.data as StockReportsProps;
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
  const btmBlockerData = props && props.btmBlocker;
  const intsCallback = () => {
    window.objInts.afterPermissionCall(() => {
      const userFullName =
        window.objUser?.info?.firstName && window.objUser?.info?.firstName !== null
          ? window.objUser.info.firstName
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
    try {
      const _apiTypeValue = srTabActivemenu || "";
      const _id = id && id > 0 ? [parseFloat(id)] : [];
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
          setLoader(false);
          setStockDataFilter(data);
        })
        .catch((error) => {
          setLoader(false);
          console.error("There was a problem with the fetch operation:", error);
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleChagneData = (id: any, name: string, slectedTab: string) => {
    setShowFilter(false);
    sessionStorage.setItem("sr_filtervalue", id);
    sessionStorage.setItem("sr_filtername", name);
    sessionStorage.setItem("sr_filtertab", slectedTab);
    grxEvent(
      "event",
      {
        event_category: "SR+ Home Page",
        event_action: `${srTabActivemenu} - Index Filter`,
        event_label: `${name}`
      },
      1
    );
    setFilterMenuTxtShow({ name: name, id: id, slectedTab: slectedTab });
  };
  const filterApiCall = () => {
    try {
      fetch("https://economictimes.indiatimes.com/feed/feed_indexfilterdata.cms?feedtype=etjson")
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.log("error filer data is not fetch");
          }
        })
        .then((data) => {
          setFilterMenuData(data);
        })
        .catch((err) => {
          console.log("get error", err);
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  const srTabHandleClick = (apitype: string) => {
    if (apitype === "stockreports") {
      setStockReportActive(true);
    } else {
      setStockReportActive(false);
    }
    setSrTabActivemenu(apitype);
  };

  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      intsCallback();
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }
    filterApiCall();
    updateDimension({ pageName: "stock_report_plus" });
    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);
  useEffect(() => {
    (async () => {
      const filterValue = (await sessionStorage.getItem("sr_filtervalue")) || "";
      const filterName = (await sessionStorage.getItem("sr_filtername")) || "";
      const filterTab = (await sessionStorage.getItem("sr_filtertab")) || "";
      if (filterValue !== "" && filterName !== "" && filterTab !== "") {
        setFilterMenuTxtShow((preData: any) => ({
          ...preData,
          name: filterName,
          id: filterValue,
          slectedTab: filterTab
        }));
      }
    })();
  }, []);
  useEffect(() => {
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
  return (
    <>
      <SEO {...seoData} />
      <div className="mainContent">
        <StockSrTabs data={tabData} activeMenu={srTabActivemenu} srTabClick={srTabHandleClick} />
        <StockSrTop />
        {!isPrimeUser && <StockTopBanner data={stPlusBannerData} srTabActivemenu={srTabActivemenu} />}

        {!stockReportActive ? (
          <>
            {stockDataFilter &&
              stockDataFilter.length &&
              stockDataFilter.map((item: any, index: any) => {
                const seoNameGenrate =
                  item.name && item.name !== "" ? item.name?.trim().replace(/\s/g, "-").toLowerCase() : "";
                const filterNumber =
                  filterMenuTxtShow.id && filterMenuTxtShow.id !== "" ? parseFloat(filterMenuTxtShow.id) : "";
                const filterIdSeo =
                  filterNumber && filterMenuTxtShow.id !== "" ? `,filter-${filterNumber}.cms` : `.cms`;
                const stockSeoname =
                  item.filterSeoName && item.filterSeoName !== ""
                    ? `/markets/stockreportsplus/${item.filterSeoName}/stockreportscategory/screenerid-${item.id}${filterIdSeo}`
                    : `/markets/stockreportsplus/${seoNameGenrate}/stockreportscategory/screenerid-${item.id}${filterIdSeo}`;

                return (
                  <Fragment key={index}>
                    <div className={styles.stockReportsWrap}>
                      <div className={styles.heading2}>
                        <div>
                          <Link href={stockSeoname}>
                            {item.filterScreenerName && item.filterScreenerName !== ""
                              ? item.filterScreenerName
                              : item.name}
                          </Link>
                        </div>
                        <div>
                          <span onClick={() => showFilterMenu(true)} className={styles.menuWraper}>
                            {filterMenuTxtShow.name}
                          </span>
                        </div>
                      </div>

                      {item.type === "type-1" ? (
                        <StockReportCard
                          data={item.dataList}
                          cardType="scoreCard"
                          totalRecords={item.totalRecords}
                          id={item.id}
                          isPrimeUser={isPrimeUser}
                          isLoginUser={isLoginUser}
                          overlayBlockerData={overlayBlockerData}
                          stockname={
                            item.filterScreenerName && item.filterScreenerName !== ""
                              ? item.filterScreenerName
                              : item.name
                          }
                          filterSeoName={item.filterSeoName}
                          filterId={filterMenuTxtShow.id}
                          srTabActivemenu={srTabActivemenu}
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
                          stockname={
                            item.filterScreenerName && item.filterScreenerName !== ""
                              ? item.filterScreenerName
                              : item.name
                          }
                          filterSeoName={item.filterSeoName}
                          filterId={filterMenuTxtShow.id}
                          srTabActivemenu={srTabActivemenu}
                        />
                      ) : item.type === "type-3" ? (
                        <StockReportUpside
                          data={item.dataList}
                          totalRecords={item.totalRecords}
                          id={item.id}
                          isPrimeUser={isPrimeUser}
                          isLoginUser={isLoginUser}
                          overlayBlockerData={overlayBlockerData}
                          stockname={
                            item.filterScreenerName && item.filterScreenerName !== ""
                              ? item.filterScreenerName
                              : item.name
                          }
                          filterSeoName={item.filterSeoName}
                          filterId={filterMenuTxtShow.id}
                          srTabActivemenu={srTabActivemenu}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <GreyDivider />
                  </Fragment>
                );
              })}
          </>
        ) : (
          <StockReportsPlus
            isLoginUser={isLoginUser}
            userName={userName}
            isPrimeUser={isPrimeUser}
            faqdata={reportsPlusFaq}
            srTabActivemenu={srTabActivemenu}
          />
        )}

        <BreadCrumb data={seoData.breadcrumb} />
      </div>
      {!isPrimeUser ? <StockSRBTMBannerCard data={btmBlockerData} /> : ""}
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
