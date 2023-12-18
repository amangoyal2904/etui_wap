import styles from "./StockReportsCategory.module.scss";
import DfpAds from "components/Ad/DfpAds";
import { useEffect, useState, Fragment, FC } from "react";
import { PageProps, StockReportsProps, StocksTabs, StockOverViewProps } from "types/stockreportscategory";
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

  const [isPrimeUser, setIsPrimeUser] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [showSortMenu, setSortMenu] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const [filterMenuTxtShow, setFilterMenuTxtShow] = useState(defaultFilterMenuTxt);
  const [stockDataFilter, setStockDataFilter] = useState(stockData);
  const [loader, setLoader] = useState(false);
  const [sortApplyFilterValue, setSortApplyFilterValue] = useState({
    id: sortDefaultActive,
    sort: "asc",
    displayname: ""
  });
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
  const oncloseSortMenu = (value: boolean) => {
    console.log("click to sort menu ", value);
    setSortMenu(value);
  };
  const showSortFilter = () => {
    setSortMenu(true);
  };
  const sortApplyHandlerFun = (id: string, sort: boolean, displayname: string) => {
    setSortApplyFilterValue({
      id: id,
      sort: sort ? "asc" : "desc",
      displayname: displayname
    });
    setSortMenu(false);
    APICallForFilterData(filterMenuTxtShow.id);
  };
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const APICallForFilterData = (id: any) => {
    console.log("sortApplyFilterValue", sortApplyFilterValue);
    const _id = id !== 0 ? [parseFloat(id)] : [];
    const bodyPostData = {
      deviceId: "web",
      filterType: "index",
      filterValue: _id,
      pageno: 1,
      screenerId: parseFloat(screenerIdDefault),
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
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        setLoader(false);
        const sortValue = data.requestObj.sort[0].field;
        const displayName = data.allowSortFields.find((item) => item.id === sortValue)?.displayName;
        setSortApplyFilterValue({
          id: data.requestObj.sort[0].field,
          sort: data.requestObj.sort[0].order,
          displayname: displayName
        });
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
  //console.log("___stockDataFilter", stockDataFilter);
  useEffect(() => {
    // set page specific customDimensions
    const payload = getPageSpecificDimensions(seo);
    window.customDimension = { ...window.customDimension, ...payload };
    menuChangeDataSet();
  }, [props]);
  //console.log("filterMenuTxtShow", filterMenuTxtShow);
  return (
    <>
      <SEO {...seoData} />
      <div className={styles.mainContent}>
        <StockSrTabs data={tabData} activeMenu={activeMenu} />
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
                <StockReportCard data={stockDataFilter.dataList} cardType="scoreCard" totalRecords="0" />
              ) : stockDataFilter.screenerDetail.srPlusType === "type-2" ? (
                <StockReportCard data={stockDataFilter.dataList} cardType="upgradeCard" totalRecords="0" />
              ) : stockDataFilter.screenerDetail.srPlusType === "type-3" ? (
                <StockReportUpside data={stockDataFilter.dataList} totalRecords="0" />
              ) : (
                ""
              )}
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
