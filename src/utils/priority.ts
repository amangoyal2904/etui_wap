import * as ga from "./ga";

export function InitialJsOnAppLoad(): void {
  console.log("InitialJsOnAppLoad called");
  try {
    window["arrPageAds"] = [];
    window.adDivIds = [];
    document.addEventListener("gaLoaded", () => {
      ga.gaObserverInit();
    });
  } catch (error) {
    console.error("Error in InitialJsOnAppLoad: ", error);
  }
}

export function callJsOnRouteChange(url?): void {
  console.log("callJsOnRouteChange called");
  window.adDivIds = [];
  ga.pageview(url);
}

// export function gdprCheck(geoCode) {
//   let geoStatus = geolocation !== "5";
//   if (geoCode) {
//     geoStatus = geolocation == geoCode;
//   }
//   return geoStatus;
// }
