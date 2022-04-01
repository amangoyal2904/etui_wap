import { NextPage } from "next";
import { useEffect } from "react";

interface Props {
  adInfo?: object;
}
declare global {
  interface Window {
    googletag: any;
    extCampaignVal: any;
    ad_refresh: any;
    adDivIds: any;
    _auds: any;
    hdl: any;
    arc1: any;
    hyp1: any;
    article: any;
    bl: any;
    spcKeyword: any;
  }
}

const DfpAds: NextPage<Props> = function (props) {
  const adInfo: any = props.adInfo;
  const { key, index = 0 } = adInfo;
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
        if (
          typeof window.googletag != "undefined" &&
          window.googletag.apiReady
        ) {
          window.googletag.destroySlots();
        }
        document.removeEventListener("gptLoaded", loadDfpAds);
      };
    }
  }, []);
  function loadDfpAds() {
    const googleTag = window.googletag;
    const { adDivIds } = window;
    const { customDimension, currMsid, customSlot } = adInfo;
    const objVc = {
      dfp: {
        atf: {
          adSize: "[[320,50]]",
          adSlot: "/7176/ET_MWeb/ET_Mweb_Home/ET_Mweb_HP_PT_ATF"
        },
        fbn: {
          adSize: "[[[320,50]],[[468,60]],[[728,90]]]",
          adSlot: "/7176/ET_MWeb/ET_Mweb_Home/ET_Mweb_HP_PT_FBN"
        },
        mrec: {
          adSize: "[[[300,250],[336,280],[250,250]]]",
          adSlot: "/7176/ET_MWeb/ET_Mweb_Home/ET_Mweb_HP_PT_MTF"
        },
        mrec1: {
          adSize: "[[[300,250],[336,280],[250,250]]]",
          adSlot: "/7176/ET_MWeb/ET_Mweb_Home/ET_Mweb_HP_PT_Mrec1"
        },
        mrec2: {
          adSize: "[[[300,250],[336,280],[250,250]]]",
          adSlot: "/7176/ET_MWeb/ET_Mweb_Home/ET_Mweb_HP_PT_Mrec2"
        },
        mrec3: {
          adSize: "[[[300,250],[336,280],[250,250]]]",
          adSlot: "/7176/ET_MWeb/ET_Mweb_Home/ET_Mweb_HP_PT_Mrec3"
        }
      }
    };
    console.log("divid", divId, googleTag);
    if (divId && googleTag) {
      googleTag.cmd.push(() => {
        let slot = undefined;
        console.log("came here in push cmd", adDivIds);
        if (!(adDivIds.indexOf(divId) > -1)) {
          adDivIds.push(divId);
          let adSize = objVc.dfp[key] && objVc.dfp[key]["adSize"];
          adSize =
            adSize && (typeof adSize == "string" ? JSON.parse(adSize) : adSize);
          const dimension = customDimension
            ? JSON.parse(customDimension)
            : adSize
            ? adSize
            : [320, 250];
          const adSlot = customSlot
            ? customSlot
            : objVc.dfp[key] && objVc.dfp[key]["adSlot"];
          console.log(
            "adslot",
            adSlot,
            Array.isArray(dimension[0]) ? dimension[0] : dimension,
            divId
          );
          slot = googleTag.defineSlot(
            adSlot,
            Array.isArray(dimension[0]) ? dimension[0] : dimension,
            divId
          );
          if (divId == "mh") {
            window.ad_refresh.push(slot);
          }
        }
        console.log("slot", slot, divId);
        if (slot) {
          // default case
          const __auds =
            typeof window._auds !== "undefined"
              ? window._auds
              : JSON.parse(localStorage.getItem("audienceData"));
          const _hdl = typeof window.hdl !== "undefined" ? window.hdl : "";
          const _arc1 = typeof window.arc1 !== "undefined" ? window.arc1 : "";
          const _hyp1 = typeof window.hyp1 !== "undefined" ? window.hyp1 : "";
          const _article =
            typeof window.article !== "undefined" ? window.article : "";
          const _bl = typeof window.bl !== "undefined" ? window.bl : "";
          const _keyword =
            typeof window.spcKeyword !== "undefined" ? window.spcKeyword : "";

          slot.addService(googleTag.pubads());
          googleTag.pubads().collapseEmptyDivs();
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
          console.log("called ad here");
          googleTag.display(divId);
        }
      });
    }
  }
  return <div id={divId}></div>;
};

export default DfpAds;
