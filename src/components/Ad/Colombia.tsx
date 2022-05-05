import { useRouter } from "next/router";
import styles from "./styles.module.scss";
// import { TEST_ID_CTN_HOME, TEST_COLOMBIA_DFP_HOME, TEST_COLOMBIA_DFP_ARTICLESHOW, BROWSI_SECTIONS } from "utils/common";
import { FC, useEffect } from "react";

interface Props {
  index?: number;
  id?: string;
  currentMSID?: number;
  hidelabel?: string;
  footerAd?: string;
}
declare global {
  interface Window {
    adDivIds: string[];
    colombia: {
      refresh: (string) => void;
      update: () => void;
    };
  }
}

const Colombia: FC<Props> = function (props) {
  const { index, currentMSID, hidelabel } = props;
  const id = props.id;
  const divId = `div-clmb-ctn-${id}-${index}${currentMSID ? "-" + currentMSID : ""}`;
  const router = useRouter();
  const crPath = router.pathname;
  // const pageName: string = pageType(crPath);

  function renderColombia() {
    if (window.colombia && !(window.adDivIds.indexOf(divId) > -1)) {
      window.adDivIds.push(divId);
      window.colombia.refresh(divId);
      window.colombia.update();
    }
  }
  useEffect(() => {
    renderColombia();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`${styles.colAdContainer} adContainer ${hidelabel ? styles.hidelabel : ""}`}>
      <div
        className="colombiaAd colombia"
        data-slot={id}
        id={divId}
        data-position={props.currentMSID ? props.currentMSID : index}
      />
    </div>
  );
};

export default Colombia;
