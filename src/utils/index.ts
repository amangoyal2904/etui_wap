import getConfig from "next/config";

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
    if (pathurl.indexOf("next=1") !== -1) return "videoshownew";
    if (pathurl.indexOf("next=2") !== -1) return "videoshownewalt";
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
