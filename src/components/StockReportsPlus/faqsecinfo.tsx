import { Fragment, useState } from "react";
import styles from "./styles.module.scss";

interface FaqInfoProps {
  isPrimeUser?: number;
  isLogin?: boolean;
}
const faqData = [
  {
    question: " What is Stock Reports Plus?12",
    answer: " What is Stock Reports Plus? What is Stock Reports Plus?"
  },
  {
    question: " What is Stock Reports Plus?22",
    answer: " What is Stock Reports Plus? What is Stock Reports Plus?"
  },
  {
    question: " What is Stock Reports Plus?33",
    answer:
      " What is Stock Reports Plus? What is Stock Reports Plus? What is Stock Reports Plus? What is Stock Reports Plus?"
  },
  {
    question: " What is Stock Reports Plus?44",
    answer:
      " What is Stock Reports Plus? What is Stock Reports Plus? What is Stock Reports Plus? What is Stock Reports Plus? What is Stock Reports Plus?"
  },
  {
    question: " What is Stock Reports Plus?55",
    answer:
      " What is Stock Reports Plus? What is Stock Reports Plus? What is Stock Reports Plus? What is Stock Reports Plus? What is Stock Reports Plus? What is Stock Reports Plus?"
  }
];

export default function FaqInfoSec({ isPrimeUser, isLogin }: FaqInfoProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };
  return (
    <>
      <section className={styles.faqSecWrap}>
        <div className={styles.faqSection}>
          <div className={styles.boxHead}>Frequently Asked Questions</div>
          <div className={styles.faqContainer}>
            {faqData.map((item: any, index: number) => {
              return (
                <div className={`${styles.faqPanel} ${activeIndex === index ? styles.active : ""}`} key={index}>
                  <h3 onClick={() => toggleAnswer(index)}>
                    {item.question} <span className={styles.arrowContainer}></span>
                  </h3>
                  <div className={styles.faqContent}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
