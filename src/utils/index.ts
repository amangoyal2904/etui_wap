import os from "os";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
export const APP_ENV = (publicRuntimeConfig.APP_ENV && publicRuntimeConfig.APP_ENV.trim()) || "production";

declare global {
  interface Window {
    geolocation: number;
    geoinfo: {
      CountryCode: string;
      geolocation: string;
      region_code: string;
    };
    env?: string;
  }
}
export const isBrowser = () => typeof window !== "undefined";

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
    let flag = false;
    // const ginfo = window["geoinfo"] || {}; tbc
    const geoinfo = window.geoinfo;
    if (window.geolocation && window.geolocation != 5 && (window.geolocation != 2 || geoinfo.region_code != "CA")) {
      flag = true;
    }
    return flag;
  } catch (e) {
    console.log("allowGDPR", e);
  }
};
export const pageType = (pathurl) => {
  if (pathurl == "/" || pathurl == "/index.html") {
    return "home";
  } else if (pathurl.indexOf("primearticleshow") != -1) {
    return "primearticle";
  } else if (pathurl.indexOf("articleshow") != -1) {
    return "articleshow";
  } else if (pathurl.indexOf("primearticlelist") != -1 || /prime\/\w/.test(pathurl)) {
    return "primearticlelist";
  } else if (pathurl == "/prime") {
    return "primehome";
  } else if (pathurl.indexOf("/et-tech") != -1) {
    return "techhome";
  } else if (pathurl.indexOf("/topic/") != -1) {
    return "topic";
  } else if (pathurl.indexOf("/videoshow/") != -1) {
    return "videoshow";
  } else {
    return "articlelist";
  }
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
//Email validate tbc
export const validateEmail = (emails) => {
  try {
    let b = 0;
    const c = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/;
    let a = emails;
    let d;
    if (a && a.indexOf(",") != -1) {
      for (a = a.split(","), d = 0, d = 0; d < a.length; d += 1) c.test(a[d]) && (b += 1);
      return d == b ? !0 : !1;
    } else {
      return c.test(a) ? !0 : !1;
    }
  } catch (e) {
    console.log("validateEmail", e);
  }
};
// Date format
export const appendZero = (num) => (num >= 0 && num < 10 ? "0" + num : num);
export const dateFormat = (dt, format = "%Y-%M-%d") => {
  const objD: Date = dt instanceof Date ? dt : new Date(dt);
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
  if (!isNaN(new Date(objD).getTime())) {
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
      "%DD": fullDaysName[objD.getDay() + 1],
      "%D": shortDaysName[objD.getDay() + 1],
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
export const processEnv =
  (process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase().trim()) || "production";
export const queryString = (params) =>
  Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");

export const isProdEnv = () => processEnv === "production";

export const isDevEnv = () => processEnv === "development";

export const isVisible = (elm) => {
  if (elm) {
    const rect = elm.getBoundingClientRect();
    const innerHeight = window.innerHeight - 200;
    const clientHeight = document.documentElement.clientHeight - 200;
    return (
      (rect.height > 0 || rect.width > 0) &&
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= (innerHeight || clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
  } else {
    return false;
  }
};

export const mgidGeoCheck = (pos) => {
  if (typeof window === "undefined") return false;

  try {
    const geoinfo = window.geoinfo;
    if (pos == "mid") {
      if (
        typeof geoinfo != "undefined" &&
        ((geoinfo.CountryCode.toUpperCase() == "AU" && geoinfo.geolocation == "6") ||
          (geoinfo.CountryCode.toUpperCase() == "CA" && geoinfo.geolocation == "2") ||
          (geoinfo.CountryCode.toUpperCase() == "US" && geoinfo.geolocation == "2") ||
          (geoinfo.CountryCode.toUpperCase() == "GB" && geoinfo.geolocation == "5") ||
          (geoinfo.CountryCode.toUpperCase() == "AE" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "SA" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "QA" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "OM" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "KW" && geoinfo.geolocation == "3") ||
          (geoinfo.CountryCode.toUpperCase() == "BH" && geoinfo.geolocation == "3"))
      ) {
        return true;
      } else {
        return false;
      }
    } else if (pos == "eoa") {
      if (
        typeof geoinfo != "undefined" &&
        ((geoinfo.CountryCode.toUpperCase() == "AU" && geoinfo.geolocation == "6") ||
          (geoinfo.CountryCode.toUpperCase() == "CA" && geoinfo.geolocation == "2"))
      ) {
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    console.log("error", e);
  }
};

export const removeBackSlash = (val) => {
  val = val && typeof val != "object" ? val.replace(/\\/g, "") : "";
  return val;
};
