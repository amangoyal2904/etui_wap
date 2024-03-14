import React from "react";
import Benefits from "./Data.json";
import styles from "./redeemstyles.module.scss";
import LazyLoadImg from "components/LazyLoad";

const TOIBenefitsWeb = () => {
  const BenefitImage = (ele, index, flag = true) => (
    <div
      className={`${index + 1 === Benefits.length ? styles.lastBenefit : ""} ${flag ? styles.lhsBenefit : ""} ${
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
      <div className={styles.benefitsContainer}>
        <p className={styles.heading}>What’s included with TOI+ membership</p>
        {Benefits.map((benefit, index) =>
          index % 2 === 0 ? BenefitItem(benefit, index) : BenefitItemLHS(benefit, index)
        )}
      </div>
    </React.Fragment>
  );
};
export default TOIBenefitsWeb;
