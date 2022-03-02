import * as ga from './ga';
declare global {
  interface Window { 
    adDivIds: any;
  }
}
export function InitialJsOnAppLoad(): void {
  console.log("InitialJsOnAppLoad called");
  try {
    window["arrPageAds"] = [];
    window.adDivIds = [];
    document.addEventListener('gaLoaded', ()=> {
      ga.gaObserverInit();
    });
    ga.growthRxInit();
  } catch (error) {
    console.error("Error in InitialJsOnAppLoad: ", error);
  }
}

export function callJsOnRouteChange(url?): void {
  console.log("callJsOnRouteChange called");
  window.adDivIds = [];
  ga.pageview(url);
}
