import * as ga from "./ga";
declare global {
  interface Window {
    adDivIds: string[];
    isprimeuser: boolean;
  }
}

export function InitialJsOnAppLoad(): void {
  console.log("InitialJsOnAppLoad called");
  try {
    window["arrPageAds"] = [];
    window.adDivIds = [];
    document.addEventListener("gaLoaded", () => {
      ga.gaObserverInit();
    });
    ga.growthRxInit();

    objInts.afterPermissionCall(() => {
      window.isprimeuser = objInts.permissions.indexOf("subscribed") > -1;
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
