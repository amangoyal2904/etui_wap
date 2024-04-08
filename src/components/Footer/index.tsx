import { FC } from "react";
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
      <footer id="wapFooter" className="wapFooter">
        <DynamicFooter dynamicFooterData={dynamicFooterData} />
        <DfpAds adInfo={{ key: "andbeyond" }} />
        {objVc?.global_cube_wap && objVc?.global_cube_wap == 1 && <Cube />}
      </footer>
      <style jsx>{`
        .wapFooter {
          max-width: 1024px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
};

export default Footer;
