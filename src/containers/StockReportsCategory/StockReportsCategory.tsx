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

    APICallForFilterData(filterID, postData);
  };
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const APICallForFilterData = (id: any, postData: any = {}) => {
    console.log("sortApplyFilterValue", sortApplyFilterValue);
    const _id = id !== 0 ? [parseFloat(id)] : [];
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
        //console.log("__________call api", response);
        return response.json();
      })
      .then((data) => {
        //console.log("Response data:", data);
        setLoader(false);
        const sortValue = data.requestObj.sort[0].field;
        const displayName = data.allowSortFields.find((item) => item.id === sortValue)?.displayName;
        setSortApplyFilterValue({
          id: data.requestObj.sort[0].field,
          sort: data.requestObj.sort[0].order,
          displayname: displayName
        });
        setStockDataFilter(data);
        setPageSummary((prevPageSummary) => ({
          ...prevPageSummary,
          pageno: data.pageSummary.pageno,
          pagesize: data.pageSummary.pagesize,
          totalRecords: data.pageSummary.totalRecords,
          totalpages: data.pageSummary.totalpages
        }));
      })
      .catch((error) => {
        setLoader(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const handleChagneData = (id: any, name: string, slectedTab: string) => {
    setShowFilter(false);
    console.log("ID", id, "Name", name);

    setFilterMenuTxtShow((preData: any) => ({
      ...preData,
      name: name,
      id: id,
      slectedTab: slectedTab
    }));

    const filterID = filterMenuTxtShow.id;

    APICallForFilterData(filterID);
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
  const fetchDataMore = () => {
    const pageNumberValue = pageSummary.pageno + 1;
    const id = parseFloat(filterMenuTxtShow.id) !== 0 ? [parseFloat(filterMenuTxtShow.id)] : [];
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
      console.log("___here call default id ", filterID);
      setDefaultScreenerId(id);
      //APICallForFilterData(filterID, id);
    }
  };
  console.log("_____filterMenuTxtShow", filterMenuTxtShow);
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
          //console.log("___________entries___________", entries, pageSummary);
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
    console.log("___here call default id ", filterID, defaultScreenerId, screenerIdDefault);
    if (screenerIdDefault != defaultScreenerId) {
      APICallForFilterData(filterID);
    }
  }, [defaultScreenerId]);
  return (
    <>
      <SEO {...seoData} />
      <div className={styles.mainContent}>
        <StockSrCatTabs srTabsClick={srTabsHandlerClick} data={tabData} />
        {!isPrimeUser && <StockTopBanner data={stPlusBannerData} />}
        {stockDataFilter && stockDataFilter.dataList && stockDataFilter.dataList.length && (
          <>
            <div className={styles.stockReportsWrap}>
              <h2 className={styles.heading2}>{stockDataFilter.screenerDetail.name}</h2>
              <div className={styles.catFilterWraper}>
                <span className={styles.sortFilter} onClick={showSortFilter}>
                  sort
                </span>
                <span onClick={() => showFilterMenu(true)} className={styles.menuWraper}>
                  {filterMenuTxtShow.name}
                </span>
              </div>

              {stockDataFilter.screenerDetail.srPlusType === "type-1" ? (
                <StockReportCard
                  data={stockDataFilter.dataList}
                  cardType="scoreCard"
                  totalRecords="0"
                  isPrimeUser={isPrimeUser}
                  isLoginUser={isLoginUser}
                  overlayBlockerData={overlayBlockerData}
                  stockname={stockDataFilter.screenerDetail.name}
                />
              ) : stockDataFilter.screenerDetail.srPlusType === "type-2" ? (
                <StockReportCard
                  data={stockDataFilter.dataList}
                  cardType="upgradeCard"
                  totalRecords="0"
                  isPrimeUser={isPrimeUser}
                  isLoginUser={isLoginUser}
                  overlayBlockerData={overlayBlockerData}
                  stockname={stockDataFilter.screenerDetail.name}
                />
              ) : stockDataFilter.screenerDetail.srPlusType === "type-3" ? (
                <StockReportUpside
                  data={stockDataFilter.dataList}
                  totalRecords="0"
                  isLoginUser={isLoginUser}
                  isPrimeUser={isPrimeUser}
                  overlayBlockerData={overlayBlockerData}
                  stockname={stockDataFilter.screenerDetail.name}
                />
              ) : (
                ""
              )}
              <div ref={lastElementRef}></div>
            </div>
          </>
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
