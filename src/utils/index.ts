import getConfig from "next/config";
import { pageview } from "./ga";
import { getSubDetails } from "./utility";

const { publicRuntimeConfig } = getConfig();
export const APP_ENV = (publicRuntimeConfig.APP_ENV && publicRuntimeConfig.APP_ENV.trim()) || "production";

declare global {
  interface Window {
    geolocation: number;
    customDimension: any;
    grxDimension_cdp: any;
    geoinfo: {
      CountryCode: string;
      geolocation: string;
      region_code: string;
    };
    opera?: string;
    MSStream?: string;
    e$: {
      jStorage: {
        deleteKey(arg0: string): unknown;
        set(arg1: string, arg2: any): any;
        get(arg1: string): any;
        index: any;
      };
    };
  }
  interface objUser {
    info: {
      isLogged: boolean;
    };
  }
}
export const isBrowser = () => typeof window !== "undefined";

export function loadScript(src) {
  return new Promise(function (resolve, reject) {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));

    document.head.append(script);
  });
}

export const setCookieToSpecificTime = (name, value, days, time, seconds) => {
  try {
    const domain = document.domain;
    let cookiestring = "";
    if (name && value) {
      cookiestring = name + "=" + encodeURIComponent(value) + "; expires=";
      if (days) {
        cookiestring +=
          new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000).toUTCString() +
          "; domain=" +
          domain +
          "; path=/;";
      }
      if (time) {
        cookiestring +=
          new Date(new Date().toDateString() + " " + time).toUTCString() + "; domain=" + domain + "; path=/;";
      }
      if (seconds) {
        const exdate = new Date();
        exdate.setSeconds(exdate.getSeconds() + seconds);
        cookiestring += exdate.toUTCString() + "; domain=" + domain + "; path=/;";
      }
    }

    document.cookie = cookiestring;
  } catch (e) {
    console.log("setCookieToSpecificTime", e);
  }
};
export const getCookie = (name) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  } catch (e) {
    console.log("getCookie", e);
  }
};
// Check if GDPR policy allowed for current location
export const allowGDPR = () => {
  try {
    if (typeof window.geoinfo == "undefined") {
      return false;
    }
    return (
      window.geoinfo &&
      window.geoinfo.geolocation != "5" &&
      (window.geoinfo.geolocation != "2" || window.geoinfo.region_code != "CA")
    );
  } catch (e) {
    console.log("allowGDPR", e);
  }
};
const checkTopicUrl = (url, all) => {
  const query: string = url.split("/")[2] || all?.slice(1, 2).toString();
  const type: string = all?.slice(2, 3).toString();
  /*
    -> checking exact topic url format topic/query/tab
    -> for topic case correct url only have topic, query, and tabs
    -> tabs only can have all, news and videos and not should be undefined or null
  */
  if (
    url.indexOf(`/topic/${query}${type ? `/${type}` : ""}`) != -1 &&
    !(all.length > 3) &&
    (["all", "news", "videos"].includes(type.toLowerCase()) || !type)
  ) {
    return true;
  }
  return false;
};
const checkCorrectUrl = (url, msid, page) => {
  if (!isNaN(msid) && url.indexOf(`/${page}/${msid}.cms`) != -1) {
    return true;
  }
  return false;
};
export const pageType = (pathurl, msid, all) => {
  if (pathurl.indexOf("/topic/") != -1 && checkTopicUrl(pathurl, all)) {
    return "topic";
  } else if (pathurl.indexOf("/videoshow/") != -1 && checkCorrectUrl(pathurl, msid, "videoshow")) {
    return "videoshow";
  } else if (pathurl.indexOf("/videoshownew/") != -1 && checkCorrectUrl(pathurl, msid, "videoshownew")) {
    return "videoshownew";
  } else if (pathurl.indexOf("/quickreads") != -1) {
    return "quickreads";
  } else if (pathurl.indexOf("/shortvideos/") != -1) {
    return "shortvideos";
  } else if (pathurl.indexOf("/markets/benefits/stockreportsplus") != -1) {
    return "stockreportsplus";
  } else if (pathurl.indexOf("/redeemtoi") != -1) {
    return "redeemtoi";
  } else if (pathurl.indexOf("/redeemetmhril") != -1) {
    return "redeemetmhril";
  } else if (pathurl.indexOf("/referrals") != -1) {
    return "referrals";
  } else if (/^\/markets\/stockreportsplus\/(.)+\/stockreportscategory\/screenerid-(.)+/.test(pathurl)) {
    return "stockreportscategory";
  } else {
    return "notfound";
  }
};

