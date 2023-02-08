import { FC, useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { ET_CUBE_URL } from "../../utils/common";

const Cube: FC = () => {
  const [displayCube, setDisplayCube] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [ifmSrc, setIfmSrc] = useState("");

  const loadCube = () => {
    //console.log("window.optCheck", window.optCheck)
    try {
      if (typeof sessionStorage != "undefined" && !displayCube) {
        const closeCube = sessionStorage.getItem("closeCube");
        const isSubscribed = window.objInts.permissions.indexOf("subscribed") > -1;
        if (closeCube != "1" && !window.optCheck && window.objInts.adType !== "adfree" && !isSubscribed) {
          setIfmSrc(window?.objVc?.global_cube_wap_url ? window?.objVc?.global_cube_wap_url : ET_CUBE_URL);
          setDisplayCube(true);
        } else {
          setDisplayCube(false);
        }
      }
    } catch (e) {
      console.log("Error in cube load", e);
    }
  };

  const intsCallback = () => {
    window.objInts.afterPermissionCall(loadCube);
  };

  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      intsCallback();
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }

    window.addEventListener("load", () => {
      setTimeout(() => {
        setPageLoaded(true);
      }, 1000);
    });

    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
  }, []);

  return (
    <>
      {pageLoaded && displayCube && (
        <iframe
          className={styles.cube}
          src={ifmSrc}
          onLoad={() => {
            try {
              const cubeIframeElm = document.getElementById("cubeFrame") as HTMLIFrameElement;
              if (cubeIframeElm && cubeIframeElm.contentWindow) {
                cubeIframeElm.contentWindow.postMessage(
                  {
                    message: "parent_location",
                    type: location.search
                  },
                  "*"
                );
              }
            } catch (e) {
              console.log("Cube Iframe Load Issue: ", e);
            }
          }}
          id="cubeFrame"
          loading="lazy"
        />
      )}
    </>
  );
};

export default Cube;
