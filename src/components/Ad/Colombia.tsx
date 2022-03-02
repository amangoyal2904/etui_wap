import { NextPage } from "next";
import Utility from "../../utils/utils"
import { useRouter } from 'next/router';
import styles from "./styles.module.scss";
import {
    TEST_ID_CTN_HOME,
    TEST_COLOMBIA_DFP_HOME,
    TEST_COLOMBIA_DFP_ARTICLESHOW,
  } from "utils/common";
import { useEffect } from "react";

interface Props {
    index?: number,
    id?: string,
    currentMSID?: number,
    hidelabel?: any,
    footerAd?: any
  }
declare global {
    interface Window {
        adDivIds: any;
        colombia: any;
    }
}

const Colombia:NextPage<Props> = function(props) {
    let { index, id, currentMSID } = props;
    const divId = `div-clmb-ctn-${id}-${index}${currentMSID ? '-' + currentMSID : ''}`;
    const router = useRouter();
    let crPath = router.pathname;
    const pageType:any = Utility.pageType(crPath);
    let colombia_dfpslot = '';
    let colombia_type = '';
    let browsiSec = [
      "7771250",
      "107115",
      "13352306",
      "837555174",
      "13357270",
      "/nri",
      "/jobs",
      "/industry",
      "/personal-finance",
      "/wealth",
      "/tech",
    ];
    function renderColombia() {
        if (window.colombia && !(window.adDivIds.indexOf(divId) > -1) ) {
            window.adDivIds.push(divId);
            window.colombia.refresh(divId);
            window.colombia.update();
        }
    }
    useEffect(() => {
        renderColombia();
    }, [])
    let el = browsiSec.find((a) => crPath.includes(a));
    if (!el) {
      if (id == "358378") {
        colombia_dfpslot = TEST_COLOMBIA_DFP_ARTICLESHOW;
        colombia_type = "dfp";
      } else if (id === "129185") {
        colombia_dfpslot = '/7176/ET_MWeb/ET_Mweb_Home/ET_Mweb_HP_Bid_Experiment_320';
        colombia_type = "dfp";
      } else if (id === "208234") {
        colombia_dfpslot = '/7176/ET_MWeb/ET_Mweb_Home/ET_Mweb_HP_Bid_Experiment_320';
        colombia_type = "dfp";
      } else if (id === "129178") {
        colombia_dfpslot = '/7176/ET_MWeb/ET_MWeb_ROS/ET_Mweb_ROS_Bid_Experiment_320';
        colombia_type = "dfp";
      } else if (id === "208235") {
        colombia_dfpslot = '/7176/ET_MWeb/ET_MWeb_ROS/ET_Mweb_ROS_Bid_Experiment_320';
        colombia_type = "dfp";
      }
    }

    if (
        router.asPath.indexOf("?adtest=1") > -1 &&
        id == "208234"
    ) {
      id = TEST_ID_CTN_HOME;
      colombia_dfpslot = TEST_COLOMBIA_DFP_HOME;
      colombia_type = "dfp";
    }
   let mgidGeo = Utility.mgidGeoCheck("mid") ? Utility.mgidGeoCheck("mid") : false;
   if (mgidGeo && id == "358378" && pageType == "articleshow") {
     return (
        (
         <div
           className={`${styles.colAdContainer} ${
             props.footerAd ? styles.footerAd : ""
           } ${
             pageType === "home" ||
             pageType === "techhome" ||
             pageType == "articlelist"
               ? styles.homecolombia
               : styles.articleColombia
           } adContainer ${props.hidelabel ? styles.hidelabel : ""} colAd`}
         >
           <div id="M769007ScriptRootC1264385"></div>
         </div>
       )
     );
   } else {
     return (
        (
         <div
           className={`${styles.colAdContainer} ${
             props.footerAd ? styles.footerAd : ""
           } ${
             (pageType == "home" ||
             pageType == "techhome" ||
             pageType == "articlelist")
               ? styles.homecolombia
               : styles.articleColombia
           } adContainer ${props.hidelabel ? styles.hidelabel : ""} colAd`}
         >
           <div
             className="colombiaAd colombia"
             data-section="0"
             data-slot={id}
             id={divId}
             data-position={
               props.currentMSID
                 ? props.currentMSID
                 : index
             }
             data-dfpslot={colombia_dfpslot}
             data-type={colombia_type}
           />
         </div>
       )
     );
   } 

}

export default Colombia;