export const prepareMoreParams = ({ all, page, msid, stockapitype = "", screenerid = 0, filterid = 0 }) => {
  interface MoreParams {
    msid?: string | number;
    query?: string;
    tab?: string;
    stockapitype?: string;
    screenerid?: string | number;
    filterid?: string | number;
  }

  const moreParams: MoreParams = {};

  if (msid && /^[0-9]+$/.test(msid)) moreParams.msid = msid;

  if (page === "topic") {
    let query: string = all?.slice(1, 2).toString();
    const type: string = all?.slice(2, 3).toString() || "All";
    query = query.replace(/-/g, "%20");
    moreParams.query = query;
    moreParams.tab = `${type ? type : ""}`;
    delete moreParams.msid;
  }

  if (page === "stockreportsplus") {
    moreParams.stockapitype = stockapitype || "overview";
    delete moreParams.msid;
  }

  if (page === "stockreportscategory") {
    moreParams.screenerid = screenerid;
    moreParams.filterid = filterid;
    delete moreParams.msid;
  }
  return moreParams;
};

export const getMSID = (url) => (url && url.split(".cms")[0]) || "";
export const getStockAPITYPE = (all: any) => {
  try {
    const elementWithApitype = all.find((item: any) => item.includes("apitype-"));
    return elementWithApitype ? elementWithApitype.split("-")[1].split(".")[0] : "";
  } catch (error) {
    return "";
  }
};

export const getScreenerID = (all: any, type: string) => {
  try {
    const elementWithApitype = all.find((item: any) => item.includes("screenerid-"));
    const splitElementWithApitype = elementWithApitype && elementWithApitype.split(",");
    const screeneridString = splitElementWithApitype
      ?.filter((item) => item.includes("screenerid-"))
      ?.map((item) => {
        const match = item.match(/screenerid-(\d+)/);
        return match ? match[1] : null;
      })
      .filter((id) => id !== null);
    const filteridString = splitElementWithApitype
      ?.filter((item) => item.includes("filter-"))
      ?.map((item) => {
        const match = item.match(/filter-(\d+)/);
        return match ? match[1] : null;
      })
      .filter((id) => id !== null);
    if (type === "screenerid") {
      return screeneridString && screeneridString.length ? screeneridString[0] : "";
    } else if (type === "filterid") {
      return filteridString && filteridString.length ? filteridString[0] : "";
    }
  } catch (error) {
    return "";
  }
};
export const encodeQueryData = (data) => {
  const ret = [];
  for (const d in data) ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
};

//Get any parameter value from URL
export const getParameterByName = (name) => {
  try {
    if (name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    } else {
      return "";
    }
  } catch (e) {
    console.log("getParameterByName", e);
  }
};

export const processEnv =
  (process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase().trim()) || "production";
export const queryString = (params) =>
  Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");

export const getMobileOS = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  return "unknown";
};

export const removeBackSlash = (val) => {
  val = val && typeof val != "object" ? val.replace(/\\/g, "") : "";
  return val;
};

export const checkLoggedinStatus = () => {
  //check login status
  try {
    return typeof window.objUser !== "undefined" && !!window.objUser.info.isLogged;
  } catch (e) {
    console.log("Error in checkLoggedinStatus:", e);
  }
};
export const getPageSpecificDimensions = (seo) => {
  const { subsecnames = {}, msid, updated = "", keywords, agency, page = "videoshow" } = seo;
  const dateArray = updated.split(",");
  const dateString = dateArray[0] || "";
  const timeString = dateArray[1] || "";
  const { subsec1, subsecname1, subsecname2, subsecname3 } = subsecnames;
  const sectionsList =
    subsecname1 && subsecname2 && subsecname3
      ? `/${subsecname1}/${subsecname2}/${subsecname3}/`
      : subsecname1 && subsecname2
      ? `$/${subsecname1}/${subsecname2}/`
      : subsecname1
      ? `/${subsecname1}/`
      : "";

  const payload = {
    dimension4: agency,
    dimension8: dateString,
    dimension9: subsecname2,
    dimension12: keywords,
    dimension13: timeString,
    dimension25: page,
    dimension26: subsecname1,
    dimension27: sectionsList,
    dimension29: subsec1,
    dimension48: msid
  };
  return payload;
};

