import { NextPage } from "next";
import { useEffect, useState } from "react"

interface Props {
    adInfo?: object
  }
declare global {
    interface Window {
        googletag:any;
        extCampaignVal:any;
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

const DfpAds:NextPage<Props> = function(props) {
    let adInfo:any = props.adInfo;
    let {key, index = 0} = adInfo;
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
                if (typeof window.googletag != "undefined" && window.googletag.apiReady) {
                    window.googletag.destroySlots();
                }
                document.removeEventListener("gptLoaded", loadDfpAds);
            }
        }
    }, []);
    function loadDfpAds() {
        const googleTag = window.googletag;
        let  {adDivIds} = window;
        let {customDimension, currMsid, customSlot, } = adInfo;
        let objVc = {
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
            },
        }
        console.log("divid", divId, googleTag);
        if (divId && googleTag) {
            googleTag.cmd.push(() => {
                let slot = undefined;
                console.log("came here in push cmd", adDivIds);
                if (!(adDivIds.indexOf(divId) > -1)) {
                  adDivIds.push(divId);
                  let adSize = (objVc.dfp[key] && objVc.dfp[key]["adSize"]) ;
                  adSize = adSize && (typeof adSize == 'string' ? JSON.parse(adSize) : adSize);
                  let dimension = customDimension ? JSON.parse(customDimension) : adSize ? adSize : [320, 250];
                  let adSlot = customSlot ? customSlot : objVc.dfp[key] && objVc.dfp[key]["adSlot"];           
                  console.log("adslot", adSlot, Array.isArray(dimension[0]) ? dimension[0]: dimension, divId)
                  slot = googleTag.defineSlot(adSlot, Array.isArray(dimension[0]) ? dimension[0]: dimension, divId);
                  if(divId == "mh"){
                    window.ad_refresh.push(slot);
                  }
                }
                console.log("slot", slot, divId);
                if (slot) {
                  // default case
                  let __auds =
                    typeof window._auds !== "undefined"
                      ? window._auds
                      : JSON.parse(localStorage.getItem("audienceData"));
                  let _hdl = typeof window.hdl !== "undefined" ? window.hdl : "";
                  let _arc1 = typeof window.arc1 !== "undefined" ? window.arc1 : "";
                  let _hyp1 = typeof window.hyp1 !== "undefined" ? window.hyp1 : "";
                  let _article =
                    typeof window.article !== "undefined" ? window.article : "";
                  let _bl = typeof window.bl !== "undefined" ? window.bl : "";
                  let _keyword =
                    typeof window.spcKeyword !== "undefined" ? window.spcKeyword : "";

                  slot.addService(googleTag.pubads());
                  googleTag.pubads().collapseEmptyDivs();
                  if (window.extCampaignVal) {
                    googleTag
                      .pubads()
                      .setTargeting("ref", window.extCampaignVal);
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
    return (
        <div id={divId}></div>
    )

}

export default DfpAds;