import Service from "../network/service";
import APIS_CONFIG from "../network/config.json";
import { APP_ENV, getArticleType, getMSUrl, unixToDate } from "../utils";
import { version_control } from "./version_control";
import ETCache from "../utils/cache";

interface AdSlot {
  adSlot: string;
  adSize: number[][];
}

interface DFP {
  andbeyond: AdSlot;
  atf: AdSlot;
  fbn: AdSlot;
  mrec: AdSlot;
  mrec1: AdSlot;
}
interface VersionControl {
  dfp?: DFP;
}

interface ApiResponse {
  header?: {
    et: string;
    potime: number;
  };
  response?: any; // Define the response object shape here
}

const getTypeArr = (param) => {
  try {
    const tab = param?.toLowerCase() ?? "all";
    // Returns an array of content type IDs based on the tab parameter value
    switch (tab) {
      case "videos":
        return [1024];
      case "news":
        return [1001];
      default:
        return [1001, 1024, 1010];
    }
  } catch (e) {
    console.log("Err getTypeArr: ", e);
  }
};

/**
 *fetchApiData - This function fetches the data by calling a POST api
 *param query - The search query string
 *param tab - The tab value. Defaults to "all" if not provided
 *returns {Promise} - Returns a promise with the result data from the api
 */
const fetchApiData = async (query, tab = "all") => {
  try {
    const url = APIS_CONFIG.knowledgesearch[APP_ENV];
    const result = await Service.post({
      url,
      payload: {
        searchTerms: [query],
        hostid: [153],
        rows: 30,
        typeid: getTypeArr(tab) ?? []
      },
      params: {}
    });

    return result.data;
  } catch (e) {
    console.log("Err fetchApiData: ", e);
  }
};

const searchResult = (response) => {
  const resultData = [];

  try {
    for (let i = 0; i < response.length; i++) {
      const { title, synopsis, hasThumb, effectivedate, seopath, msid, contenttypeid, category } = response[i];

      const getUrl = getMSUrl(response[i]);
      if (i == 3) {
        resultData.push({
          name: "dfp",
          type: "mrec"
        });
      } else if (i == 6) {
        resultData.push({
          name: "dfp",
          type: "mrec1"
        });
      }
      resultData.push({
        title: contenttypeid == 3 && category ? category : title,
        url: getUrl,
        type: getArticleType(getUrl),
        date: unixToDate(effectivedate) ?? "",
        synopsis,
        ...(hasThumb == 1 && { img: `https://img.etimg.com/thumb/msid-${msid},width-200,height-150/${seopath}.jpg` })
      });
    }
  } catch (e) {
    console.log("searchResult Error: ", e);
  }
  return {
    name: "topic",
    data: resultData
  };
};

