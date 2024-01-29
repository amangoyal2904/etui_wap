import styles from "./StockReportsCategory.module.scss";
import DfpAds from "components/Ad/DfpAds";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment, FC, useRef } from "react";
import { PageProps, StockReportsProps, StocksTabs, StockOverViewProps } from "types/stockreportscategory";
import BreadCrumb from "components/BreadCrumb";
import GreyDivider from "components/GreyDivider";
import { getPageSpecificDimensions } from "utils";
import { ET_WAP_URL } from "utils/common";
import StockReportCard from "components/StockReportCard";
import StockReportUpside from "components/StockReportUpside";
import StockSrCatTabs from "components/StocksSRCatTabs";
import StockTopBanner from "components/StockTopBanner";
import StockReportFilter from "components/StockReportFilter";
import SEO from "components/SEO";
import StockReportSortFilter from "components/StockReportSortFilter";
import StockCatTabNoDataFound from "components/StockSRNoDataFound";
import { grxEvent } from "utils/ga";
import StockSRBTMBannerCard from "components/StockSRBTMBanner";

const StockReports: FC<PageProps> = (props) => {
  const result = props?.searchResult?.find((item) => item.name === "stockreports")?.data as StockReportsProps;
  //console.log("_______props", props);
  const stockData = props?.searchResult?.find((item) => item.name === "stockreportsbycategory")?.json as any;
  const hideAds = result && result.hideAds == 1;
  const defaultFilterMenuTxt = { name: props.defaultFiterName, id: props.defaultFilerId, slectedTab: "nse" };
  const allowSortFields = props?.searchResult?.find((item) => item.name === "stockreportsbycategory")?.json
    ?.allowSortFields;
  const sortDefaultActive = props?.searchResult?.find((item) => item.name === "stockreportsbycategory")?.json
    ?.requestObj?.sort[0]?.field;

  const screenerIdDefault = props?.searchResult?.find((item) => item.name === "stockreportsbycategory")?.json
    ?.requestObj?.screenerId;

  const defaultPageSummary = props?.searchResult?.find((item) => item.name === "stockreportsbycategory")?.json
    ?.pageSummary;
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  //const [defaultScreenerId, setDefaultScreenerId] = useState(screenerIdDefault);
  const [defaultScreenerId, setDefaultScreenerId] = useState(screenerIdDefault);
  const [isPrimeUser, setIsPrimeUser] = useState(0);
  const [isLoginUser, setIsLoginUser] = useState(0);
  const [accessibleFeatures, setAccessibleFeatures] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showSortMenu, setSortMenu] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const [filterMenuTxtShow, setFilterMenuTxtShow] = useState(defaultFilterMenuTxt);
  const [stockDataFilter, setStockDataFilter] = useState(stockData);
  const [loader, setLoader] = useState(false);
  const [sortApplyFilterValue, setSortApplyFilterValue] = useState({
    id: sortDefaultActive,
    sort: "desc",
    displayname: ""
  });
  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const { msid } = parameters;
  const { cpd_wap = "0" } = version_control;
  const tabData = props && props.tabs;
  const stPlusBannerData = props && props.srpluscontent;
  const overlayBlockerData = props && props.overlayBlocker;
  const btmBlockerData = props && props.btmBlocker;
  const activeMenu = props?.searchResult?.find((item) => item.name === "stockreports")?.stockapitype;
  const [pageSummary, setPageSummary] = useState({
    pageno: parseFloat(defaultPageSummary.pageno),
    pagesize: parseFloat(defaultPageSummary.pagesize),
    totalRecords: parseFloat(defaultPageSummary.totalRecords),
    totalpages: parseFloat(defaultPageSummary.totalpages)
  });
  const intsCallback = () => {
    window.objInts.afterPermissionCall(() => {
      const __accessibleFeatures = window.objInts?.accessibleFeatures || [];
      const __primeuser =
        window.objInts.permissions.indexOf("subscribed") > -1 &&
        __accessibleFeatures.length > 0 &&
        __accessibleFeatures.indexOf("ETSRP") !== -1
          ? 1
          : 0;
      window.objInts.permissions.indexOf("subscribed") > -1 && setIsPrimeUser(__primeuser);
      window.objUser?.info?.isLogged && setIsLoginUser(1);
      setAccessibleFeatures(__accessibleFeatures);
    });
  };
  const menuChangeDataSet = () => {
    setStockDataFilter(stockData);
    setFilterMenuTxtShow(defaultFilterMenuTxt);
  };
  const oncloseSortMenu = (value: boolean) => {
    console.log("click to sort menu ", value);
    setSortMenu(value);
  };
  const showSortFilter = () => {
    setSortMenu(true);
  };
  const sortApplyHandlerFun = (newId: string, newSort: string, newDisplayName: string) => {
    setSortApplyFilterValue((preData: any) => ({
      ...preData,
      id: newId,
      sort: newSort,
      displayname: newDisplayName
    }));

    setSortMenu(false);
    const filterID = filterMenuTxtShow.id;
    const postData = {
      id: filterID,
      field: newId,
      sort: newSort,
      displayName: newDisplayName
    };
    const activeCat = tabData && tabData[0] && tabData[0].activeCategory ? tabData[0].activeCategory : "";
    grxEvent(
      "event",
      {
        event_category: "SR+ Details Page",
        event_action: `${activeCat} - ${filterMenuTxtShow.name}- Sort Filter`,
        event_label: `${newDisplayName}`
      },
      1
    );
    APICallForFilterData(filterID, postData);
    //console.log("___filterID", filterID, "___postData");
  };
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const APICallForFilterData = (id: any, postData: any = {}) => {
    console.log("sortApplyFilterValue", sortApplyFilterValue);
    const _id = id > 0 ? [parseFloat(id)] : [];
    const bodyPostData = {
      deviceId: "web",
      filterType: "index",
      filterValue: _id,
      pageno: 1,
      screenerId: parseFloat(defaultScreenerId),
      sort: [
        {
          displayName: postData.displayName || sortApplyFilterValue.displayname,
          field: postData.field || sortApplyFilterValue.id,
          order: postData.sort || sortApplyFilterValue.sort
        }
      ]
    };
    const APIURL = "https://screener.indiatimes.com/screener/getScreenerByScreenerId";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyPostData)
    };
    setLoader(true);
    fetch(APIURL, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setLoader(false);
          throw new Error("Network response was not ok.");
        }
        //console.log("__________call api__________", response);
        return response.json();
      })
      .then((data) => {
        // console.log("Response data:_____", data);
        setLoader(false);
        const sortValue = data.requestObj.sort[0].field;
        const displayName = data.allowSortFields
          ? data.allowSortFields.find((item) => item.id === sortValue)?.displayName
          : "";
        setSortApplyFilterValue({
          id: data.requestObj.sort[0].field,
          sort: data.requestObj.sort[0].order,
          displayname: displayName
        });
        // console.log("StockDataFilter:_____", stockDataFilter);
        setStockDataFilter(data);
        setPageSummary((prevPageSummary) => ({
          ...prevPageSummary,
          pageno: data.pageSummary.pageno,
          pagesize: data.pageSummary.pagesize,
          totalRecords: data.pageSummary.totalRecords,
          totalpages: data.pageSummary.totalpages
        }));
        const urlData = {
          seoName: data.screenerDetail.filterSeoName || data.screenerDetail.seoName,
          filterid: data.screenerDetail.filterValue || ""
        };
        urlUpdateHandler(urlData);
        const flIdValue = data.screenerDetail.filterValue || "";
        const flNameValue = data.screenerDetail.filterName || "";
        const flExValue = data.screenerDetail.exhchange || "nse";

        sessionStorage.setItem("sr_filtervalue", flIdValue);
        sessionStorage.setItem("sr_filtername", flNameValue);
        sessionStorage.setItem("sr_filtertab", flExValue);
      })
      .catch((error) => {
        setLoader(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const urlUpdateHandler = (urlData: any) => {
    const stockSeoName = urlData.seoName;
    const id = urlData.filterid;
    const urlGenrate =
      id && id !== ""
        ? `markets/stockreportsplus/${stockSeoName}/stockreportscategory/screenerid-${defaultScreenerId},filter-${id}.cms`
        : `markets/stockreportsplus/${stockSeoName}/stockreportscategory/screenerid-${defaultScreenerId}.cms`;
    router.push(urlGenrate, undefined, { shallow: true });
  };
  const handleChagneData = (id: any, name: string, slectedTab: string) => {
    setShowFilter(false);
    const urlNode = {
      filter: id,
      filterSeoName: name,
      screenerid: defaultScreenerId,
      seoNodeName: stockDataFilter.screenerDetail.name
    };
    const activeCat = tabData && tabData[0] && tabData[0].activeCategory ? tabData[0].activeCategory : "";
    grxEvent(
      "event",
      {
        event_category: "SR+ Details Page",
        event_action: `${activeCat} - Index Filter`,
        event_label: `${name}`
      },
      1
    );
    //console.log("Filter ID", urlNode);
    sessionStorage.setItem("sr_filtervalue", id);
    sessionStorage.setItem("sr_filtername", name);
    sessionStorage.setItem("sr_filtertab", slectedTab);
    const stockSeoName =
      urlNode && urlNode.seoNodeName !== "" ? urlNode.seoNodeName?.trim().replace(/\s/g, "").toLowerCase() : "";
    const filterSeoName = name && name !== "" ? name?.trim().replace(/\s/g, "").toLowerCase() : "";

    setFilterMenuTxtShow((preData: any) => ({
      ...preData,
      name: name,
      id: id,
      slectedTab: slectedTab
    }));

    //setDefaultScreenerId(id);
    //APICallForFilterData(filterID, id);

    //const filterID = filterMenuTxtShow.id;
    //srTabsHandlerClick(id, name);
    // here get Seo Filer Name and ID screener id and filter id then call api
    //APICallForFilterData(filterID);
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
        // console.log("get Fitler Data", data);
        setFilterMenuData(data);
      })
      .catch((err) => {
        console.log("get error", err);
      });
  };
  const fetchDataMore = () => {
    const pageNumberValue = pageSummary.pageno + 1;
    const id =
      filterMenuTxtShow.id !== "" && parseFloat(filterMenuTxtShow.id) !== 0 ? [parseFloat(filterMenuTxtShow.id)] : [];
    const bodyPostData = {
      deviceId: "web",
      filterType: "index",
      filterValue: id,
      pageno: pageNumberValue,
      screenerId: parseFloat(defaultScreenerId),
      sort: [
        {
          displayName: sortApplyFilterValue.displayname,
          field: sortApplyFilterValue.id,
          order: sortApplyFilterValue.sort
        }
      ]
    };
    //console.log("___ body", bodyPostData, filterMenuTxtShow);
    const APIURL = "https://screener.indiatimes.com/screener/getScreenerByScreenerId";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyPostData)
    };
    setLoader(true);
    fetch(APIURL, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setLoader(false);
          //console.log("yes call api for this ______", response);
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Response data:", data);
        setLoader(false);
        const onlyData = data.dataList;
        setPageSummary((prevPageSummary) => ({
          ...prevPageSummary,
          pageno: data.pageSummary.pageno,
          pagesize: data.pageSummary.pagesize,
          totalRecords: data.pageSummary.totalRecords,
          totalpages: data.pageSummary.totalpages
        }));
        //console.log("_________________________pageSummery", data.pageSummary);
        setStockDataFilter((prevData: any) => ({
          ...prevData,
          dataList: [...prevData.dataList, ...data.dataList]
        }));
      })
      .catch((error) => {
        setLoader(false);
        console.error("There was a problem with the fetch operation more data:", error);
      });
  };
  const srTabsHandlerClick = (id: any, name: string) => {
    const stockSeoName = name && name !== "" ? name?.trim().replace(/\s/g, "").toLowerCase() : "";
    const filterSeoName =
      filterMenuTxtShow && filterMenuTxtShow.name && filterMenuTxtShow.name !== ""
        ? filterMenuTxtShow?.name?.trim().replace(/\s/g, "").toLowerCase()
        : "";

    if (id !== defaultScreenerId) {
      router.push(
        `markets/stockreportsplus/${stockSeoName}-${filterSeoName}/stockreportscategory/screenerid-${id},filter-${filterMenuTxtShow.id}.cms`,
        undefined,
        { shallow: true }
      );
      const filterID = filterMenuTxtShow.id;
      // console.log("___here call default id ", filterID);
      setDefaultScreenerId(id);
      //APICallForFilterData(filterID, id);
    }
  };
  //console.log("_____filterMenuTxtShow", filterMenuTxtShow);
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
  //console.log("___stockDataFilter", stockDataFilter);
  useEffect(() => {
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };
    //menuChangeDataSet();
  }, [props]);
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect(); // Disconnect the existing observer if any
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pageSummary.pageno !== pageSummary.totalpages) {
          fetchDataMore(); // Call the fetchData function when the observed element is intersecting
          // console.log("___________entries___________", entries, pageSummary);
        }
      },
      { threshold: 1 }
    );

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect(); // Disconnect the observer on component unmount
      }
    };
  }, [lastElementRef, pageSummary]);
  useEffect(() => {
    const filterID = filterMenuTxtShow.id;
    console.log("_________________here call default id ", {
      filterID,
      defaultScreenerId,
      screenerIdDefault,
      defaultFilterMenuTxt
    });
    sessionStorage.setItem("sr_filtervalue", defaultFilterMenuTxt.id);
    sessionStorage.setItem("sr_filtername", defaultFilterMenuTxt.name);
    sessionStorage.setItem("sr_filtertab", defaultFilterMenuTxt.slectedTab);

    if (screenerIdDefault != defaultScreenerId || defaultFilterMenuTxt.id != filterID) {
      APICallForFilterData(filterID);
    }
  }, [defaultScreenerId, filterMenuTxtShow.id]);
  // console.log("_______stockDataFilter", stockDataFilter.dataList);
  return (
    <>
      <SEO {...seoData} />
      <div className={styles.mainContent}>
        <StockSrCatTabs srTabsClick={srTabsHandlerClick} data={tabData} />
        {!isPrimeUser && <StockTopBanner srTabActivemenu={`stockreportscategory`} data={stPlusBannerData} />}
        {stockDataFilter &&
        stockDataFilter.dataList &&
        (stockDataFilter.dataList.length > 0 || stockDataFilter.dataList.name) ? (
          <>
            <div className={styles.stockReportsWrap}>
              <div className={styles.topHeadingSec}>
                <h1 className={styles.heading2}>
                  {stockDataFilter.screenerDetail.filterScreenerName || stockDataFilter.screenerDetail.name}
                </h1>
                <div className={styles.catFilterWraper}>
                  <span onClick={() => showFilterMenu(true)} className={styles.menuWraper}>
                    {filterMenuTxtShow.name}
                  </span>
                  <span className={styles.sortFilter} onClick={showSortFilter}>
                    sort
                  </span>
                </div>
              </div>

              {stockDataFilter.screenerDetail.srPlusType === "type-1" ? (
                <StockReportCard
                  data={
                    stockDataFilter.dataList && stockDataFilter.dataList.length > 0
                      ? stockDataFilter.dataList
                      : [stockDataFilter.dataList]
                  }
                  cardType="scoreCard"
                  totalRecords="0"
                  isPrimeUser={isPrimeUser}
                  isLoginUser={isLoginUser}
                  overlayBlockerData={overlayBlockerData}
                  stockname={stockDataFilter.screenerDetail.name}
                  filterSeoName={stockDataFilter.filterSeoName}
                  srTabActivemenu={`stockreportscategory`}
                />
              ) : stockDataFilter.screenerDetail.srPlusType === "type-2" ? (
                <StockReportCard
                  data={
                    stockDataFilter.dataList && stockDataFilter.dataList.length > 0
                      ? stockDataFilter.dataList
                      : [stockDataFilter.dataList]
                  }
                  cardType="upgradeCard"
                  totalRecords="0"
                  isPrimeUser={isPrimeUser}
                  isLoginUser={isLoginUser}
                  overlayBlockerData={overlayBlockerData}
                  stockname={stockDataFilter.screenerDetail.name}
                  filterSeoName={stockDataFilter.filterSeoName}
                  srTabActivemenu={`stockreportscategory`}
                />
              ) : stockDataFilter.screenerDetail.srPlusType === "type-3" ? (
                <StockReportUpside
                  data={
                    stockDataFilter.dataList && stockDataFilter.dataList.length > 0
                      ? stockDataFilter.dataList
                      : [stockDataFilter.dataList]
                  }
                  totalRecords="0"
                  isLoginUser={isLoginUser}
                  isPrimeUser={isPrimeUser}
                  overlayBlockerData={overlayBlockerData}
                  stockname={stockDataFilter.screenerDetail.name}
                  filterSeoName={stockDataFilter.filterSeoName}
                  srTabActivemenu={`stockreportscategory`}
                />
              ) : (
                ""
              )}
              <div ref={lastElementRef}></div>
            </div>
          </>
        ) : (
          <StockCatTabNoDataFound />
        )}

        <BreadCrumb data={seoData.breadcrumb} />
        {/* {!hideAds && (
          <div className={`${styles.footerAd} adContainer`}>
            <DfpAds adInfo={{ key: "fbn", subsecnames: seo.subsecnames || {} }} identifier={msid} />
          </div>
        )} */}
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
      {showSortMenu && (
        <StockReportSortFilter
          oncloseMenu={oncloseSortMenu}
          data={allowSortFields}
          defaultActiveTabData={sortApplyFilterValue}
          sortApplyHandler={sortApplyHandlerFun}
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
