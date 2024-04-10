import React from "react";

import styles from "./PaywallBenefits.module.scss";
import LazyLoadImg from "components/LazyLoad";

const PaywallBenefits = (Benefits) => {
  const BenefitImage = (ele, index, flag = true) => (
    <div
      className={`${index + 1 === Benefits?.data.length ? styles.lastBenefit : ""} ${flag ? styles.lhsBenefit : ""} ${
        styles.creativeBox
      }`}
    >
      <LazyLoadImg large={true} img={ele?.imageUrl} alt={ele?.detailText} width={564} height={413} />
    </div>
  );

  const BenefitText = (ele) => (
    <div className={styles.textBox}>
      <span className={styles.number}>{ele?.orderId}</span>
      <div>
        {ele?.marketBadge && <span className={styles.marketBadge} />}
        <p className={styles.title}>{ele.title} </p>
        <p className={styles.subText}>{ele?.detailSubText}</p>
      </div>
    </div>
  );

  const BenefitItem = (ele, index) => (
    <div key={ele?.title} className={styles.benefitItem}>
      {BenefitImage(ele, index, false)} {BenefitText(ele)}
    </div>
  );
  const BenefitItemLHS = (ele, index) => (
    <div key={ele?.title} className={styles.benefitItem}>
      {BenefitText(ele)} {BenefitImage(ele, index, true)}
    </div>
  );

  return (
    <React.Fragment>
      <p className={styles.benefitHeading}>What’s included with ETPrime membership</p>
      <div className={styles.benefitsContainer}>
        {Benefits?.data.map((benefit, index) =>
          index % 2 === 0 ? BenefitItemLHS(benefit, index) : BenefitItem(benefit, index)
        )}
      </div>
    </React.Fragment>
  );
};
export default PaywallBenefits;
