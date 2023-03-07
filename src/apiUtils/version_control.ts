import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { APP_ENV, getKeyData } from "../utils";
import ETCache from "../utils/cache";

const fetchApiData = async () => {
  const url = APIS_CONFIG.version_control[APP_ENV];
  const result = await Service.get({
    url,
    payload: {},
    params: {
      feedtype: "etjson"
    }
  });

  return getKeyData(result.data);
};

export const version_control = async () => {
  //const result = await apiHit();
  const cacheKey = ETCache.prepareKey("etnext_version_control");
  return ETCache.checkCache(cacheKey, fetchApiData, 3600);
};
