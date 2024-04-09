import * as ga from "./ga";
import { loadScript } from "utils";
declare global {
  interface Window {
    _ibeat_track: any;
    COMSCORE: any;
  }
}
export function loadAndBeyond() {
  try {
    const objVc = window.objVc || {};
    const urlParams = window.location.search ? window.location.search : "";
    if (
      urlParams.indexOf("utm_medium=display_aff") == -1 &&
      typeof objVc != "undefined" &&
      objVc.andbeyond_wap &&
      objVc.andbeyond_wap == "1"
    ) {
      typeof loadScript != "undefined" && loadScript("https://rtbcdn.andbeyond.media/prod-global-34387.js");
    }
  } catch (e) {
    console.log("loadAndBeyond:" + e);
  }
}
export function InitialJsOnAppLoad(): void {
  console.log("InitialJsOnAppLoad called");
  try {
    document.addEventListener("gaLoaded", () => {
      ga.gaObserverInit();
    });

    window._ibeat_track = { ct: getIbeatContentType() };
    typeof loadAndBeyond != "undefined" && loadAndBeyond();
  } catch (error) {
    console.error("Error in InitialJsOnAppLoad: ", error);
  }
}

export function callJsOnRouteChange(url?): void {
  console.log("callJsOnRouteChange called");
  ga.pageview(url);
  window._ibeat_track.ct = getIbeatContentType();
  window.COMSCORE && window.COMSCORE.beacon({ c1: "2", c2: "6036484" });
}

// export function gdprCheck(geoCode) {
//   let geoStatus = geolocation !== "5";
//   if (geoCode) {
//     geoStatus = geolocation == geoCode;
//   }
//   return geoStatus;
// }

function getIbeatContentType() {
  let ibeatContentType = 20;
  if (typeof window !== "undefined" && document && document.URL) {
    if (document.URL.indexOf("/articleshow/") !== -1) {
      ibeatContentType = 1;
    }

    if (document.URL.indexOf("/videoshow/") !== -1) {
      ibeatContentType = 2;
    }

    if (document.URL.indexOf("/topic/") !== -1) {
      ibeatContentType = 200;
    }
  }
  return ibeatContentType;
}
