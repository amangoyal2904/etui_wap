import { FC, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import DynamicFooter from "components/DynamicFooter";
import DfpAds from "components/Ad/DfpAds";
import Cube from "components/Cube";

const Footer: FC<{ dynamicFooterData: any }> = ({ dynamicFooterData }) => {
  const [isCubeActive, setIsCubeActive] = useState(false);

  useEffect(() => {
    const objVc = window.objVc || {};
    if (objVc.global_cube_wap && objVc.global_cube_wap == 1) setIsCubeActive(true);
  }, []);

  return (
    <>
      <footer id="wapFooter" className={styles.wapFooter}>
        <DynamicFooter dynamicFooterData={dynamicFooterData} />
        <DfpAds adInfo={{ key: "andbeyond" }} />
        {isCubeActive && <Cube />}
      </footer>
    </>
  );
};

export default Footer;
