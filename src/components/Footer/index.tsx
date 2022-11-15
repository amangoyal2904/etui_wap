import { FC } from "react";
import styles from "./styles.module.scss";
import DynamicFooter from "components/DynamicFooter";
import DfpAds from "components/Ad/DfpAds";

const Footer: FC<{ dynamicFooterData: any }> = ({ dynamicFooterData }) => {
  return (
    <>
      <footer id="wapFooter" className={styles.wapFooter}>
        <DynamicFooter dynamicFooterData={dynamicFooterData} />
        <DfpAds adInfo={{ key: "andbeyond" }} />
      </footer>
    </>
  );
};

export default Footer;
