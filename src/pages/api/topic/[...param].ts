import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { APP_ENV, getArticleType, getMSUrl, unixToDate } from "../../../utils";
import { version_control } from "../../../apiUtils/version_control";
import ETCache from "../../../utils/cache";

const getTypeArr = (param) => {
  try {
    const tab = typeof param[1] != "undefined" ? param[1].toLowerCase() : "all";

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
const fetchApiData = async (query, tab = "all") => {
  try {
    const url = APIS_CONFIG.knowledgesearch[APP_ENV];
    console.log("fresh hit topic api");
    const result = await Service.post({
      url,
      payload: {
        searchTerms: [query],
        hostid: [153],
        rows: 30,
        typeid: getTypeArr(tab)
      },
      params: {}
    });

    return result.data;
  } catch (e) {
    console.log("Err someAsyncOperation: ", e);
  }
};

const searchResult = (response) => {
  try {
    const resultData = [];
    for (let i = 0; i < response.length; i++) {
      const { title, synopsis, hasThumb, effectivedate, seopath, msid } = response[i];

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
        title: title,
        url: getUrl,
        type: getArticleType(getUrl),
        date: unixToDate(effectivedate) || null,
        synopsis,
        ...(hasThumb == 1 && { img: `https://img.etimg.com/thumb/msid-${msid},width-200,height-150/${seopath}.jpg` })
      });
    }
    return {
      name: "topic",
      data: resultData
    };
  } catch (e) {
    console.log("Err searchResult: ", e);
  }
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
      lang: response[0]?.hostid.indexOf("317") !== -1 ? "HIN" : "EN",
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
      date: response[0].effectivedate || "",
      updated: response[0].effectivedate || "",
      articleSection: response[0].parenttitle || "",
      hostid: response[0].hostid[0],
      langInfo: "",
      noindexFollow: "",
      expiry: response[0].expirydate || "",
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
          headline: response[0]?.title,
          description,
          name: response[0]?.title,
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
          title: response[0]?.title
        }
      ]
    };
  } catch (e) {
    console.log("Err seoDetails: ", e);
  }
};

export const pageJSON = async (param, callType = "Func") => {
  console.log("===================================");
  console.log("param---", param);
  console.log("===================================");
  try {
    const query = callType == "Func" ? param.slice(1, 2).toString().replace(/-/g, " ") : param[0];
    const tab = callType == "Func" ? param.slice(2, 3).toString() : param[1];
    //const result = await someAsyncOperation(query, tab);
    const cacheKey = ETCache.prepareKey(`knowledgesearch_topic_${query}_${tab}`);
    const result = await ETCache.checkCache(cacheKey, fetchApiData.bind(null, query, tab), 100);
    let data = {
      header: {
        et: String
      },
      response: Object
    };
    data = result;

    const versionControl = await version_control();
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
        et: data.header.et,
        curpg: "1",
        platform: "wap",
        query: query,
        type: "topic",
        ...(typeof tab !== "undefined" && { tab: tab })
      },
      searchResult: [searchResult(data.response)],
      version_control: versionControl,
      seo: seoDetails(data.response, query, tab)
    };
  } catch (e) {
    console.log("Err pageJSON: ", e);
  }
};

export default async function handler(req, res, query = null) {
  try {
    const { param } = query || req.query;
    //res.status(200).json({ data })
    res.status(200).json(await pageJSON(param, "Api"));
  } catch (err) {
    console.log("errr---", err);
    res.status(500).json({ error: "failed to fetch data" });
  }
}
