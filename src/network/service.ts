import { isHostPreprod, getParameterByName, getApiUrl } from "../utils/utils";
import axios from "axios";

const headerWhiteList = ["X-FORWARDED-FOR", "X-ISBOT", "fullcontent"];

export const get = (api, params = {}, request: any = {}, config: any = {}) => {
  try {
    let apidomain = "";
    let hostByParams = "";
    if (window.__isBrowser__) {
      const apidomainParam = getParameterByName("apidomain");
      apidomain = apidomainParam ? apidomainParam : apidomain;
      hostByParams = location.host;
    } else if (request && request.query && request.query.apidomain) {
      apidomain = request.query.apidomain;
      hostByParams = request.headers.host;
    }
    if (!apidomain) {
      // keep pre-prod api for pre-prod ui
      // rest all will behave conventionally
      apidomain =
        (hostByParams &&
          (hostByParams.indexOf("etpwapre.economictimes.com") > -1 ||
            hostByParams.indexOf("etpwa.economictimes.com") > -1)) ||
        isHostPreprod()
          ? "https://etpwaapipre.economictimes.com/"
          : "";
    }

    const url = getApiUrl(api, params, 0, apidomain);
    if (!config.headers) {
      config["headers"] = {};
    }

    if (
      window.__isBrowser__ &&
      params &&
      params["type"] &&
      (params["type"] === "article" || params["type"] === "primearticle")
    ) {
      //   if (univCookies() && univCookies().get('OTR')) {
      //     config['headers']['OTR'] = univCookies().get('OTR');
      //   }
    }
    if (request && request.headers) {
      for (const header in request.headers) {
        if (headerWhiteList.indexOf(header) > -1) {
          config["headers"][header] = request.headers[header];
        }
      }
    }
    return axios.get(url, config);
  } catch (e) {
    console.log("error in get request", e);
  }
};

export const post = (api, params = {}, payload, callback, config = {}) => {
  const url = getApiUrl(api, params, 0);
  return axios.request({
    method: "POST",
    url,
    responseType: "json",
    data: payload,
    ...config
  });
};

export default {
  get,
  post
};