const seoDetails = (response, query, tab = "") => {
  try {
    const title = `${query}: Latest News &amp; Videos, Photos about ${query} | The Economic Times`,
      description = `${query} Latest Breaking News, Pictures, Videos, and Special Reports from The Economic Times. ${query} Blogs, Comments and Archive News on Economictimes.com`,
      canonical = `https://economictimes.indiatimes.com/topic/${query.replace(/\W+/g, "-").toLowerCase()}${
        tab ? "/" + tab.toLowerCase() : ""
      }`,
      authors = response[0]?.author ? response[0].author : response[0]?.agency ? response[0].agency : "ET Online",
      agency = response[0]?.agency ? response[0].agency : "ET Online",
      image = `https://img.etimg.com/thumb/msid-65498029,width-672,resizemode-4/et-logo.jpg`,
      keywords = `${query.toLowerCase()}, ${query.toLowerCase()} news, ${query.toLowerCase()} updates, ${query.toLowerCase()} latest news, ${query.toLowerCase()} image, ${query.toLowerCase()} video`;

    return {
      lang: response[0]?.hostid?.indexOf("317") !== -1 ? "HIN" : "EN",
      title,
      keywords: keywords,
      news_keywords: "",
      description,
      canonical,
      authors,
      agency,
      noindex: "",
      actualURL: "",
      url: "",
      type: "topic",
      image,
      inLanguage: "en",
      date: response[0]?.effectivedate ?? "",
      updated: response[0]?.effectivedate ?? "",
      articleSection: response[0]?.parenttitle ?? "",
      hostid: response[0]?.hostid[0] ?? 153,
      langInfo: "",
      noindexFollow: "",
      expiry: response[0]?.expirydate ?? "",
      sponsored: "",
      maxImgPreview: "",
      subsecnames: "",
      schemaType: "topic",
      schemaMeta: "",
      seoschema: {
        webPage: {
          name: title,
          url: canonical,
          description,
          publisher: {
            type: "NewsMediaOrganization",
            name: "Economic Times",
            url: "https://m.economictimes.com",
            logo: {
              type: "ImageObject",
              url: "https://img.etimg.com/photo/17952959.cms"
            }
          }
        },
        newsArticle: {
          inLanguage: "en",
          keywords: "",
          headline: response[0]?.title ?? "",
          description,
          name: response[0]?.title ?? "",
          url: canonical,
          mainEntityOfPage: canonical,
          articleSection: "",
          articleBody: description,
          image: {
            type: "ImageObject",
            url: "https://img.etimg.com/thumb/msid-Rahul gandhi,width-1070,height-580,overlay-economictimes/photo.jpg",
            height: "900",
            width: "1600"
          },
          author: {
            type: "Thing",
            name: "ET Online"
          },
          publisher: {
            type: "Organization",
            name: "Economic Times",
            logo: {
              type: "ImageObject",
              url: "https://img.etimg.com/thumb/msid-76939477,width-600,height-60,quality-100/economictimes.jpg",
              width: "600",
              height: "60"
            }
          }
        }
      },
      breadcrumb: [
        {
          title: "Business News",
          url: "https://economictimes.indiatimes.com/"
        },
        {
          title: response[0]?.title ?? ""
        }
      ]
    };
  } catch (e) {
    console.log("Err seoDetails: ", e);
  }
};

export const topicJSON = async ({ param, isCacheBrust, callType }) => {
  try {
    const query = callType == "Func" ? param.slice(1, 2).toString().replace(/-/g, " ") : param[0];
    const tab = callType == "Func" ? param.slice(2, 3).toString() : param[1] ? param[1] : "";
    const cacheKey = `knowledgesearch_topic_${query}_${tab}`;
    const result: ApiResponse = await ETCache(cacheKey, fetchApiData.bind(null, query, tab), 14400, isCacheBrust);

    const versionControl: VersionControl = await version_control(isCacheBrust);
    versionControl.dfp = {
      andbeyond: {
        adSlot: "/7176/ET_MWeb/ET_MWeb_ROS/ET_Mweb_ROS_Andbeyond_1x1",
        adSize: [[1, 1]]
      },
      atf: {
        adSlot: "/7176/ET_MWeb/ET_Mweb_Articlelist/ET_Mweb_AL_PT_ATF",
        adSize: [
          [320, 50],
          [320, 100],
          [468, 60],
          [728, 90]
        ]
      },
      fbn: {
        adSlot: "/7176/ET_MWeb/ET_Mweb_Articlelist/ET_Mweb_AL_PT_FBN",
        adSize: [
          [320, 50],
          [468, 60],
          [728, 90]
        ]
      },
      mrec: {
        adSlot: "/7176/ET_MWeb/ET_Mweb_Articlelist/ET_Mweb_AL_Mrec",
        adSize: [
          [300, 250],
          [336, 280],
          [250, 250]
        ]
      },
      mrec1: {
        adSlot: "/7176/ET_MWeb/ET_Mweb_Articlelist/ET_Mweb_AL_Mrec1",
        adSize: [
          [300, 250],
          [336, 280],
          [250, 250]
        ]
      }
    };
    return {
      parameters: {
        et: result?.header?.et ? unixToDate(result?.header?.et) : "",
        potime: result?.header?.potime ?? "",
        curpg: "1",
        platform: "wap",
        query: query,
        type: "topic",
        isCacheBrust,
        ...(typeof tab !== "undefined" && { tab: tab })
      },
      searchResult: result?.response ? [searchResult(result.response)] : [],
      version_control: versionControl,
      seo: seoDetails(result.response, query, tab)
    };
  } catch (e) {
    console.log("Err pageJSON: ", e);
  }
};