export const isBotAgent = () => {
  const ua = (navigator && navigator.userAgent && navigator.userAgent.toLowerCase()) || "";
  return ua.indexOf("bot") != -1 ? 1 : 0;
};

export const isNoFollow = (link: string) => {
  let nofollow = false;
  try {
    if (link.indexOf("http://") === 0 || link.indexOf("https://") === 0) {
      if (
        link.indexOf("m.economictimes.com") > -1 ||
        (link.indexOf("economictimes.indiatimes.com") > -1 &&
          link.indexOf("gujarati.economictimes.indiatimes.com") == -1)
      ) {
        nofollow = false;
      } else {
        nofollow = true;
      }
    }
  } catch (e) {
    console.log("isNoFollow:" + e);
  }
  return nofollow;
};
export const createGAPageViewPayload = (payload = {}) => {
  const objInts = window.objInts;
  try {
    let subsStatus = "Free User";
    if (typeof objInts != "undefined") {
      if (localStorage.getItem("et_logintype") != null) {
        const loginType = localStorage.getItem("et_logintype");
        payload["dimension22"] = loginType;
      }
      if (objInts.permissions.indexOf("expired_subscription") > -1) {
        subsStatus = "Expired User";
      } else if (
        objInts.permissions.indexOf("subscribed") > -1 &&
        objInts.permissions.indexOf("cancelled_subscription") > -1 &&
        objInts.permissions.indexOf("can_buy_subscription") > -1
      ) {
        subsStatus = "Paid User - In Trial";
      } else if (objInts.permissions.indexOf("subscribed") > -1) {
        subsStatus = "Paid User";
      } else if (objInts.permissions.indexOf("etadfree_subscribed") > -1) {
        subsStatus = "Ad Free User";
      }
    }
    let a: any = (window.localStorage && localStorage.getItem("et_syftCounter")) || "";
    a = (a && JSON.parse(a)) || {};
    // if (ssoid) {
    //   payload["userId"] = ssoid;
    // }
    if (a.beforeSyft) {
      payload["dimension32"] = a.beforeSyft;
    }
    if (a.afterSyft) {
      payload["dimension33"] = a.afterSyft;
    }
    payload["dimension37"] = subsStatus;
    window.customDimension = { ...window.customDimension, ...payload };
  } catch (e) {
    console.log("Error in createGAPageViewPayload:", e);
  }
};
export const appendZero = (num) => (num >= 0 && num < 10 ? "0" + num : num);

