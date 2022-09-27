import { FC, useState, useEffect, useCallback } from "react";
import { AND_BEYOND } from "utils/common";
declare global {
  interface Window {
    // eslint-disable-next-line
    googletag: any;
    extCampaignVal: string;
    ad_refresh: string[];
    adDivIds: string[];
    _auds: string[];
    hdl: string;
    arc1: string;
    hyp1: string;
    article: string;
    bl: string;
    spcKeyword: string;
  }
}
interface AdInfoProps {
  adInfo: {
    key: string;
    index?: number;
    currMsid?: number;
    customSlot?: number;
    customDimension?: string;
    subsecnames?: any;
  };
  identifier?: string;
}

const DfpAds: FC<AdInfoProps> = function (props) {
  const { adInfo, identifier } = props;
  const { key, index = 0, subsecnames = {} } = adInfo;

  let divId = key;
  if (key) {
    if (key.indexOf("mrec") != -1) {
      divId = `${key}${index}`;
    }
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.googletag) {
        loadDfpAds();
      } else {
        document.addEventListener("gptLoaded", loadDfpAds);
      }
      return () => {
        window.adDivIds = [];
        if (typeof window.googletag != "undefined" && window.googletag.apiReady) {
          window.googletag.destroySlots();
        }
        document.removeEventListener("gptLoaded", loadDfpAds);
      };
    }
    //eslint-disable-next-line
  }, [divId, identifier]);

  const loadDfpAds = () => {
    const googleTag = window.googletag;
    const { adDivIds } = window;
    const { customDimension, currMsid, customSlot } = adInfo;
    const objVc = window.objVc || {};

    if (divId && googleTag) {
      googleTag.cmd.push(() => {
        let slot = undefined;
        if (!(adDivIds.indexOf(divId) > -1)) {
          adDivIds.push(divId);

          let adSize = objVc.dfp[key] && objVc.dfp[key]["adSize"];
          adSize = adSize && (typeof adSize == "string" ? JSON.parse(adSize) : adSize);
          let dimension = customDimension ? JSON.parse(customDimension) : adSize ? adSize : [320, 250];
          dimension = Array.isArray(dimension[0]) ? dimension[0] : dimension;
          const adSlot = customSlot ? customSlot : objVc.dfp[key] && objVc.dfp[key]["adSlot"];
          slot = googleTag.defineSlot(adSlot, dimension, divId);
          if (divId == "mh") {
            window.ad_refresh.push(slot);
          }
        }

        if (slot) {
          // default case
          const __auds =
            typeof window._auds !== "undefined" ? window._auds : JSON.parse(localStorage.getItem("audienceData"));
          const _hdl = typeof window.hdl !== "undefined" ? window.hdl : "";
          const _arc1 = typeof window.arc1 !== "undefined" ? window.arc1 : "";
          const _hyp1 = typeof window.hyp1 !== "undefined" ? window.hyp1 : "";
          const _article = typeof window.article !== "undefined" ? window.article : "";
          const _bl = typeof window.bl !== "undefined" ? window.bl : "";
          const _keyword = typeof window.spcKeyword !== "undefined" ? window.spcKeyword : "";

          slot.addService(googleTag.pubads());
          googleTag.pubads().collapseEmptyDivs();
          if (typeof subsecnames != "undefined") {
            googleTag
              .pubads()
              .setTargeting("SCN", subsecnames.subsecname1 || "")
              .setTargeting("SubSCN", subsecnames.subsecname2 || "")
              .setTargeting("LastSubSCN", subsecnames.subsecname3 || "");
          }
          if (window.extCampaignVal) {
            googleTag.pubads().setTargeting("ref", window.extCampaignVal);
          }
          googleTag
            .pubads()
            .setTargeting("sg", __auds)
            .setTargeting("HDL", _hdl)
            .setTargeting("ARC1", _arc1)
            .setTargeting("Hyp1", _hyp1)
            .setTargeting("article", _article)
            .setTargeting("BL", _bl + "")
            .setTargeting("Keyword", _keyword)
            .setTargeting("ArticleID", currMsid);

          googleTag.pubads().enableSingleRequest();
          googleTag.enableServices();
          googleTag.display(divId);
        }
      });
    }
  };

  return <div id={divId}></div>;
};

export default DfpAds;
