import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { APP_ENV, getArticleType, getMSUrl, unixToDate } from "../../../utils";
import { version_control } from "../../../page_api/version_control";

const getTypeArr = (param) => {
  try {
    const tab = typeof param[1] != "undefined" ? param[1].toLowerCase() : "";

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
const someAsyncOperation = (param) => {
  try {
    const url = APIS_CONFIG.knowledgesearch[APP_ENV];

    return Service.post({
      url,
      payload: {
        searchTerms: [param[0]],
        hostid: [153],
        rows: 30,
        typeid: getTypeArr(param)
      },
      params: {}
    });
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

const seoDetails = (response, param) => {
  try {
    const title = `${param[0]}: Latest News &amp; Videos, Photos about ${param[0]} | The Economic Times`,
      description = `${param[0]} Latest Breaking News, Pictures, Videos, and Special Reports from The Economic Times. ${param[0]} Blogs, Comments and Archive News on Economictimes.com`,
      canonical = `https://economictimes.indiatimes.com/topic/${param[0].replace(/\W+/g, "-").toLowerCase()}`,
      authors = response[0]?.author ? response[0].author : response[0]?.agency ? response[0].agency : "ET Online",
      agency = response[0]?.agency ? response[0].agency : "ET Online",
      image = `https://img.etimg.com/thumb/msid-65498029,width-672,resizemode-4/et-logo.jpg`,
      keywords = `${param[0].toLowerCase()}, ${param[0].toLowerCase()} news, ${param[0].toLowerCase()} updates, ${param[0].toLowerCase()} latest news, ${param[0].toLowerCase()} image, ${param[0].toLowerCase()} video`;

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
      expiry: response[0].expirydate,
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

export const pageJSON = async (param) => {
  try {
    const result = await someAsyncOperation(param);
    let data = {
      header: {
        et: String
      },
      response: Object
    };
    data = result.data;

    return {
      parameters: {
        et: data.header.et,
        curpg: "1",
        platform: "wap",
        query: param[0],
        type: "topic",
        ...(typeof param[1] !== "undefined" && { tab: param[1] })
      },
      searchResult: [searchResult(data.response)],
      version_control: {},
      seo: seoDetails(data.response, param)
    };
  } catch (e) {
    console.log("Err pageJSON: ", e);
  }
};

export default async function handler(req, res, query = null) {
  try {
    const { param } = query || req.query;
    //res.status(200).json({ data })
    res.status(200).json(await pageJSON(param));
  } catch (err) {
    console.log("errr---", err);
    res.status(500).json({ error: "failed to fetch data" });
  }
}
