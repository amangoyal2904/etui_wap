import SwipeableViews from "react-swipeable-views";
import React, { useState } from "react";
import styles from "./redeemstyles.module.scss";
import Benefits from "./Data.json";

const TOIBenefitsWap = () => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentIndex, setCurrentIndex] = useState({});

  const slideChange = (e) => setCurrentIndex(e);

  const expandCarousel = (index) => {
    setCurrentIndex(index);
    setShowCarousel(true);
  };

  return (
    <React.Fragment>
      <div className={styles.benefitsContainer}>
        <p className={styles.heading}>What’s included with TOI+ membership</p>
        <ul className={styles.benefitList}>
          {Benefits?.map((item, i) => (
            <li key={`listItems${i}`} onClick={() => expandCarousel(i)}>
              <img alt={item.title} width={48} height={48} src={item.tileImageUrl} loading="lazy" decoding="async" />
              <div className={styles.benefitDesc}>
                <h4>{item.tileTitle}</h4>
                <p className={styles.desc}>{item.tileSubTitle}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showCarousel && <div className={styles.bgTransparent} />}
      {showCarousel && (
        <div className={styles.carouselContainer}>
          <div className={styles.closePopUp} onClick={() => setShowCarousel(false)}>
            <img
              height={13}
              width={13}
              src="https://img.etimg.com/photo/msid-78144068,quality-100/close.jpg"
              alt="close"
              loading="lazy"
              decoding="async"
            />
          </div>
          <SwipeableViews
            enableMouseEvents
            onChangeIndex={(e) => {
              slideChange(e);
            }}
            index={currentIndex}
          >
            {Benefits?.map((slide, index) => {
              const { imageUrl, tileTitle, tileSubTitle } = slide;
              return (
                <div key={`carousel${index}`} className={styles.carouselBox}>
                  <img height={300} src={imageUrl} alt={`slide${index}`} loading="lazy" decoding="async" />
                  <div style={{ textAlign: "center", fontFamily: "Montserrat", marginTop: "30px" }}>
                    <h4>{tileTitle}</h4>
                    <p style={{ margin: "8px 60px 16px" }}>{tileSubTitle}</p>
                  </div>
                </div>
              );
            })}
          </SwipeableViews>
          <ul className={styles.dots}>
            {Benefits?.map((ele, i) => (
              <li key={`activeDot${i}`} className={i === currentIndex ? styles.active : ""}></li>
            ))}
          </ul>
        </div>
      )}
    </React.Fragment>
  );
};
export default TOIBenefitsWap;
