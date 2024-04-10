import React from "react";

import styles from "./PaywallBenefits.module.scss";

const PaywallBenefitsMWeb = (Benefits) => {
  return (
    <React.Fragment>
      <div className={styles.headingmWeb}>
        <span className={styles.etprimelogo} />
        <p>Membership Benefits</p>
      </div>
      <div className={styles.benefitsContainermWeb}>
        {Benefits?.data?.map((benefit) => (
          <div key={benefit?.title} className={`${styles.textBox} ${styles[benefit.cssClass]}`}>
            {benefit?.headerImage && <span className={styles.headerImg} />}
            <p className={styles.title}>{benefit.title} </p>
            {benefit?.subtitle && <p className={styles.subtitle}>{benefit.subtitle} </p>}
            {benefit?.detailSubText && <p className={styles.subText}>{benefit?.detailSubText}</p>}
            <span className={styles.mainImg} />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};
export default PaywallBenefitsMWeb;
