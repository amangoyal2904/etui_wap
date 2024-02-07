import * as ga from "./ga";

declare global {
  interface Window {
    _ibeat_track: any;
  }
}

export function InitialJsOnAppLoad(): void {
  console.log("InitialJsOnAppLoad called");
  try {
    document.addEventListener("gaLoaded", () => {
      ga.gaObserverInit();
    });

    window._ibeat_track = { ct: getIbeatContentType() };
  } catch (error) {
    console.error("Error in InitialJsOnAppLoad: ", error);
  }
}

export function callJsOnRouteChange(url?): void {
  console.log("callJsOnRouteChange called");
  ga.pageview(url);
  window._ibeat_track.ct = getIbeatContentType();
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
