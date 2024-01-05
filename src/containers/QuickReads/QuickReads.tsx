import { FC, useEffect, useState } from "react";
import styles from "./QuickReads.module.scss";
import { QuickReadsProps } from "types/quickReads";
import { useSwipeable } from "react-swipeable";
import { useRouter } from "next/router";
import { getMSID, updateDimension } from "utils";
import { grxEvent } from "utils/ga";
import SEO from "components/SEO";

const config = {
  delta: 1, // min distance(px) before a swipe starts. *See Notes*
  preventScrollOnSwipe: false, // prevents scroll during swipe (*See Details*)
  trackTouch: true, // track touch input
  trackMouse: true, // track mouse input
  rotationAngle: 0, // set a rotation angle
  swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
  touchEventOptions: { passive: true } // options for touch listeners (*See Details*)
};

const QuickReads: FC<QuickReadsProps> = (props) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  const { seo = {}, version_control, parameters } = props;
  const seoData = { ...seo, ...version_control?.seo };
  const router = useRouter();
  const slides = props?.searchResult[0]?.data || [];

  seoData.title = slides[currentCardIndex].title + " - The Economic Times";

  const handlers = useSwipeable({
    onSwipedUp: () => {
      updateDimension({ pageName: parameters?.type, msid: parameters.msid, subsecnames: seo.subsecnames });
      currentCardIndex + 1 < slides.length && setCurrentCardIndex(currentCardIndex + 1);
    },
    onSwipedDown: () => {
      updateDimension({ pageName: parameters?.type, msid: parameters.msid, subsecnames: seo.subsecnames });
      currentCardIndex > 0 && setCurrentCardIndex(currentCardIndex - 1);
    },
    ...config
  });

  useEffect(() => {
    const msid = getMSID(window.location.pathname.split("/").pop());
    const foundIndex = slides.findIndex((item) => item.id == msid);
    if (foundIndex !== -1 && currentCardIndex !== foundIndex) {
      setCurrentCardIndex(foundIndex);
    }
    updateDimension({ pageName: parameters?.type, msid: parameters.msid, subsecnames: seo.subsecnames });
  }, []);

  useEffect(() => {
    // open coach on first slide for the user landing for the first time
    if (currentCardIndex === 0) {
      const isQuickReadsCoachOpen = localStorage.getItem("isQuickReadsCoachOpen");
      isQuickReadsCoachOpen === null && setIsCoachOpen(true);
    } else if (isCoachOpen) {
      setIsCoachOpen(false);
      localStorage.setItem("isQuickReadsCoachOpen", "1");
    }

    // preload next image if any
    if (currentCardIndex + 1 < slides.length) {
      const preloadNextImg = new Image();
      preloadNextImg.src = slides[currentCardIndex + 1].img;
    }

    slides[currentCardIndex] &&
      slides[currentCardIndex].id &&
      router.push(`/quickreads/${slides[currentCardIndex].id}`, undefined, { shallow: true });

    grxEvent(
      "event",
      {
        event_category: "PWA Widget Quick Reads",
        event_action: "Swipes",
        event_label: `${currentCardIndex + 1} - ${slides[currentCardIndex].url}`
      },
      1
    );
  }, [currentCardIndex]);

  return (
    <>
      <div className={styles.mainContent}>
        <div className={styles.slideWrapper} {...handlers}>
          {slides.length > 0 && (
            <a
              className={styles.slide}
              href={slides[currentCardIndex].url}
              onClick={() =>
                grxEvent(
                  "event",
                  {
                    event_category: "PWA Widget Quick Reads",
                    event_action: "Clicks",
                    event_label: `${slides[currentCardIndex].url}`
                  },
                  1
                )
              }
            >
              <img
                src={slides[currentCardIndex].img}
                fetchpriority="high"
                width="800"
                height="600"
                alt={slides[currentCardIndex].title}
              />
              <div className={styles.txt}>
                <h2>{slides[currentCardIndex].title}</h2>
                <p>{slides[currentCardIndex].syn}</p>
              </div>
              <span
                className={styles.shareIconWrap}
                onClick={(e) => {
                  e.preventDefault();
                  window.navigator.share &&
                    window.navigator.share({
                      url: slides[currentCardIndex].url,
                      title: slides[currentCardIndex].title
                    });
                }}
              >
                <i className={`${styles.shareIcon} ${styles.sprite}`}></i>
              </span>
            </a>
          )}
        </div>

        {isCoachOpen && (
          <div className={styles.coach}>
            <div className={styles.coachTxt}>
              <ul>
                <li>
                  <span>
                    <i className={`${styles.upIcon} ${styles.sprite}`}></i>
                  </span>{" "}
                  Swipe up for next story
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <SEO {...seoData} seoListData={slides} />
    </>
  );
};

export default QuickReads;
