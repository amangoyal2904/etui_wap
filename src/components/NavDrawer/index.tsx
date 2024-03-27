import React from "react";
import { MenuProps } from "components/AppHeader/types";
import { FC, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "app/store";
import Login from "components/Login";
import { ET_WAP_URL } from "utils/common";
import { grxEvent } from "utils/ga";

const makeLinkStyle = `
  .rArr {
    background-position: -306px -66px;
    background-repeat: no-repeat;
    display: inline-block;
    height: 22px;
    width: 14px;
    margin-left: 10px;
    transform: scale(0.7);
    vertical-align: middle;
  }
  .bold {
    font-weight: 600;
  }
`;

const oneDotBdr = `
  .oneDotBdr {
    border-bottom: 1px dotted #ccc;
  }
`;
interface DrawerProps {
  setIsDrawerOpen: (s: boolean) => void;
  isOpen: boolean;
}

const NavDrawer: FC<DrawerProps> = ({ setIsDrawerOpen, isOpen }) => {
  const [isSiblingsOpen, setIsSiblingsOpen] = useState({});
  const [isSubmenuOpen, setIsSubmenuOpen] = useState({});
  const ref = useRef<HTMLDivElement>();
  const store = useSelector((state: AppState) => state.appHeader);
  const menuData: MenuProps = store.data.searchResult[0];

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      //clean up
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [setIsDrawerOpen]);

  const handleClick = (e) => {
    if (e.target.tagName.toLowerCase() === "a") {
      setIsDrawerOpen(false);
    }
  };
  const fireGAEvent = (e) => {
    const { label, gapath } = e.currentTarget.dataset;
    grxEvent(
      "event",
      {
        event_category: "PWA LHS Nav",
        event_action: label + " | " + gapath,
        event_label: window.location.href
      },
      1
    );
  };
  const showMore = (i: string) => {
    setIsSiblingsOpen((prev) => {
      return { ...prev, [i]: true };
    });
  };

  const showSubmenu = (i: string) => {
    setIsSubmenuOpen((prev) => {
      return { ...prev, [i]: !prev[i] };
    });
  };

  const getMenu = (data: MenuProps, level: number, index: number | string) => {
    let secDetails = data.sec;
    if (!Array.isArray(secDetails)) {
      secDetails = [secDetails];
    }

    const r = secDetails.map((item, i) => {
      return (
        <React.Fragment key={level + "_" + i}>
          <li className={level === 1 && i > 3 && !isSiblingsOpen[level + "_" + index] ? "hidden" : ""}>
            {makeLink(item, level, index, i)}
            {level === 1 && item.sec && (
              <span
                className={
                  !isSubmenuOpen[level + "_" + index + "_" + i]
                    ? "rDown" + " " + "commonSprite"
                    : "rUp" + " " + "commonSprite"
                }
                onClick={() => showSubmenu(level + "_" + index + "_" + i)}
              ></span>
            )}
            {item.sec && getMenu(item, level + 1, index + "_" + i)}
          </li>
          {level === 1 && i === 4 && !isSiblingsOpen[level + "_" + index] && (
            <li data-more={item.title} onClick={() => showMore(level + "_" + index)}>
              VIEW MORE +
            </li>
          )}
          {level === 0 && <li className="oneDotBdr"></li>}
          <style jsx>
            {`
              li {
                font-weight: 600;
              }
              li li {
                font-weight: 400;
                font-size: 16px;
              }
              .hidden {
                display: none;
              }

              li[data-more] {
                color: #ed1a3b;
                font-size: 12px !important;
                font-weight: 500;
                line-height: 50px;
                cursor: pointer;
                text-transform: uppercase;
              }
              span {
                margin-top: 15px;
                height: 12px;
                width: 18px;
                float: right;
                transform: scale(0.7);
              }
              .rDown {
                background-position: -273px -82px;
              }
              .rUp {
                background-position: -273px -45px;
              }

              ${oneDotBdr}
            `}
          </style>
        </React.Fragment>
      );
    });

    return level !== 0 ? (
      <>
        <ul className={level === 2 && !isSubmenuOpen[level - 1 + "_" + index] ? "hidden" : "submenu"}>{r}</ul>
        <style jsx>
          {`
            ul.submenu {
              padding-left: ${level == 1 ? "0" : "20"}px;
            }
            .hidden {
              display: none;
            }
            ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            ul li {
              font-weight: 400;
              font-size: 16px;
            }
          `}
        </style>
      </>
    ) : (
      r
    );
  };

  const makeLink = (data: MenuProps, level: number, iOuter: number | string, iInner: number | string) => {
    let linkURL = data.shorturl || data.url;
    if (!linkURL) {
      return (
        <>
          {data.title} {level === 0 && <span className={`rArr commonSprite`}></span>}
        </>
      );
    }
    linkURL = !linkURL.includes("http") ? ET_WAP_URL + linkURL : linkURL;
    return (
      <a
        href={linkURL}
        className={isSubmenuOpen[level + "_" + iOuter + "_" + iInner] ? "bold" : ""}
        onClick={fireGAEvent}
        data-label={data.title}
        data-gapath={linkURL}
      >
        {data.title} {level === 0 && <span className={`rArr commonSprite`}></span>}
        <style jsx>{`
          ${makeLinkStyle}
        `}</style>
      </a>
    );
  };
  return menuData ? (
    <>
      <nav className={`drawer ${isOpen ? "isOpen" : ""}`} ref={ref}>
        <Login />
        {store.isFetchSuccess && isOpen && (
          <div className="menuWrap">
            <ul onClick={handleClick}>
              <li>
                <a href={ET_WAP_URL} onClick={fireGAEvent} data-label={menuData.title} data-gapath={ET_WAP_URL}>
                  {menuData.title}
                </a>
              </li>
              <li className="oneDotBdr"></li>
              {getMenu(menuData, 0, 0)}
            </ul>
          </div>
        )}
      </nav>
      <style jsx>
        {`
          .drawer {
            font-family: "Montserrat", "Verdana";
            transition: all 0.3s ease-out;
            position: fixed;
            z-index: 10000;
            bottom: 45px;
            top: 0;
            width: 80%;
            height: 100%;
            left: -100%;
            box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.4);
            background-color: #fff;
            font-size: 20px;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            text-align: left;
            line-height: 40px;
            max-width: 1024px;
            margin: 0 auto;
          }
          .isOpen {
            left: 0%;
          }

          .menuWrap {
            padding: 20px;
          }
          .drawer ul li {
            font-weight: 600;
          }
          .drawer ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          ${oneDotBdr}
        `}
      </style>
    </>
  ) : null;
};

export default NavDrawer;
