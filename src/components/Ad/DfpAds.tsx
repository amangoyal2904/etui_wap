import { FC, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
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
    adDivIdSlots: any;
  }
}
interface AdInfoProps {
  adInfo: {
    key: string;
    index?: number | string;
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
  const router = useRouter();
  const isTopicPage = router.asPath.indexOf("/topic/") !== -1;

  let divId = key;
  if (key) {
    if (key.indexOf("mrec") != -1) {
      divId = `${key}${index}`;
    }
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.googletag ? loadDfpAds() : document.addEventListener("gptLoaded", loadDfpAds);

      return () => {
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
          if (!window.adDivIdSlots) {
            window.adDivIdSlots = {};
          }
          let adSize = objVc.dfp[key] && objVc.dfp[key]["adSize"];
          adSize = adSize && (typeof adSize == "string" ? JSON.parse(adSize) : adSize);
          let dimension = customDimension ? JSON.parse(customDimension) : adSize ? adSize : [320, 250];
          dimension = Array.isArray(dimension[0]) ? dimension[0] : dimension;
          const adSlot = customSlot ? customSlot : objVc.dfp[key] && objVc.dfp[key]["adSlot"];
          slot = googleTag.defineSlot(adSlot, dimension, divId);
          window.adDivIdSlots[divId] = slot;
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
          // googleTag
          //   .pubads()
          //   .setTargeting("sg", __auds)
          //   .setTargeting("HDL", _hdl)
          //   .setTargeting("ARC1", _arc1)
          //   .setTargeting("Hyp1", _hyp1)
          //   .setTargeting("article", _article)
          //   .setTargeting("BL", _bl + "")
          //   .setTargeting("Keyword", _keyword)
          //   .setTargeting("ArticleID", currMsid);

          !!__auds && googleTag.pubads().setTargeting("sg", __auds);
          !!_hdl && googleTag.pubads().setTargeting("HDL", _hdl);
          !!_arc1 && googleTag.pubads().setTargeting("ARC1", _arc1);
          !!_hyp1 && googleTag.pubads().setTargeting("Hyp1", _hyp1);
          !!_article && googleTag.pubads().setTargeting("article", _article);
          !!_bl && googleTag.pubads().setTargeting("BL", _bl + "");
          !!_keyword && googleTag.pubads().setTargeting("Keyword", _keyword);
          !!currMsid && googleTag.pubads().setTargeting("ArticleID", currMsid);

          if (isTopicPage) {
            googleTag.pubads().enableLazyLoad({
              // Fetch slots within 5 viewports.
              fetchMarginPercent: 0,
              // Render slots within 2 viewports.
              renderMarginPercent: 0,
              // Double the above values on mobile, where viewports are smaller
              // and users tend to scroll faster.
              mobileScaling: 2.0
            });
          } else {
            googleTag.pubads().enableSingleRequest();
          }
          googleTag.enableServices();
          googleTag.display(divId);
        }
      });
    }
  };

  return <div id={divId}></div>;
};

export default DfpAds;
