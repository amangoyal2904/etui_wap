import { FC, useEffect } from "react";
import styles from "./styles.module.scss";
import { pageType } from "../../utils/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import { ET_MARKET_URL, ET_WEALTH_URL, ET_PRIME_URL } from "../../utils/common";
import { useState } from "react";
import DynamicFooter from "components/DynamicFooter";

const Footer: FC = () => {
  const router = useRouter();
  const utm_source = "PWA";
  const utm_campaign = "ETPrimedistribution";
  const utm_medium = "Bottom_Nav";
  const utmPrimeUrl =
    ET_PRIME_URL + "?utm_source=" + utm_source + "&utm_campaign=" + utm_campaign + "&utm_medium=" + utm_medium;
  const pageName = pageType(router.asPath);
  const [activeLink, setActiveLink] = useState("");
  // const [menuStyle, setMenuStyle] = useState(false);

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
        const pageName = pageType(window.location.pathname);
        if (fixFooterInterval) {
          clearInterval(fixFooterInterval);
        }
        if (!footer_banner && !(pageName === "articleshow" || pageName === "primearticle")) {
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
    // setMenuStyle(false);
  }

  function toggleMenu() {
    // let menuStyle = false;
    // setMenuStyle(menuStyle);
    document.getElementById("root").style.position = "";
    createActiveLink();
  }

  return (
    <>
      <footer id="wapFooter" className={styles.wapFooter}>
        {
          <ul
            className={`${styles.footerMenu} ${
              pageName === "articleshow" || pageName === "primearticle" ? styles.hide : ""
            }`}
          >
            <li
              onClick={() => toggleMenu()}
              className={`${styles.etHome} ${activeLink == "home" ? styles.active : null}`}
              role="button"
              data-ga-onclick="PWA Bottom Nav#url#Home"
            >
              <Link href="/">
                <a className={activeLink == "home" ? styles.active : null}>
                  <p className={`${styles.icon} ${activeLink == "home" ? styles.active : null}`}></p>
                  <span>Home</span>
                </a>
              </Link>
            </li>
            <li
              className={`${styles.etMarket} ${activeLink == "markets" ? styles.active : null}`}
              role="button"
              onClick={() => toggleMenu()}
              data-ga-onclick="PWA Bottom Nav#url#Markets"
            >
              <a href={ET_MARKET_URL} className={activeLink == "markets" ? styles.active : null}>
                <p className={`${styles.icon} ${activeLink == "markets" ? styles.active : null}`}></p>
                <span>Markets</span>
              </a>
            </li>
            <li
              className={`${styles.etWealth} ${activeLink == "wealth" ? styles.active : null}`}
              role="button"
              onClick={() => toggleMenu()}
              data-ga-onclick="PWA Bottom Nav#url#Wealth"
            >
              <a href={ET_WEALTH_URL} className={activeLink == "wealth" ? styles.active : null}>
                <p className={`${styles.icon} ${activeLink == "wealth" ? styles.active : null}`}></p>
                <span>Wealth</span>
              </a>
            </li>
            <li
              className={`${styles.etPrime} ${activeLink == "prime" ? styles.active : null}`}
              role="button"
              data-ga-onclick="PWA Bottom Nav#url#ET Prime"
            >
              <Link href={utmPrimeUrl}>
                <a>
                  <p className={`${styles.icon} ${activeLink == "prime" ? styles.active : null}`}></p>
                  <span>ETPrime</span>
                </a>
              </Link>
            </li>
          </ul>
        }
      </footer>
      <DynamicFooter />
    </>
  );
};

export default Footer;
