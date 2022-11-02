import { removeBackSlash } from "utils";
import { pageview } from "./ga";
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
