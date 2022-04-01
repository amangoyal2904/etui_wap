import { FC, useEffect } from "react";
import styles from "./styles.module.scss";
import Utility from "../../utils/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import { ET_MARKET_URL, ET_WEALTH_URL, ET_PRIME_URL } from "../../utils/common";
import { useState } from "react";

const Footer: FC = () => {
  const router = useRouter();
  const utm_source = "PWA";
  const utm_campaign = "ETPrimedistribution";
  const utm_medium = "Bottom_Nav";
  const utmPrimeUrl =
    ET_PRIME_URL +
    "?utm_source=" +
    utm_source +
    "&utm_campaign=" +
    utm_campaign +
    "&utm_medium=" +
    utm_medium;
  const pageType = Utility.pageType(router.asPath);
  const [activeLink, setActiveLink] = useState("");
  const [menuStyle, setMenuStyle] = useState(false);

  useEffect(() => {
    createActiveLink();
    let lastScrollTop = 0;
    let side = "";
    let footerHeight = 0;
    let lastrecordedHeight = 0;
    let fixFooterInterval = undefined;
    window.addEventListener(
      "scroll",
      () => {
        const footer_banner = document.getElementById("footer_banner");
        const mainMenu = document.getElementById("mainMenu");

        const footer = document.querySelector("footer");
        const pageType = Utility.pageType(window.location.pathname);
        if (fixFooterInterval) {
          clearInterval(fixFooterInterval);
        }
        if (
          !footer_banner &&
          !(pageType === "articleshow" || pageType === "primearticle")
        ) {
          fixFooterInterval = setTimeout(() => {
            if (footer) {
              footer.style.bottom = (footerHeight < -25 ? -50 : 0) + "px";
            }
          }, 700);
          const st = window.pageYOffset || document.documentElement.scrollTop;
          if (st < lastScrollTop) {
            const isMenuOpen = mainMenu && mainMenu.getAttribute("is-open");
            if (isMenuOpen !== "true") {
              if (side == "up") {
                footerHeight = 0;
                lastrecordedHeight = st;
              }
              side = "down";
              if (footerHeight > -50) {
                footerHeight = st - lastrecordedHeight;
                if (footerHeight < -50) {
                  footerHeight = -50;
                } else if (footerHeight > 0) {
                  footerHeight = 0;
                }
                if (footer) {
                  footer.style.bottom = footerHeight + "px";
                }
              }
            }
          } else {
            if (side == "down") {
              footerHeight = -50;
              lastrecordedHeight = st;
            }
            side = "up";
            if (footerHeight < 0) {
              footerHeight = -50 - lastrecordedHeight + st;
              if (footerHeight < -50) {
                footerHeight = -50;
              } else if (footerHeight > 0) {
                footerHeight = 0;
              }
              if (footer) {
                footer.style.bottom = footerHeight + "px";
              }
            }
          }
          lastScrollTop = st <= 0 ? 0 : st;
        }
      },
      false
    );
  }, []);

  function createActiveLink() {
    let selectedMenuOption = "home";
    const currentUrl = window.location.pathname;
    const arrCurrentUrl = currentUrl.split("/");
    if (currentUrl.indexOf("prime") > -1) {
      selectedMenuOption = "prime";
    } else if (arrCurrentUrl[1]) {
      selectedMenuOption = arrCurrentUrl[1];
      if (selectedMenuOption === "personal-finance") {
        selectedMenuOption = "wealth";
      }
      if (selectedMenuOption === "news") {
        selectedMenuOption = "news";
      }
      if (
        !(
          selectedMenuOption == "wealth" ||
          selectedMenuOption == "markets" ||
          selectedMenuOption == "news" ||
          selectedMenuOption == "prime"
        )
      ) {
        selectedMenuOption = "";
      }
    }
    setActiveLink(selectedMenuOption);
    setMenuStyle(false);
  }

  function toggleMenu(evt, type) {
    const rootElement = document.getElementById("root");
    fireGAEvent(evt);
    const menuStyle = false;
    setMenuStyle(menuStyle);
    rootElement.style.position = "";
    createActiveLink();
  }

  function fireGAEvent(e) {
    const label = e.currentTarget.getAttribute("ga-data");
    const category = "PWA Bottom Nav";
    const action = window.location.href;
    window.ga(category, action, label);
  }

  return (
    <footer id="wapFooter" className={styles.wapFooter}>
      {
        <ul
          className={`${styles.footerMenu} ${
            pageType === "articleshow" || pageType === "primearticle"
              ? styles.hide
              : ""
          }`}
        >
          <li
            onClick={(e) => toggleMenu(e, "home")}
            className={`${styles.etHome} ${
              activeLink == "home" ? styles.active : null
            }`}
            role="button"
            ga-data="Home"
          >
            <Link href="/">
              <a className={activeLink == "home" ? styles.active : null}>
                <p
                  className={`${styles.icon} ${
                    activeLink == "home" ? styles.active : null
                  }`}
                ></p>
                <span>Home</span>
              </a>
            </Link>
          </li>
          <li
            className={`${styles.etMarket} ${
              activeLink == "markets" ? styles.active : null
            }`}
            role="button"
            onClick={(e) => toggleMenu(e, "markets")}
            ga-data="Markets"
          >
            <a
              href={ET_MARKET_URL}
              className={activeLink == "markets" ? styles.active : null}
            >
              <p
                className={`${styles.icon} ${
                  activeLink == "markets" ? styles.active : null
                }`}
              ></p>
              <span>Markets</span>
            </a>
          </li>
          <li
            className={`${styles.etWealth} ${
              activeLink == "wealth" ? styles.active : null
            }`}
            role="button"
            onClick={(e) => toggleMenu(e, "wealth")}
            ga-data="Wealth"
          >
            <a
              href={ET_WEALTH_URL}
              className={activeLink == "wealth" ? styles.active : null}
            >
              <p
                className={`${styles.icon} ${
                  activeLink == "wealth" ? styles.active : null
                }`}
              ></p>
              <span>Wealth</span>
            </a>
          </li>
          <li
            className={`${styles.etPrime} ${
              activeLink == "prime" ? styles.active : null
            }`}
            role="button"
            onClick={fireGAEvent}
            ga-data="ET Prime"
          >
            <Link href={utmPrimeUrl}>
              <a>
                <p
                  className={`${styles.icon} ${
                    activeLink == "prime" ? styles.active : null
                  }`}
                ></p>
                <span>ETPrime</span>
              </a>
            </Link>
          </li>
        </ul>
      }
    </footer>
  );
};

export default Footer;
