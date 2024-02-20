import React from "react";

import styles from "./referrals.module.scss";

const ErrorDialog = ({ onSignin }) => {
  return (
    <React.Fragment>
      <div className={styles.errorDialogContainer}>
        <div className={styles.bgLayer}></div>
        <div className={styles.errorDialog}>
          <span className={styles.warn_logo}></span>
          <p className={styles.err_msg}>Sorry! There seems to be a problem.</p>
          <p className={styles.err_submsg}>
            You can refer a friend only if you are an <span className={styles.brandColor}>ETPrime</span> member.
          </p>
          <p className={styles.already_member}>Already a member?</p>
          <button onClick={onSignin} className={styles.sigin_btn}>
            Sign In
          </button>
          <p className={styles.email_label}>
            In case of any issues further, connect with us at <u>care@etprime.com</u>
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ErrorDialog;
