import { FC } from "react";
import styles from "./styles.module.scss";
import DynamicFooter from "components/DynamicFooter";
import DfpAds from "components/Ad/DfpAds";
import Cube from "components/Cube";

interface Props {
  dynamicFooterData?: any;
  objVc?: {
    global_cube_wap: number;
  };
}

const Footer: FC<Props> = ({ dynamicFooterData, objVc }) => {
  return (
    <>
      <footer id="wapFooter" className={styles.wapFooter}>
        <DynamicFooter dynamicFooterData={dynamicFooterData} />
        <DfpAds adInfo={{ key: "andbeyond" }} />
        {objVc.global_cube_wap && objVc.global_cube_wap == 1 && <Cube />}
      </footer>
    </>
  );
};

export default Footer;
