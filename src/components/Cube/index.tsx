import { FC, useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { ET_CUBE_URL } from "../../utils/common";

const Cube: FC = (): JSX.Element => {
  const [displayCube, setDisplayCube] = useState<boolean>(false);
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [ifmSrc, setIfmSrc] = useState<string>("");

  const loadCube = (): void => {
    try {
      if (typeof sessionStorage !== "undefined" && !displayCube) {
        const closeCube = sessionStorage.getItem("closeCube");
        const isSubscribed = window?.objInts?.permissions.indexOf("subscribed") > -1;
        if (closeCube !== "1" && !window?.optCheck && window?.objInts?.adType !== "adfree" && !isSubscribed) {
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

  const intsCallback = (): void => {
    window?.objInts?.afterPermissionCall(loadCube);
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

    window.addEventListener(
      "message",
      (e) => {
        if (typeof e.data == "object" && e.data.message == "cube iframe close") {
          document.getElementById("cubeFrame").remove();
        }
      },
      false
    );

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
