import { APP_ENV, saveLogs } from "../utils";
import axios from "axios";
import crypto from "crypto";

const headerWhiteList = ["X-FORWARDED-FOR", "X-ISBOT", "fullcontent"];

interface JCMSAuthToken {
  createdAt: number;
  success: boolean;
}

interface AuthConfig {
  secretKey: string;
  tenentId: number;
  url: string;
  defaultSecretKey: string;
  expiry: number;
}

const AUTH: AuthConfig = {
  secretKey: "Q2s3OwRlSKWL1PIuY2+30rWnzFwIVAw96FXK6QJRmEA=",
  tenentId: 2,
  url: `indweller.timesinternet.in/create/accesstoken`,
  defaultSecretKey: "Vcb+kdRDHGyvSgnHUwXsGKFVbBQ=",
  expiry: 12 * 60 * 60 * 1000 // 12 hours
};

const getURL = (): string => {
  const stg = APP_ENV == "development" ? "stg" : "";
  return `https://${stg}${AUTH.url}`;
};

const isJCMSDomain = (url) => {
  const domainArr = ["jcmssolr.indiatimes.com", "cloudservices.indiatimes.com"];
  return domainArr.some((domain) => url.includes(domain));
};

const getEncodedSecretKey = async (dateString: string, AUTH: AuthConfig): Promise<string> => {
  let encodedSecretKey = "";
  try {
    const digest = `${"application/json" + "\n"}${dateString}\n${AUTH.secretKey}`;
    const secretKeyBase64 = Buffer.from(AUTH.secretKey, "base64");
    encodedSecretKey = crypto.createHmac("SHA1", secretKeyBase64).update(digest).digest("base64");
  } catch (e) {
    console.log("error in getEncodedSecretKey", e);
    encodedSecretKey = AUTH.defaultSecretKey; // default api key
    saveLogs({ type: "jcms auth token error - no api key generated, using default api key", apiKey: encodedSecretKey });
  }
  return encodedSecretKey;
};

const fetchJCMSAuthToken = async (cb: (error: Error | null, response?: JCMSAuthToken) => void): Promise<void> => {
  try {
    const currentDate = new Date().toDateString();
    const dateArr = currentDate.split(" ");
    const dateString = `${dateArr[2]} ${dateArr[1]} ${dateArr[3]}`;
    const apiKey = await getEncodedSecretKey(dateString, AUTH);

    const url = getURL();
    // check environment
    const envType = APP_ENV == "production" ? "prod" : "dev";

    // set headers
    const headers: HeadersInit = {
      "Api-Key": apiKey,
      "Host-Id": "153",
      "Tenant-Id": AUTH.tenentId.toString(), // tenant id for ET
      Date: dateString,
      "Content-Type": "application/json"
    };

    // set raw data
    const body = JSON.stringify({ envType, tenantId: 2, hostId: 153 });
    // make post request
    try {
      const response = await fetch(url, { method: "POST", headers, body });
      const data = await response.json();
      if (data.success) {
        cb(null, data.success);
      } else {
        cb(new Error("Failed to fetch JCMS auth token"));
      }
    } catch (error) {
      console.log("error in fetchJCMSAuthToken", error);
      cb(error);
    }
  } catch (error) {
    console.log("error in fetchJCMSAuthToken", error);
    cb(error);
  }
};

const getJCMSAuthToken = async (config) => {
  const url = getApiUrl(config, 0);
  if (isJCMSDomain(url)) {
    // Multi tenancy validation
    // To Do: Server restart, refetching auth logic
    const jcmsAuth = global.jcmsAuth || {};
    const currentTime = Date.now();
    const isTokenExpired = currentTime > (jcmsAuth.timestamp || currentTime) + AUTH.expiry;
    if (!jcmsAuth.timestamp || isTokenExpired) {
      await fetchJCMSAuthToken(
        (
          err,
          authResponse = {
            createdAt: 0,
            success: false
          }
        ) => {
          if (err) {
            saveLogs({
              type: "jcms auth token error",
              data: JSON.stringify(err),
              jcmsAuth: JSON.stringify(jcmsAuth),
              request: JSON.stringify(config)
            });
          } else {
            // set auth token globally
            global["jcmsAuth"] = {
              ...authResponse,
              timestamp: authResponse.createdAt || currentTime
            };
          }
        }
      );
    }
    return {
      "tenant-id": AUTH.tenentId,
      "access-key": (global.jcmsAuth && global.jcmsAuth["accessToken"]) || AUTH.defaultSecretKey,
      "env-type": APP_ENV == "production" ? "prod" : "dev"
    };
  } else {
    return {};
  }
};

const getApiUrl = (config, index) => {
  const { api = {}, url, params } = config;
  const { type = "" } = params;
  const { path } = api;
  const env = APP_ENV || "production";

  // if (typeof window === "undefined" && api.dns && api.dns[env][1]) {
  //   // if server, use origin url
  //   index = 1;
  // }

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

export const post = async (config) => {
  const { payload } = config;
  const url = getApiUrl(config, 0);
  const JCMSAuthHeader = await getJCMSAuthToken(config);
  if (Object.keys(JCMSAuthHeader).length > 0) {
    config.headers = {
      ...config.headers,
      ...JCMSAuthHeader
    };
  }

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
