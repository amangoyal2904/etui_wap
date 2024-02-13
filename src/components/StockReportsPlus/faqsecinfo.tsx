import { Fragment, useState } from "react";
import styles from "./styles.module.scss";
import { grxEvent } from "utils/ga";

interface FaqInfoProps {
  faqdata?: any;
}

export default function FaqInfoSec({ faqdata }: FaqInfoProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const toggleAnswer = (index: number, title: string) => {
    if (activeIndex !== index) {
      grxEvent(
        "event",
        {
          event_category: "Stock Report  - Proposition Page",
          event_action: `Click FAQ`,
          event_label: `${title}`
        },
        1
      );
    }
    setActiveIndex(activeIndex === index ? -1 : index);
  };
  return (
    <>
      <section className={`${styles.faqSecWrap} topSec5`}>
        <div className={styles.faqSection}>
          <div className={styles.boxHead}>Frequently Asked Questions</div>
          <div className={styles.faqContainer}>
            {faqdata?.mainEntity?.length > 0
              ? faqdata?.mainEntity.map((item: any, index: number) => {
                  return (
                    <div className={`${styles.faqPanel} ${activeIndex === index ? styles.active : ""}`} key={index}>
                      <h3 onClick={() => toggleAnswer(index, item.name)}>
                        {item?.name} <span className={styles.arrowContainer}></span>
                      </h3>
                      <div className={styles.faqContent}>
                        <p>{item.acceptedAnswer?.text}</p>
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
