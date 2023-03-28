import Service from "../network/service";
import APIS_CONFIG from "../network/config.json";
import { APP_ENV } from "../utils";

export const fetchShortsVideos = async () => {
  try {
    const url = APIS_CONFIG.etshorts[APP_ENV];
    const result = await Service.get({
      url,
      payload: {},
      params: {
        feedtype: "etjson",
        ref: "pwaapi"
      }
    });

    console.log({ result });

    return result.data;
  } catch (e) {
    console.log("Err fetchApiData: ", e);
  }
};
