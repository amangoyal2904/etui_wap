import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { APP_ENV } from "../utils";

interface FinalJSON {
  key: string;
}

const apiHit = () => {
  const url = APIS_CONFIG.version_control[APP_ENV];
  return Service.get({
    url,
    payload: {},
    params: {
      feedtype: "etjson"
    }
  });
};

export const version_control = async () => {
  const result = await apiHit();
  const FinalJSON = [];

  for (const [key, value] of Object.entries(result.data)) {
    if (value && value["@react"] == 1) {
      FinalJSON.push({
        key: value["#text"]
      });
    }
    console.log("result-key--", key);
    console.log("result-value--", value);
  }
};
