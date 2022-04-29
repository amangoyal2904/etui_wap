import { FC } from "react";
import styles from "./styles.module.scss";
import DynamicFooter from "components/DynamicFooter";

const Footer: FC = () => {
  return (
    <>
      <footer id="wapFooter" className={styles.wapFooter}></footer>
      <DynamicFooter />
    </>
  );
};

export default Footer;