export const getjStorageVal = (keyName) => {
  let value = "";
  try {
    if (typeof window.e$ !== "undefined") {
      value = window.e$.jStorage.get(keyName);
    }
  } catch (e) {
    console.log("error", e);
  }
  return value;
};
export const fetchAdaptiveData = function () {
  const referrer = document.referrer;
  let trafficSource = "Direct";
  if (getjStorageVal("etu_source")) {
    trafficSource = getjStorageVal("etu_source");
  } else if (referrer.indexOf("google") !== -1 || referrer.indexOf("bing") || referrer.indexOf("yahoo")) {
    trafficSource = "Organic";
  } else if (
    referrer.indexOf("social") !== -1 ||
    referrer.indexOf("facebook") ||
    referrer.indexOf("linkedin") ||
    referrer.indexOf("instagram") ||
    referrer.indexOf("twitter")
  ) {
    trafficSource = "Social";
  } else if (window.location.href.toLowerCase().indexOf("utm") !== -1) {
    trafficSource = "Newsletter";
  }
  const loginStatus = getCookie("ssoid") ? "Logged In" : "Not Logged In";
  const lastClick = getjStorageVal("etu_last_click") || "direct_landing_articleshow";
  const dtObject = new Date(),
    dt = dtObject.getFullYear() + "" + appendZero(dtObject.getMonth() + 1) + "" + appendZero(dtObject.getDate());
  const key = "et_article_" + dt;
  const articleReadCountToday = (getjStorageVal(key) || []).length;
  let articleReadCountMonth = 0;
  let paidArticleReadCountMonth: any = 0;
  try {
    const jstorageKeys = window.e$.jStorage.index();
    jstorageKeys
      .filter(function (key) {
        return key.indexOf("et_article_") !== -1;
      })
      .forEach(function (key) {
        articleReadCountMonth += getjStorageVal(key).length;
      });
    jstorageKeys
      .filter(function (key) {
        return key.indexOf("et_primearticle_") !== -1;
      })
      .forEach(function (key) {
        paidArticleReadCountMonth += getjStorageVal(key) || 0;
      });
  } catch (e) {
    console.log("error", e);
  }
  const paidArticleReadCountTodayKey = "et_primearticle_" + dt;
  const paidArticleReadCountToday = getjStorageVal(paidArticleReadCountTodayKey) || 0;
  const continuousPaywallHits = (getjStorageVal("et_continuousPaywalled") || []).length;
  return {
    trafficSource,
    loginStatus,
    lastClick,
    articleReadCountToday,
    articleReadCountMonth,
    paidArticleReadCountToday,
    paidArticleReadCountMonth,
    continuousPaywallHits
  };
};
function getDate(dt) {
  return (dt && dateFormat(dt, "%d-%M-%Y")) || "";
}
export const updateDimension = ({
  dimensions = {},
  payload = {},
  url = "",
  type = "",
  pageName = "",
  msid = "",
  subsecnames = {}
}: any) => {
  try {
    if (typeof window !== "undefined") {
      const sendEvent = async () => {
        dimensions["dimension20"] = "PWA";
        dimensions["ga_url"] = window.location.href;
        window.customDimension = { ...window.customDimension, ...dimensions };
        createGAPageViewPayload(payload);
        const userInfo = typeof objUser !== "undefined" && objUser.info && objUser.info;
        const isSubscribed =
          typeof window.objInts != undefined && window.objInts.permissions.indexOf("subscribed") > -1;
        const product = pageName == "stock_report_plus" ? "prime" : "other";
        const isArticle = pageName == "primearticleshow" || pageName == "articleshow";
        const nonAdPageArray = ["shortvideos", "quickreads"];
        let isMonetizable = "y";
        if (isSubscribed || nonAdPageArray.indexOf(pageName) !== -1) {
          isMonetizable = "n";
        }
        let subsStatus = "free";
        if (typeof window.objInts != "undefined") {
          if (window.objInts.permissions.indexOf("expired_subscription") > -1) {
            subsStatus = "expired";
          } else if (
            window.objInts.permissions.indexOf("subscribed") > -1 &&
            window.objInts.permissions.indexOf("cancelled_subscription") > -1 &&
            window.objInts.permissions.indexOf("can_buy_subscription") > -1
          ) {
            subsStatus = "trial";
          } else if (window.objInts.permissions.indexOf("subscribed") > -1) {
            subsStatus = "paid";
          } else if (window.objInts.permissions.indexOf("etadfree_subscribed") > -1) {
            subsStatus = "adfree";
          } else if (window.objInts.permissions.indexOf("cancelled_subscription") > -1) {
            subsStatus = "cancelled";
          }
        }
        const { trafficSource, lastClick } = fetchAdaptiveData();
        const subDetails = window.e$.jStorage.get("userSubsDetails") || (await getSubDetails());
        const ticketId = window.objInts.readCookie("TicketId");
        const userAccountDetails = ticketId && window.e$.jStorage.get(`prime_${ticketId}`);
        const subscriptionDetails =
          (userAccountDetails && userAccountDetails.subscriptionDetails && userAccountDetails.subscriptionDetails[0]) ||
          {};
        window.grxDimension_cdp = {
          url: window.location.href,
          title: document.title,
          referral_url: document.referrer,
          platform: "pwa"
        };
        window.grxDimension_cdp["section_id"] =
          (window.customDimension["dimension29"] && window.customDimension["dimension29"]) || "";
        window.grxDimension_cdp["level_1"] =
          (window.customDimension["dimension26"] && window.customDimension["dimension26"].toLowerCase()) || "";
        window.grxDimension_cdp["level_full"] =
          (window.customDimension["dimension27"] && window.customDimension["dimension27"].toLowerCase()) || "";
        window.grxDimension_cdp["paywalled"] = window.customDimension["dimension59"] == "Yes" ? "y" : "n";
        window.grxDimension_cdp["content_id"] =
          (window.customDimension["msid"] && parseInt(window.customDimension["msid"])) || parseInt(msid);
        window.grxDimension_cdp["last_click_source"] = lastClick || "";
        window.grxDimension_cdp["source"] = trafficSource || "";
        window.grxDimension_cdp["business"] = "et";
        window.grxDimension_cdp["dark_mode"] = "n";
        window.grxDimension_cdp["ga_url"] = window.location.href;
        window.grxDimension_cdp["event_name"] = "page_view";
        window.grxDimension_cdp["client_source"] = "cdp";
        window.grxDimension_cdp["product"] = product;
        window.grxDimension_cdp["loggedin"] =
          window.customDimension["dimension3"] && window.customDimension["dimension3"] == "LOGGEDIN"
            ? "y"
            : userInfo && userInfo.isLogged
            ? "y"
            : "n";
        window.grxDimension_cdp["email"] = (userInfo && userInfo.primaryEmail) || "";
        window.grxDimension_cdp["phone"] =
          userInfo && userInfo.mobileData && userInfo.mobileData.Verified && userInfo.mobileData.Verified.mobile
            ? userInfo.mobileData.Verified.mobile
            : "";
        window.grxDimension_cdp["subscription_status"] = subsStatus;
        window.grxDimension_cdp["page_template"] =
          (window.customDimension["dimension25"] && window.customDimension["dimension25"].toLowerCase()) ||
          (pageName && pageName.toLowerCase());
        window.grxDimension_cdp["subscription_type"] =
          (subscriptionDetails &&
            subscriptionDetails.userAcquisitionType &&
            subscriptionDetails.userAcquisitionType.toLowerCase()) ||
          "free";
        window.grxDimension_cdp["monetizable"] = isMonetizable;
        const navigator: any = window.navigator;
        window.grxDimension_cdp["browser_name"] = (navigator && navigator.sayswho) || "";
        window.grxDimension_cdp["level_2"] = subsecnames?.subsecname2 || "";
        window.grxDimension_cdp["level_3"] = subsecnames?.subsecname3 || "";
        window.grxDimension_cdp["level_4"] = subsecnames?.subsecname4 || "";
        window.grxDimension_cdp["user_grx_id"] = window.objInts.readCookie("_grx") || "";
        window.grxDimension_cdp["user_id"] = window.customDimension["user_id"] || userInfo?.ssoid || "";
        const utmParams_dim = window.URLSearchParams && new URLSearchParams(window.location.search);
        const utmSource_dim = utmParams_dim.get && utmParams_dim.get("utm_source");
        const utmMedium_dim = utmParams_dim.get && utmParams_dim.get("utm_medium");
        const utmCamp_dim = utmParams_dim.get && utmParams_dim.get("utm_campaign");
        const campaign_id = utmParams_dim.get && utmParams_dim.get("campaign_id");
        window.grxDimension_cdp["utm_source"] = utmSource_dim || "";
        window.grxDimension_cdp["utm_medium"] = utmMedium_dim || "";
        window.grxDimension_cdp["utm_campaign"] = utmCamp_dim || "";
        window.grxDimension_cdp["campaign_id"] = campaign_id || "";
        window.grxDimension_cdp["login_method"] = window.objInts.readCookie("LoginType") || "";

        window.grxDimension_cdp["first_date_on_et"] =
          (window.e$.jStorage && window.e$.jStorage.get("et_first_date")) || "";
        window.grxDimension_cdp["last_visited_date"] = dateFormat(new Date(), "%d-%M-%Y") || "";
        window.grxDimension_cdp["trial_status"] = subDetails?.trial || "";
        window.grxDimension_cdp["recurring"] = subDetails?.recurring || "";
        window.grxDimension_cdp["plan_name"] = subDetails?.planName || "";
        window.grxDimension_cdp["subscription_cancellation_date"] = getDate(subDetails?.cancelledOn) || "";
        window.grxDimension_cdp["trial_end_date"] = getDate(subDetails?.trialEndDate) || "";
        window.grxDimension_cdp["article_publish_time"] = isArticle ? window.customDimension["dimension13"] : "";
        window.grxDimension_cdp["agency"] = isArticle ? window.customDimension["dimension4"] : "";
        window.grxDimension_cdp["author_id"] = window.customDimension["dimension23"] || "";
        window.grxDimension_cdp["author_name"] = window.customDimension["dimension5"] || "";
        window.grxDimension_cdp["bureau_articles_read"] = window.customDimension.dimension65 || "";
        window.grxDimension_cdp["continuous_paywall_hits"] = window.customDimension.dimension96 || "";
        window.grxDimension_cdp["daily_article_count"] = window.customDimension.dimension94 || "";
        window.grxDimension_cdp["daily_paid_article_count"] = window.customDimension.dimension98 || "";
        window.grxDimension_cdp["eligibility_paywall_rule"] = window.customDimension.dimension62 || "";
        window.grxDimension_cdp["free_articles_read"] = window.customDimension.dimension64 || "";
        window.grxDimension_cdp["paywall_hits"] = window.customDimension.dimension68 || "";
        window.grxDimension_cdp["monthly_article_count"] = window.customDimension.dimension95 || "";
        window.grxDimension_cdp["monthly_paid_article_count"] = window.customDimension.dimension97 || "";
        window.grxDimension_cdp["syft_initiate_page"] = window.customDimension.dimension24 || "";
        window.grxDimension_cdp["user_login_status_session"] = window.customDimension.dimension3 || "";
        window.grxDimension_cdp["user_region"] = window.customDimension.dimension109 || "";
        window.grxDimension_cdp["paywall_experiment"] = window.customDimension.dimension72 || "";
        window.grxDimension_cdp["web_peuuid"] = getCookie("peuuid") || "";
        window.grxDimension_cdp["web_pfuuid"] = getCookie("pfuuid") || "";
        url
          ? pageview(url, payload, type)
          : pageview(
              (location.pathname + location.search).length > 1
                ? (location.pathname + location.search).substr(1)
                : location.pathname + location.search,
              payload,
              type
            );
      };
      const objUser = (window.objUser && window.objUser.info) || {};
      if (Object.keys(objUser).length) {
        dimensions["dimension3"] = "LOGGEDIN";
      } else {
        dimensions["dimension3"] = "NONLOGGEDIN";
      }
      dimensions["user_grx_id"] = window.objInts.readCookie("_grx") || "";
      dimensions["user_id"] = window.customDimension["user_id"] || objUser?.ssoid || "";
      window.customDimension = { ...window.customDimension, ...dimensions };
      if (typeof window.objInts !== "undefined") {
        window.objInts.afterPermissionCall(sendEvent);
      } else {
        document.addEventListener("objIntsLoaded", () => {
          window?.objInts?.afterPermissionCall(sendEvent);
        });
      }
    }
  } catch (e) {
    console.log("updateDimension error: ", e);
  }
};
export const dateFormat = (dt, format = "%Y-%M-%d") => {
  const objD: any = dt instanceof Date ? dt : new Date(dt);
  const shortMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const shortDaysName = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const fullDaysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let newDate = "";
  if (objD != "Invalid Date") {
    const hour = objD.getHours();
    const dList = {
      "%ss": objD.getMilliseconds(),
      "%Y": objD.getFullYear(),
      "%y": objD.getFullYear().toString().substr(-2),
      "%MMM": shortMonthName[objD.getMonth()],
      "%MM": fullMonthName[objD.getMonth()],
      "%M": objD.getMonth() + 1,
      "%d": objD.getDate(),
      "%h": hour <= 12 ? hour : hour - 12,
      "%H": hour,
      "%m": objD.getMinutes(),
      "%s": objD.getSeconds(),
      "%DD": fullDaysName[objD.getDay()],
      "%D": shortDaysName[objD.getDay()],
      "%p": objD.getHours() > 11 ? "PM" : "AM"
    };
    newDate = format;

    for (const key in dList) {
      const regEx = new RegExp(key, "g");
      newDate = newDate.replace(regEx, appendZero(dList[key]));
    }
  }
  return newDate;
};
export const prepSeoListData = (data) => {
  let primaryList = data || [];
  primaryList = primaryList.filter((i) => {
    return i.layoutType && i.layoutType == "break"
      ? false
      : i.type !== "colombia" && i.type !== "liveblog" && i.name !== "dfp";
  });
  primaryList?.map((i) => {
    const data = { ...i };
    data.title = removeBackSlash(i.title);
  });
  return primaryList;
};
/**
 * it will check for query if its valid or not
 * @param all
 * @returns true or false
 */
export const shouldRedirectTopic = (all) => {
  const query: string = all?.slice(1, 2).toString();
  let isValidQuery = true;
  const allowedChar = /^[A-Za-z0-9. &-]+$/;
  if (!allowedChar.test(query) || query.split(" ").length > 11) {
    isValidQuery = false;
  }
  return isValidQuery;
};
