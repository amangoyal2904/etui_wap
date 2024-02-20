import React from "react";
import styles from "./login.module.scss";

const LoginWidget = () => {
  return (
    <div id="ssologinWrapper">
      <div id="ssoLogin" className={styles.ssoLogin}></div>
    </div>
  );
};
export default LoginWidget;
