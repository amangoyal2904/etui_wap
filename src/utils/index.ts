import getConfig from "next/config";
import { pageview } from "./ga";
import { ET_WAP_URL, ET_WEB_URL, SiteConfig } from "utils/common";

const { publicRuntimeConfig } = getConfig();
export const APP_ENV = (publicRuntimeConfig.APP_ENV && publicRuntimeConfig.APP_ENV.trim()) || "production";

declare global {
  interface Window {
    geolocation: number;
    customDimension: object;
    geoinfo: {
      CountryCode: string;
      geolocation: string;
      region_code: string;
    };
    opera?: string;
    MSStream?: string;
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
  } else {
    return "notfound";
  }
};

export const prepareMoreParams = ({ all, page, msid }) => {
  interface MoreParams {
    msid?: string | number;
    query?: string;
    tab?: string;
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

  return moreParams;
};

export const getMSID = (url) => (url && url.split(".cms")[0]) || "";
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
export const updateDimension = (dimensions = {}, payload = {}) => {
  try {
    if (typeof window !== "undefined") {
      const sendEvent = () => {
        dimensions["dimension20"] = "PWA";
        window.customDimension = { ...window.customDimension, ...dimensions };
        createGAPageViewPayload(payload);
        pageview(
          (location.pathname + location.search).length > 1
            ? (location.pathname + location.search).substr(1)
            : location.pathname + location.search
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
    const date = new Date(unixTimestamp);
    const formattedDate = date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata"
    });

    return `${formattedDate} IST`;
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
