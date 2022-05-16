import { encodeQueryData, getParameterByName, processEnv } from "../utils/utils";
import axios from "axios";
import { isBrowser } from "utils/utils";

const headerWhiteList = ["X-FORWARDED-FOR", "X-ISBOT", "fullcontent"];
declare global {
  interface Window {
    __APP: {
      env?: string;
      login?: any;
    };
  }
}

const getApiUrl = (config, index) => {
  const { api = {}, url, params } = config;
  const { type = "" } = params;
  const { path } = api;
  const env = processEnv === "test" ? "production" : processEnv;
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
