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
        const isSubscribed = window.objInts.permissions.indexOf("subscribed") > -1;
        if (closeCube !== "1" && !window.optCheck && window.objInts.adType !== "adfree" && !isSubscribed) {
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
    <>{pageLoaded && displayCube && <iframe className={styles.cube} src={ifmSrc} id="cubeFrame" loading="lazy" />}</>
  );
};

export default Cube;
