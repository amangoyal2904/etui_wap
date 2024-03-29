import { getSubscriptionStatus, goToPlanPageNext } from "./utility";
export const ET_WEB_URL = "https://economictimes.indiatimes.com/";
export const ET_WAP_URL = "https://m.economictimes.com";
export const TEST_ID_CTN_HOME = "358376"; // 335965
export const TEST_COLOMBIA_DFP_HOME = "/7176/ET_MWeb/ET_Mweb_Bid_Experiment/ET_Mweb_HP_Bid_Experiment_300";
export const TEST_COLOMBIA_DFP_ARTICLESHOW = "/7176/ET_MWeb/ET_Mweb_Bid_Experiment/ET_Mweb_ROS_Bid_Experiment_300";
export const ET_PRIME_URL = "/prime";
export const ET_MARKET_URL = "https://m.economictimes.com/markets";
export const ET_NEWS_URL = "/news";
export const ET_WEALTH_URL = "https://m.economictimes.com/personal-finance";
export const API_SOURCE_DEVICE = "2"; // for wap applicatiion
export const appLinks = {
  android: "https://play.google.com/store/apps/details?id=com.et.reader.activities&utm_medium=PWA",
  ios: "https://itunes.apple.com/in/app/the-economic-times/id474766725",
  generic:
    "https://uj2g8.app.goo.gl/?link=https://economictimes.indiatimes.com&apn=com.et.reader.activities&isi=474766725&ibi=com.til.ETiphone&efr=1"
};
export const ET_CUBE_URL = "https://m.economictimes.com/widgets/iframe_cube.cms";

export const PAGE_TYPE = {
  articleshow: "articleshow",
  articlelist: "articlelist",
  breadcrumb: "breadcrumb",
  home: "home"
};
export const BROWSI_SECTIONS = [
  "7771250",
  "107115",
  "13352306",
  "837555174",
  "13357270",
  "/nri",
  "/jobs",
  "/industry",
  "/personal-finance",
  "/wealth",
  "/tech"
];

export const SiteConfig = {
  wapsitename: "The Economic Times",
  wapsiteregionalname: "The Economic Times",
  language: "en",
  languagefullName: "english",
  weburl: "https://m.economictimes.com",
  domain: "indiatimes.com",
  purpose: "Business News",
  image: "https://m.economictimes.com/thumb/msid-65498029,width-640,resizemode-4/et-logo.jpg",
  description:
    "Business News - Read Latest Financial news, Stock/Share Market News, Economy News, Business News on The Economic Times.  Find IPO Analysis, Mutual Funds Trends & Analysis, Gold Rate, Real Estate & more.",
  keywords: "business news, personal finance, nse, bse, financial news,share market news india,stock market news",
  title: "Business News Live, Share Market News - Read Latest Finance News, IPO, Mutual Funds News",
  publisherLogo: "https://img.etimg.com/photo/msid-76191298/76191298.jpg"
};

export function getSubsecString(subsecNames) {
  if (!subsecNames) return "";
  const names = [],
    ids = [];
  Object.values(subsecNames).forEach((item: string) => {
    if (item) {
      /^[0-9]+$/.test(item) ? ids.push(item) : names.push(item);
    }
  });
  return names.length > 0 ? names.join("|") : ids.join("|");
}

export const GA = {
  // GTM_KEY: "AW-1012951608",
  GTM_KEY: "GTM-566NCXC",
  GTM_ID: "GTM-WV452H7",
  GA_ID: "UA-198011-5",
  GRX_ID: "gc2744074"
};

export const AND_BEYOND = {
  adSlot: "/7176/ET_MWeb/ET_MWeb_ROS/ET_Mweb_ROS_Andbeyond_1x1",
  adSize: [[1, 1]]
};
export const goToPlanPage = (params, gtmItems: any = "") => {
  //window?.objInts?.goToPlanPageNext();
  let items = {};
  if (gtmItems == "") {
    items = {
      item_name: params.item_name || "stock_report_plus_overview",
      item_id: params.item_id || "",
      item_brand: "market_tools",
      item_category: "stock_report_plus",
      item_category2: params.item_category2 || "stock_report_plus_overview",
      item_category3: params.item_category3 || "paywall_blocker_cta",
      item_category4: params.cta,
      location_id: window.customDimension["dimension25"] || ""
    };
  } else {
    items = gtmItems;
  }
  pushGA4("select_item", items);
  window.ga4Items = items;
  goToPlanPageNext(params);
};

export const pushGA4 = (event = "", item) => {
  window.dataLayer = window.dataLayer || [];
  Array.isArray(window.dataLayer) &&
    window.dataLayer.push({
      event: event,
      items: [{ ...item }]
    });
};

export const loginInitiatedGA4 = ({ isPaywalled, entrypoint, screenName }) => {
  const ticketId = (window.objInts && window.objInts.readCookie("TicketId")) || "";
  const userAccountDetails = ticketId && window.e$.jStorage.get(`prime_${ticketId}`);
  const subscriptionDetails =
    (userAccountDetails && userAccountDetails.subscriptionDetails && userAccountDetails.subscriptionDetails[0]) || {};
  // const isSubscribed = typeof window.objInts != undefined && window.objInts.permissions.indexOf("subscribed") > -1;
  // const nonAdPageArray = ["StockReportPlus"];
  const isMonetizable = "n";
  // if (isSubscribed || nonAdPageArray.indexOf(pageName) !== -1) {
  //   isMonetizable = "n";
  // }
  if (typeof window != "undefined") {
    const items = {
      event: "login_journey",
      entrypoint: entrypoint,
      steps_name: "cta_click",
      feature_name: "et_product",
      screen_name: screenName,
      level_1: window.customDimension ? window.customDimension["dimension26"] : "",
      section_name: window.customDimension ? window.customDimension["dimension26"] : "",
      page_template: window.customDimension ? window.customDimension["dimension25"] : "articleShow",
      sub_section_name: window.customDimension ? window.customDimension["dimension9"] : "",
      login_status: window.objUser && window.objUser.info && window.objUser.info.isLogged ? "y" : "n",
      method: (window.objInts && window.objInts.readCookie("LoginType")) || "",
      subscription_status: getSubscriptionStatus(),
      subscription_type:
        (subscriptionDetails &&
          subscriptionDetails.userAcquisitionType &&
          subscriptionDetails.userAcquisitionType.toLowerCase()) ||
        "free",
      is_monetizable: isMonetizable,
      is_paywalled: isPaywalled ? "y" : "n",
      email: (window.objUser && window.objUser.info && window.objUser.info.primaryEmail) || "",
      phone:
        window.objUser &&
        window.objUser.info.mobileData &&
        window.objUser.info.mobileData.Verified &&
        window.objUser.info.mobileData.Verified.mobile
          ? window.objUser.info.mobileData.Verified.mobile
          : ""
    };
    window.dataLayer = window.dataLayer || [];
    Array.isArray(window.dataLayer) &&
      window.dataLayer.push({
        ...items
      });
  }
};
