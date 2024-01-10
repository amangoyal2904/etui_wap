import getConfig from "next/config";
import { pageview } from "./ga";
import { ET_WAP_URL, ET_WEB_URL, SiteConfig } from "utils/common";
import { networkInterfaces } from "os";

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

interface payLoadType {
  dimension4: any;
  dimension8: any;
  dimension9: any;
  dimension12: any;
  dimension13: any;
  dimension25: any;
  dimension26: any;
  dimension27: string;
  dimension29: any;
  dimension48: any;
  dimension34?: string;
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
  } else if (pathurl.indexOf("/stockreports/") != -1) {
    return "stockreports";
  } else if (pathurl.indexOf("/stockreportscategory/") != -1) {
    return "stockreportscategory";
  } else if (pathurl.indexOf("stockreports_benefits.cms") != -1) {
    return "stockreportsplus";
  } else {
    return "notfound";
  }
};

export const prepareMoreParams = ({ all, page, msid, stockapitype, screenerid, filterid }) => {
  interface MoreParams {
    msid?: string | number;
    query?: string;
    tab?: string;
    stockapitype?: string;
    screenerid?: string;
    filterid?: string;
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
    moreParams.stockapitype = stockapitype;
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
  const elementWithApitype = all.find((item: any) => item.includes("apitype-"));

  return elementWithApitype ? elementWithApitype.split("-")[1].split(".")[0] : "";
};
export const getScreenerID = (all: any, type: string) => {
  const elementWithApitype = all.find((item: any) => item.includes("screenerid-"));

  if (type === "screenerid") {
    return elementWithApitype ? elementWithApitype.split(",")[0].split("-")[1] : "";
  } else if (type === "filterid") {
    return elementWithApitype ? elementWithApitype.split(",")[1].split("-")[1].split(".")[0] : "";
  }

  //return elementWithApitype ? elementWithApitype.split("-")[1].split(".")[0] : "";
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
  const { subsecnames = {}, msid, updated = "", keywords, agency, page = "videoshow", videoAge } = seo;
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

  const payload: payLoadType = {
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

  if (page == "videoshow") {
    videoAge && (videoAge > 3 ? (payload.dimension34 = ">72hrs") : (payload.dimension34 = "<72hrs"));
  }
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

export const updateDimension = ({
  dimensions = {},
  payload = {},
  url = "",
  type = "",
  pageName = "",
  msid = "",
  subsecnames
}) => {
  try {
    if (typeof window !== "undefined") {
      const sendEvent = () => {
        dimensions["dimension20"] = "PWA";
        window.customDimension = { ...window.customDimension, ...dimensions };
        createGAPageViewPayload(payload);
        const userInfo = typeof objUser !== "undefined" && objUser.info && objUser.info;
        const isSubscribed =
          typeof window.objInts != undefined && window.objInts.permissions.indexOf("subscribed") > -1;
        const nonAdPageArray = ["shortvideos", "quickreads"];
        let isMonetizable = "y";
        if (isSubscribed || nonAdPageArray.indexOf(pageName) !== -1) {
          isMonetizable = "n";
        }
        const { trafficSource, lastClick } = fetchAdaptiveData();
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
          (window.customDimension["msid"] && window.customDimension["msid"]) || msid;
        window.grxDimension_cdp["last_click_source"] = lastClick || "";
        window.grxDimension_cdp["source"] = trafficSource || "";
        window.grxDimension_cdp["business"] = "et";
        window.grxDimension_cdp["dark_mode"] = "n";
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
        window.grxDimension_cdp["subscription_status"] =
          (window.customDimension["dimension37"] && window.customDimension["dimension37"].toLowerCase()) || "";
        window.grxDimension_cdp["page_template"] =
          (window.customDimension["dimension25"] && window.customDimension["dimension25"].toLowerCase()) ||
          (pageName && pageName.toLowerCase());
        window.grxDimension_cdp["subscription_type"] =
          (typeof window.e$ != "undefined" &&
            window.e$.jStorage &&
            window.e$.jStorage.get("et_subscription_profile") &&
            window.e$.jStorage.get("et_subscription_profile").prime_user_acquisition_type &&
            window.e$.jStorage.get("et_subscription_profile").prime_user_acquisition_type.toLowerCase()) ||
          "";
        window.grxDimension_cdp["monetizable"] = isMonetizable;
        const navigator: any = window.navigator;
        window.grxDimension_cdp["browser_name"] = (navigator && navigator.sayswho) || "";
        window.grxDimension_cdp["product"] =
          (window.customDimension["dimension1"] && window.customDimension["dimension1"]) || "";
        window.grxDimension_cdp["level_2"] = subsecnames.subsecname2 || "";
        window.grxDimension_cdp["level_3"] = subsecnames.subsecname3 || "";
        window.grxDimension_cdp["level_4"] = subsecnames.subsecname4 || "";
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
export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
}

export const getArticleType = (url) => {
  try {
    let a,
      b,
      c = "";
    let type = "";
    if (typeof url == "string") {
      a = url.split(".cms")[0];
      b = a.split("/");
      c = b[b.length - 2];
      switch (c) {
        case "articleshow":
          type = "articleshow";
          break;
        case "slideshow":
        case "photostory":
          type = "slideshow";
          break;
        case "primearticleshow":
          type = "primearticleshow";
          break;
        case "videoshow":
          type = "videoshow";
          break;
        case "liveblog":
          type = "liveblog";
          break;
        case "podcast":
          type = "podcast";
          break;
      }
      if (
        url.indexOf(ET_WEB_URL) > -1 &&
        (type == "articleshow" || type == "articlelist" || type == "primearticleshow")
      ) {
        type = "";
      }
    }

    return type;
  } catch (e) {
    console.log("Err getArticleType: ", e);
  }
};

export const getType = (data) => {
  try {
    const metainfo = data.metainfo || {};
    let type = "articleshow";
    if (data.mstype) {
      if (data.mstype == "8" || data.mstype == "3") {
        type = "slideshow";
      } else if (data.msType == "38" && data.mssubtype == "2") {
        type = "podcast";
      } else if (data.mstype == "38") {
        type = "videoshow";
      } else if (data.mstype == "42") {
        type = "liveblog";
      }
    } else if (data.cmstype) {
      if (data.hostid && data.primeid) {
        if (data.cmstype == "ARTICLE") {
          if (data.hostid.indexOf(318) !== -1) {
            if (data.primeid == "200") {
              type = "freereads";
            } else {
              type = "primearticleshow";
            }
          } else if (data.primeid == "100") {
            type = "premium";
          } else {
            type == "articleshow";
          }
        } else if (
          data.cmstype == "SLIDESHOW" ||
          data.cmstype == "IMAGES" ||
          data.cmstype == "PHOTOGALLERYSLIDESHOWSECTION"
        ) {
          type = "slideshow";
          if (metainfo.AMPStory && metainfo.AMPStory.value && metainfo.AMPStory.value == 1) {
            type = "webstory";
          }
        } else if (data.cmstype == "VIDEO" || data.cmstype == "MEDIAVIDEO") {
          type = "videoshow";
        } else if (data.cmstype == "MEDIAAUDIO") {
          type = "podcast";
        } else if (data.cmstype == "LIVEBLOG") {
          type = "liveblog";
        } else if (data.cmstype == "DEFINITION") {
          // Panache people - 77284788
          type = data.parentid == 77284788 ? "profileshow" : "definition";
        }
      }
    } else {
      const url = data.ploverridelink || data.overridelink || data.hoverridelink || "";
      if (url) {
        type = getArticleType(url);
      }
      if (data.contenttypeid == 2) {
        type == "articleshow";
      } else if (data.contenttypeid == 3 || data.contenttypeid == 8) {
        type = "slideshow";
        if (metainfo.AMPStory && metainfo.AMPStory.value && metainfo.AMPStory.value == 1) {
          type = "webstory";
        }
      } else if (data.contenttypeid == 38 && data.contentsubtypeid == 2) {
        type = "podcast";
        // eslint-disable-next-line no-dupe-else-if
      } else if (data.contenttypeid == 2 && data.contentsubtypeid == 7) {
        type = "profileshow";
      } else if (data.contenttypeid == 38) {
        type = "videoshow";
      } else if (data.contenttypeid == 42) {
        type = "liveblog";
      }
    }
    return type;
  } catch (e) {
    console.log("Err getType: ", e);
  }
};

export const shouldRedirectTopic = (all) => {
  const query: string = all?.slice(1, 2).toString();
  let isValidQuery = true;
  const allowedChar = /^[A-Za-z0-9. &-]+$/;
  if (!allowedChar.test(query) || query.split(" ").length > 11) {
    isValidQuery = false;
  }
  return isValidQuery;
};

export const getMSUrl = (data) => {
  try {
    // const { metainfo, original, agency, msid } = data;
    let url = "";
    let type = getType(data);
    if (type == "webstory") {
      type = "slideshow";
    }
    if (type == "premium") {
      type = "articleshow";
    } else if (type == "freereads") {
      type = "primearticleshow";
    }
    let seopath = data.seopath || data.seolocation || "";
    if (data && data.hostid && data.hostid.indexOf("318") != -1) {
      seopath = seopath.replace("news/", "prime/");
    }

    const overrideURL = data.ploverridelink || data.overridelink || data.hoverridelink || "";
    url = data.msid && data.hostid.indexOf("153") == -1 ? "" : overrideURL;
    if (!url) {
      url = ET_WAP_URL + "/" + seopath + "/" + type + "/" + data.msid + ".cms";
    }
    url = url.indexOf("/topic/") > -1 ? url.replace(/[, ]/gi, "-").toLowerCase() : url;
    if (url.indexOf("liveblog") > -1) {
      url = url.replace(ET_WAP_URL, ET_WEB_URL);
    } else if (url && url.indexOf("http") == -1) {
      url = url.indexOf("/") == 0 ? url : "/" + url;
      url = ET_WAP_URL + url;
    }
    /*const customUTM = metainfo && metainfo.RealEstateProjectName && metainfo.RealEstateProjectName.value || "";
    utm = utm || customUTM || "";
    if(customUTM){
      utm = url.indexOf("?") != -1 ? "&" + utm : "?" + utm;
    }
    url = utm ? url + utm : url;*/
    return url;
  } catch (error) {
    console.log("error in getURL", error);
  }
};

export const unixToDate = (unixTimestamp) => {
  try {
    // Create a new Date object based on the Unix timestamp
    const date = new Date(unixTimestamp);

    // Define an array of month abbreviations
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get the day, month, and year from the Date object
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Get the hours and minutes from the Date object
    let hours = date.getHours();
    let minutes: any = date.getMinutes();

    // Determine whether it's AM or PM
    const amOrPm = hours < 12 ? "AM" : "PM";

    // Convert to 12-hour format
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    // Add leading zeros to minutes if necessary
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    // Get the timezone offset from UTC in minutes
    const timezoneOffset = date.getTimezoneOffset();

    // Convert the timezone offset to hours and minutes
    const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / 60));
    const timezoneOffsetMinutes = Math.abs(timezoneOffset % 60);

    // Determine whether the timezone offset is ahead or behind UTC
    const timezoneOffsetSign = timezoneOffset > 0 ? "-" : "+";

    // Create the formatted date string
    const dateString = `${day} ${month}, ${year}, ${hours}.${minutes} ${amOrPm} IST`;

    // Return the formatted date string
    return dateString;
  } catch (e) {
    console.log("Err unixToDate: ", e);
  }
};

export const getKeyData = (data) => {
  const obj = {};
  try {
    for (const key in data) {
      if (data && data[key] && data[key]["@react"]) {
        const keyData = data[key]["#text"] || data[key]["data"] || "";
        if (keyData) {
          obj[key] = keyData;
        } else if (typeof data[key] == "object") {
          const val = getKeyData(data[key]);
          if (val && Object.keys(val).length) {
            obj[key] = val;
          }
        }
      }
    }
  } catch (error) {
    console.log("error in getKeyData");
  }
  return obj;
};

const addZero = (num) => {
  return num >= 10 ? num : "0" + num;
};

export const nowDate = () => {
  const dt = new Date(),
    now =
      dt.getFullYear() +
      "-" +
      addZero(dt.getMonth() + 1) +
      "-" +
      addZero(dt.getDate()) +
      " " +
      addZero(dt.getHours()) +
      ":" +
      addZero(dt.getMinutes()) +
      ":" +
      addZero(dt.getSeconds());
  return now || dt;
};

const getIPAddress = () => {
  const interfaces = networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) return alias.address;
    }
  }
  return "0.0.0.0";
};

export const saveLogs = (data = {}) => {
  try {
    data["vmip"] = getIPAddress();
    const logData =
      "logdata=" + JSON.stringify({ mode: APP_ENV == "development" ? "modeDev" : "modeLive", channel: "WapApi", data });

    fetch("https://etx.indiatimes.com/log?et=mobile", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: logData
    });
  } catch (error) {
    console.log("error in saveLogs", error);
  }
};

export const countWords = (str) => {
  // Remove leading/trailing spaces
  str = str.trim();

  // If the string is empty, return 0
  if (str === "") {
    return 0;
  }

  // Split the string by spaces
  const words = [...str.split(" ")];

  // Count the number of non-empty words
  const wordCount = words.filter((word) => word !== "").length;

  return wordCount;
};
