import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { APP_ENV, getKeyData } from "../utils";
import ETCache from "../utils/cache";

const fetchApiData = async () => {
  const url = APIS_CONFIG.version_control[APP_ENV];
  //console.log("fresh hit version_control api");
  const result = await Service.get({
    url,
    payload: {},
    params: {
      feedtype: "etjson",
      ref: "pwaapi"
    }
  });

  return getKeyData(result.data);
};

export const version_control = (isCacheBrust) => {
  const cacheKey = "etnext_version_control";
  return ETCache(cacheKey, fetchApiData, 3600, isCacheBrust);
};
