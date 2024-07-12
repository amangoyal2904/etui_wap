import APIS_CONFIG from "network/config.json";
import Service from "network/service";
import { APP_ENV, getCookie } from "utils";
import { X_CLIENT_ID } from "utils/common";
import { isLiveApp } from "./articleUtility";

declare global {
  interface Window {
    objDim: any;
    grxDimension_cdp: any;
    ga4Items: any;
  }
}

export const goToPlanPageNext = (params?: any) => {
  window.e$.jStorage.deleteKey("userlogin_ru");
  params = params || {};
  console.log("params", params);
  // var syftData = objSyftCount.get();
  const cVal: any = JSON.stringify({
    msid: params.msid || "",
    art_category: params.category || "",
    title: params.title || "",
    ru: window.location.href,
    cta: params.cta || ""
  });
  const cDim: any = window.customDimension || {};
  // if (window.tmplName) {
  //     cDim.dimension24 = (window.tmplName.indexOf('articleshow') != -1 ? 'articleshow' : tmplName);
  // }

  if (params.dim49) {
    cDim.dimension49 = params.dim49;
  }
  if (params.cd) {
    cDim.dimension28 = params.cd;
  }

  // $.cookie("subscriptionRedirection", cVal, {
  //     path: "/",
  //     domain: ".economictimes.com"
  // });

  if (window.localStorage && localStorage.setItem) {
    localStorage.setItem("et_gadimension", JSON.stringify(cDim));
    localStorage.setItem("subscriptionRedirection", cVal);
  }

  window.objInts.readCookie("etipr");
  // $.removeCookie('etipr');
  // $.removeCookie('etipr', {
  //     path: '/',
  //     domain: '.economictimes.com'
  // });
  const isPrime = (window.objInts.permissions && window.objInts.permissions.indexOf("subscribed") != -1) || 0;
  let gotoPage =
    (params.upgrade || isPrime ? window.objVc.planPageUpgrade : window.objVc.planPage) +
    (params.planType ? "?plancode=" + params.planType : "");

  if (params.url) {
    gotoPage = params.url;
  } else {
    if (params.dc) {
      gotoPage = gotoPage + (gotoPage.indexOf("?") == -1 ? "?" : "&") + "dc=" + params.dc;
    }
    if (params.planGroup) {
      gotoPage = gotoPage + (gotoPage.indexOf("?") == -1 ? "?" : "&") + "planGroup=" + params.planGroup;
    }
    if (params.cardType) {
      gotoPage = gotoPage + (gotoPage.indexOf("?") == -1 ? "?" : "&") + "cardType=" + params.cardType;
    }
  }
  grxPushData(params);
  const experimentFlag = window.objInts.experimentStatus("C8qD6Em0Qsev5ETNfdoAhg");
  if (!window.objUser.info.isLogged && (experimentFlag == 1 || params.loginFirst)) {
    gotoPage = "/login.cms?ru=" + gotoPage;
  }
  let featureCode = "";
  const locHref = window.location.href;
  if (locHref.indexOf("stockreports_benefits") > 0) {
    featureCode = "ETSRP";
  }

  const featureCodeParam = featureCode != "" ? "&featureCode=" + featureCode + "&acqSubSource=" + featureCode : "";

  let newUrl =
    gotoPage +
    (gotoPage.indexOf("?") == -1 ? "?" : "&") +
    ("ru=" + encodeURI(JSON.parse(cVal).ru) + "&grxId=" + window.objInts.readCookie("_grx") + featureCodeParam);
  newUrl = window.location.host.indexOf("-pp") !== -1 ? newUrl.replace("dev-buy", "buy") : newUrl;
  newUrl = typeof params != "undefined" && typeof params.url != "undefined" ? params.url : newUrl;

  if (window.objUser.info.isLogged) {
    let urlWithTID = newUrl;
    urlWithTID =
      (newUrl + (newUrl.indexOf("?") == -1 ? "?" : "&") + "ticketId=" + window.objInts &&
        window.objInts.readCookie("TicketId")) ||
      urlWithTID;
    window.location.href = urlWithTID;
  } else {
    window.location.href = newUrl;
  }
};
const grxPushData = (params) => {
  const { widget = "", cta = "" } = params || {};
  const URL: any = APIS_CONFIG.pushGA[APP_ENV];
  const objUserData: any = {};
  if (window.objUser && window.objUser.info && window.objUser.info.isLogged) {
    objUserData.fname = window.objUser.info.firstName ? window.objUser.info.firstName : "";
    objUserData.fullname =
      window.objUser.info.lastName && window.objUser.info.firstName
        ? window.objUser.info.firstName + " " + window.objUser.info.lastName
        : "";
    objUserData.email = window.objUser.info.primaryEmail ? window.objUser.info.primaryEmail : "";
    objUserData.mobile =
      window.objUser.info.mobileData &&
      window.objUser.info.mobileData.Verified &&
      window.objUser.info.mobileData.Verified.mobile
        ? window.objUser.info.mobileData.Verified.mobile
        : "";
  }
  const grxDimensions = window.objVc.growthRxDimension;
  for (const key of Object.keys(grxDimensions)) {
    if (key.includes("d")) {
      grxDimensions[key.replace("d", "dimension")] = grxDimensions[key];
      delete grxDimensions[key];
    }
  }
  const data: any = {
    logdata: JSON.stringify({
      ET: window.customDimension,
      grxMappingObj: grxDimensions,
      analytics_cdp: { ...window.grxDimension_cdp, last_widget_type: widget, cta_text: cta, feature_name: widget },
      objUserData,
      ga4Items: window.ga4Items
    }),
    merchantType: "ET",
    grxId: window.objInts.readCookie("_grx")
  };
  const requestOptions: any = {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify(data),
    dataType: "json",
    timeout: 10000
  };

  fetch(URL, requestOptions)
    .then((res) => {
      console.log("res---->gapush", res);
    })
    .catch((err) => {
      console.log("failed to push gadata err: ", err);
    });
};
export const getSubscriptionStatus = () => {
  let subsStatus = "free";
  if (typeof window.objInts != "undefined") {
    if (window.objInts.permissions.indexOf("expired_subscription") > -1) {
      subsStatus = "expired";
      return subsStatus;
    } else if (
      window.objInts.permissions.indexOf("subscribed") > -1 &&
      window.objInts.permissions.indexOf("cancelled_subscription") > -1 &&
      window.objInts.permissions.indexOf("can_buy_subscription") > -1
    ) {
      subsStatus = "trial";
      return subsStatus;
    } else if (window.objInts.permissions.indexOf("subscribed") > -1) {
      subsStatus = "paid";
      return subsStatus;
    } else if (window.objInts.permissions.indexOf("etadfree_subscribed") > -1) {
      subsStatus = "adfree";
      return subsStatus;
    } else if (window.objInts.permissions.indexOf("cancelled_subscription") > -1) {
      subsStatus = "cancelled";
      return subsStatus;
    }
  }
  return subsStatus;
};
export const getSubDetails = async () => {
  try {
    if (window?.objUser?.info?.isLogged) {
      const url =
        "https://" + isLiveApp()
          ? "subscription"
          : "qcsubscription" +
            ".economictimes.indiatimes.com/subscription/growthAnalyitcs?merchantCode=ET&isGroupUser=false";
      const otr = getCookie("OTR");
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-TOKEN": otr,
        "X-CLIENT-ID": isLiveApp() ? X_CLIENT_ID.production : X_CLIENT_ID.development
      };
      const response = await fetch(url, {
        headers: headers,
        method: "get",
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        const subsData = (data && data.length && data[0]) || {};
        window?.e$?.jStorage.set("userSubsDetails", subsData);
        return subsData;
      }
    }
  } catch (e) {
    console.log("Error in getting subscription details", e);
  }
};
