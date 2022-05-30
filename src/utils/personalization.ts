import Fingerprint2 from "fingerprintjs2";
import APIS_CONFIG from "network/config.json";
import service from "network/service";
import { APP_ENV, getCookie, setCookieToSpecificTime } from "utils";
// require("isomorphic-fetch");

const API_SOURCE = 2;

export const generateFpid = (isLogin, cb, shouldNotLog, artData = {}) => {
  new Fingerprint2.get((components) => {
    const values = components.map((component) => component.value);
    const murmur = Fingerprint2.x64hash128(values.join(""), 31); // an array of components: {key: ..., value: ...}
    processFingerprint(murmur, isLogin, cb, shouldNotLog, artData);
  });
};

export const processFingerprint = (data, isLogin, cb, shouldNotLog, artData) => {
  //   univCookies().set("fpid", data, { domain: "economictimes.com" });
  setCookieToSpecificTime("fpid", data, 365, null);

  if (isLogin) {
    createPeuuid(data, cb, shouldNotLog, artData);
  } else {
    createPfuuid(data, cb, shouldNotLog, artData);
  }
};

export const createPfuuid = (fpid, cb, shouldNotLog, artData) => {
  const url = APIS_CONFIG.PERSONALISATION[APP_ENV];
  const params = {
    type: 7,
    source: API_SOURCE
  };
  const headers = {
    "Content-type": "application/json",
    Authorization: fpid,
    withCredentials: true
  };
  service
    .get({ url, params, withCredentials: true, headers })
    .then((res) => {
      if (res && res.data && res.data.id != 0) {
        const pfuuid = res.data.id;
        // univCookies().set("pfuuid", pfuuid, {
        //   domain: "economictimes.com"
        // });
        setCookieToSpecificTime("pfuuid", pfuuid, 365, null);
        if (typeof cb == "function") {
          cb(pfuuid);
        }
        if (!shouldNotLog) {
          const personalisedObj = {
            id: pfuuid,
            articleData: artData,
            isLogin: 0
          };
          activityLogger(personalisedObj);
        }
      }
    })
    .catch((e) => console.log("error in createPfuuid", e));
};

const createPeuuid = (fpid, cb, shouldNotLog, artData) => {
  const params = {
    type: 0,
    source: API_SOURCE
  };
  const url = APIS_CONFIG.PERSONALISATION[APP_ENV];
  const headers = {
    "Content-type": "application/json"
  };

  service
    .get({ url, params, withCredentials: true, headers })
    .then((res) => {
      if (res && res.data && res.data.id != 0) {
        const peuuid = res.data.id;
        // univCookies().set("peuuid", peuuid, { domain: "economictimes.com" });
        setCookieToSpecificTime("peuuid", peuuid, 365, null);
        if (!shouldNotLog) {
          const personalisedObj = {
            id: peuuid,
            articleData: artData,
            isLogin: 1
          };
          activityLogger(personalisedObj);
        }
        if (typeof cb == "function") {
          cb(peuuid);
        }
      }
    })
    .catch((e) => console.log("error in createPeuuid", e));
};

export const activityLogger = (dataObj) => {
  const url = APIS_CONFIG.USER_ACTIVITY;

  let userObj = {};
  const articleData =
    dataObj &&
    dataObj.articleData &&
    dataObj.articleData["searchResult"] &&
    dataObj.articleData["searchResult"][0]["data"];
  const msid = dataObj && dataObj.articleData && dataObj.articleData.parameters && dataObj.articleData.parameters.msid;
  if (articleData) {
    let subsecnames = [];
    let source = 18;
    let primeid = 0;
    if (articleData && articleData.subsecnames) {
      subsecnames = [
        articleData.subsecnames.subsecname1,
        articleData.subsecnames.subsecname2,
        articleData.subsecnames.subsecname3
      ];
    }
    if (dataObj && dataObj.articleData && dataObj.articleData.parameters && dataObj.articleData.parameters.type) {
      const type = dataObj.articleData.parameters.type;
      if (type == "article") {
        source = 18;
        primeid = articleData.prime ? 100 : 0;
      }
      if (type == "primearticle") {
        source = 12;
        primeid = articleData.behindLogin ? 200 : 100;
      }
    }
    userObj = {
      uuid: dataObj.id,
      ssoId: getCookie("ssoid"),
      source,
      userIdType: getCookie("ssoid") ? 0 : 7,
      pageUrlDetail: {
        articleName: articleData && articleData.title,
        assetType: "Story",
        header: "m.economictimes.com",
        isDefaultPage: false,
        msid,
        primeid,
        pageName: "articleshow",
        referrer: document.referrer,
        url: location.href,
        sections: subsecnames
      }
    };
  } else if (dataObj) {
    userObj = {
      uuid: dataObj.id,
      ssoId: getCookie("ssoid"),
      source: 18,
      userIdType: getCookie("ssoid") ? 0 : 7,
      pageUrlDetail: {
        assetType: "Story",
        header: "m.economictimes.com",
        isDefaultPage: false,
        referrer: document.referrer,
        url: location.href,
        sections: []
      }
    };
  }

  const headers = {
    "Content-Type": "application/json"
  };

  service
    .post({ url, userObj, withCredentials: true, headers })
    .then((res) => {
      console.log("activityLogger", res);
    })
    .catch((err) => console.log("error in activityLogger", err));
};

export default {
  generateFpid,
  activityLogger,
  createPfuuid,
  createPeuuid,
  processFingerprint
};
