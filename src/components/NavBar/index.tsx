import Link from "next/link";
import { FC } from "react";
import { MenuProps, MenuSecProps } from "components/AppHeader/types";
import { useSelector } from "react-redux";
import { AppState } from "app/store";
import { grxEvent } from "utils/ga";

const NavBar: FC = () => {
  const store = useSelector((state: AppState) => state.appHeader);
  const menuData: MenuProps = store.data.searchResult[0];
  const fireGAEvent = (e) => {
    const { section } = e.currentTarget.dataset;
    grxEvent(
      "event",
      {
        event_category: "PWA Back Nav",
        event_action: section + " - Top",
        event_label: window.location.href
      },
      1
    );
  };

  return menuData ? (
    <>
      <nav className="navBar">
        <Link href={menuData?.url}>
          <a className="active" onClick={(e) => fireGAEvent}>
            {menuData?.title}
          </a>
        </Link>
        {menuData?.sec?.map((item: MenuSecProps, i) =>
          item.shorturl || item.url ? (
            <Link href={item.shorturl ? item.shorturl : item.url} key={i}>
              <a data-name={item.title} onClick={(e) => fireGAEvent}>
                {item.title}
              </a>
            </Link>
          ) : (
            <a key={i}>{item.title}</a>
          )
        )}
      </nav>
      <style jsx>
        {`
          .navBar {
            white-space: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            box-sizing: border-box;
            position: relative;
            padding: 0 0 0 15px;
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none;
          }
          .navBar::-webkit-scrollbar {
            display: none;
          }

          .navBar a {
            color: #000;
            font-size: 0.75rem;
            font-family: "Montserrat", "Verdana";
            display: inline-block;
            padding: 0 10px 5px;
          }
          .navBar a .active {
            font-weight: 700;
            border-bottom: 3px solid #000;
            padding: 0 0 5px;
            margin: 0 10px;
          }

          .navBar a[href="/prime"]::before {
            content: "";
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("https://img.etimg.com/photo/msid-105039132,quality-100.cms") no-repeat;
            background-position: -3px -98px;
            transform: scale(0.6);
            vertical-align: middle;
          }
        `}
      </style>
    </>
  ) : null;
};

export default NavBar;
