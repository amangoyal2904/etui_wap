import { Fragment, useState } from "react";
import styles from "./styles.module.scss";

interface FaqInfoProps {
  faqdata?: any;
}

export default function FaqInfoSec({ faqdata }: FaqInfoProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };
  return (
    <>
      <section className={styles.faqSecWrap}>
        <div className={styles.faqSection}>
          <div className={styles.boxHead}>Frequently Asked Questions</div>
          <div className={styles.faqContainer}>
            {faqdata && faqdata.mainEntity && faqdata.mainEntity.length > 0
              ? faqdata.mainEntity.map((item: any, index: number) => {
                  return (
                    <div className={`${styles.faqPanel} ${activeIndex === index ? styles.active : ""}`} key={index}>
                      <h3 onClick={() => toggleAnswer(index)}>
                        {item.name} <span className={styles.arrowContainer}></span>
                      </h3>
                      <div className={styles.faqContent}>
                        <p>{item.acceptedAnswer.text}</p>
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
      </section>
    </>
  );
}
