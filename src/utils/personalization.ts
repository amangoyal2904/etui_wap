import APIS_CONFIG from "network/config.json";
import service from "network/service";
import { APP_ENV, setCookieToSpecificTime } from "utils";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { API_SOURCE_DEVICE } from "./common";

// const API_SOURCE = 2;

export const generateFpid = async (cb) => {
  // Initialize an agent at application startup.
  const fpPromise = FingerprintJS.load();
  // Get the visitor identifier when you need it.
  const fp = await fpPromise;
  const result = await fp.get();
  console.log("check fpid", result.visitorId);
  processFingerprint(result.visitorId, cb);
};

export const processFingerprint = (data, cb) => {
  setCookieToSpecificTime("fpid", data, 365, null, null);
  createPeuuid(cb);
  /*
  if (isLogin) {
  createPeuuid(cb);
  } else {
    createPfuuid(data, cb);
  }
  */
};

const createPeuuid = (cb) => {
  const params = {
    type: 0,
    source: API_SOURCE_DEVICE
  };
  const url = APIS_CONFIG.PERSONALISATION[APP_ENV];
  const headers = {
    "Content-type": "application/json"
  };

  service
    .get({ url, params, withCredentials: true, headers })
    .then((res) => {
      if (res?.data?.id != 0) {
        const peuuid = res.data.id;
        setCookieToSpecificTime("peuuid", peuuid, 365, null, null);
        if (typeof cb == "function") {
          cb(peuuid);
        }
      }
    })
    .catch((e) => console.log("error in createPeuuid", e));
};

/*
export const createPfuuid = (fpid, cb) => {
  const url = APIS_CONFIG.PERSONALISATION[APP_ENV];
  const params = {
    type: 7,
    source: API_SOURCE
  };
  const headers = {
    "Content-type": "application/json",
    Authorization: fpid
  };
  service
    .get({ url, params, withCredentials: true, headers })
    .then((res) => {
      if (res && res.data && res.data.id != 0) {
        const pfuuid = res.data.id;
        setCookieToSpecificTime("pfuuid", pfuuid, 365, null);
        if (typeof cb == "function") {
          cb(pfuuid);
        }
      }
    })
    .catch((e) => console.log("error in createPfuuid", e));
};
*/

export default {
  generateFpid,
  createPeuuid,
  processFingerprint
};
