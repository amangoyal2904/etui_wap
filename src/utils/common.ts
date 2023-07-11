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
