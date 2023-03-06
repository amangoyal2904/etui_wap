import { encodeQueryData, getParameterByName, APP_ENV } from "../utils";
import axios from "axios";
import { isBrowser } from "utils";

const headerWhiteList = ["X-FORWARDED-FOR", "X-ISBOT", "fullcontent"];

const getApiUrl = (config, index) => {
  const { api = {}, url, params } = config;
  const { type = "" } = params;
  const { path } = api;
  const env = APP_ENV || "production";

  if (typeof window === "undefined" && api.dns && api.dns[env][1]) {
    // if server, use origin url
    index = 1;
  }

  const domain = api.dns ? api.dns[env][index] || api.dns[env][0] : "";
  const urlPath = (type && path == "reactfeed" && `reactfeed_${type}.cms`) || api.path;
  const completeURL = url || domain + urlPath;
  return completeURL;
};

export const get = (config) => {
  try {
    const url = getApiUrl(config, 0);
    if (!config.headers) {
      config["headers"] = {};
    }
    const instance = axios.create({
      headers: {
        "Content-Type": "application/json"
      }
    });
    return instance.get(url, config);
  } catch (e) {
    console.log("error in get request", e);
  }
};

export const post = (config) => {
  const { payload } = config;
  const url = getApiUrl(config, 0);
  console.log("url-----", url);
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
