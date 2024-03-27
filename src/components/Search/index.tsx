import React, { FC, useState } from "react";
import { APP_ENV } from "../../utils";
import apiConfig from "network/config.json";
import SearchList from "./SearchList";
import { grxEvent } from "utils/ga";

interface SearchProps {
  setIsOpen: (flag: boolean) => void;
}

const Search: FC<SearchProps> = ({ setIsOpen }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  let typingTimer = null;

  const getSearchData = (searchValue) => {
    const { SEARCH } = apiConfig;
    const { ethome, news, definition, reporter } = SEARCH;
    searchValue = searchValue.trim();
    if (searchValue) {
      const ethomeURL = ethome[APP_ENV];
      const newsSearchURL = news[APP_ENV];
      const defSearchURL = definition[APP_ENV];
      const reptrSearchURL = reporter[APP_ENV];

      Promise.all([
        fetch(
          `${ethomeURL}?ticker=${searchValue}&matchCompanyName=true&realstate=true&dvr=true&idr=true&trust=true&mcx=true&mf=true&nps=true&insideet=true&detail=false&forex=false&index=true&mecklai=true&etf=true&nonList=true&pagesize=6&language=&outputtype=json&crypto=true`
        ),
        fetch(`${newsSearchURL}?query=${searchValue}`),
        fetch(`${defSearchURL}?q=${searchValue}`),
        fetch(`${reptrSearchURL}?keyword=${searchValue}`)
      ])
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((data) => {
          setSearchResult(data);
        })
        .catch((err) => {
          console.log("PWA search err: ", err);
        });
    }
  };

  const handleChange = (e) => {
    clearTimeout(typingTimer);
    const el = e.target;
    let searchValue = el.value;
    setSearchKeyword(searchValue);
    searchValue = encodeURIComponent(searchValue);
    if (searchValue === "") {
      setSearchResult([]);
    }
    typingTimer = setTimeout(() => {
      getSearchData(searchValue);
    }, 700);

    //clearTimeout(this.typingTimer);
    // let searchValue = e.target.value;
    // this.setState({ searchValue });
    // searchValue = escape(searchValue);
    // if (searchValue == "") {
    //     this.setState({searchData:[]})
    // }
    // this.typingTimer = setTimeout(()=>{this.getSearchData(searchValue)}, 700);
  };

  const checkIfEmptyResults = () => {
    let allEmpty = true;
    searchResult.forEach((item) => {
      if (Array.isArray(item) && item.length !== 0) {
        allEmpty = false;
      } else if (typeof item == "object" && item !== null && !Array.isArray(item)) {
        Object.values(item).forEach((data) => {
          if (Array.isArray(data) && data.length !== 0) {
            allEmpty = false;
          }
        });
      }
    });
    return allEmpty;
  };

  const defaultRedirect = (keyword, specialKeywords) => {
    let loc = "/topic/" + encodeURIComponent(keyword).replaceAll("%20", "-");
    if (typeof specialKeywords[keyword] != "undefined") {
      loc = specialKeywords[keyword];
    }
    window.location.href = "https://m.economictimes.com" + loc;
  };

  const generateRedirectUrl = (keyword, specialKeywords) => {
    const url = `${apiConfig["DOMAIN"][APP_ENV]}.com/jcms_search.cms?feedtype=json&keywords=${keyword}`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const redirectURL = res.url;
        if (redirectURL) {
          window.location =
            redirectURL.indexOf("https://") == -1 && redirectURL.indexOf("http://") == -1
              ? apiConfig["DOMAIN"][APP_ENV] + redirectURL
              : redirectURL;
        } else {
          defaultRedirect(keyword.toLowerCase(), specialKeywords);
        }
      })
      .catch((err) => {
        console.log("error in redirect Api", err);
        defaultRedirect(keyword.toLowerCase(), specialKeywords);
      });
  };

  const handleSearchClick = () => {
    const keyword = searchKeyword.trim();
    if (keyword) {
      setIsOpen(false);
      const niftyLink = "/indices/nifty_50_companies";
      const specialKeywords = {
        sensex: "/indices/sensex_30_companies",
        nifty: niftyLink,
        nifty50: niftyLink,
        "nifty 50": niftyLink
      };
      /**
       * TODO: Add ga event
       */
      grxEvent(
        "event",
        {
          event_category: "Search Bar",
          event_action: window.location.href,
          event_label: keyword.toLowerCase()
        },
        1
      );
      generateRedirectUrl(keyword, specialKeywords);
    } else {
      alert("Enter some text to search");
    }
  };

  return (
    <>
      <div className={"srchoverlaydiv"}>
        <div className={"srchoverlaycontent"}>
          <div>
            <span className={"srchclose"}></span>
          </div>
          <div className={"searchBarContainer"}>
            <input
              onChange={handleChange}
              autoComplete="off"
              type="text"
              name="ticker_newsearch"
              placeholder="Search News, Stock Quotes &amp; NAV"
              value={searchKeyword}
              className={"inputBox"}
              onKeyUp={(e) => {
                e.key === "Enter" && handleSearchClick();
              }}
            />
            <div className={"searchBar"} onClick={handleSearchClick}>
              <span className={`searchIcon commonSprite`}></span>
            </div>
          </div>
          <div className={"srchclose"} onClick={() => setIsOpen(false)}>
            +
          </div>
          {searchKeyword.trim().length > 0 && (
            <ul className={"searchListAll"}>
              {searchResult.length > 0 &&
                (!checkIfEmptyResults() ? (
                  searchResult.map((data, index) => {
                    return <SearchList index={index} key={index} searchValue={searchKeyword.trim()} data={data} />;
                  })
                ) : (
                  <li className={"lastList"}>No results found</li>
                ))}
            </ul>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .srchoverlaydiv {
            font-family: "Faustina", "sans";
            background: rgba(0, 0, 0, 0.85);
            position: fixed;
            width: 100%;
            z-index: 2147483647 !important;
            display: block;
            top: 0;
            bottom: 0;
          }
          .srchoverlaycontent {
            top: 55px;
            position: relative;
            transform: translateY(-50%);
            text-align: center;
            max-width: 100%;
            margin: 0 auto;
          }
          .searchBarContainer {
            width: 100%;
            margin: 0 auto;
          }
          .srchbtn {
            width: 20px;
            background: #ed193b;
            display: inline-block;
            height: 32px;
            color: #fff;
            font-size: 16px;
            line-height: 26px;
            text-align: center;
            font-weight: 700;
            cursor: pointer;
          }
          .inputBox {
            background: #fff;
            width: 98%;
            height: 40px;
            font-size: 16px;
            padding-left: 10px;
            padding-right: 25px;
            line-height: 32px;
            outline-style: none;
            box-shadow: none;
            border: none;
          }
          .inputBox:focus {
            outline-style: none;
            box-shadow: none;
            border-color: transparent;
          }
          .srchclose {
            display: inline-block;
            color: #fff;
            font-size: 40px;
            line-height: 40px;
            transform: rotate(45deg);
            cursor: pointer;
            position: absolute;
            top: -41px;
            right: 4px;
          }
          .searchListAll {
            box-shadow: 0 -1px 24px 0 rgba(0, 0, 0, 0.17);
            background-color: #ffffff;
            position: absolute;
            z-index: 2147483647 !important;
            text-align: left;
            max-width: 97.8%;
            min-width: 97.8%;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            overflow: scroll;
            max-height: 500px;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .searchBar {
            position: absolute;
            top: 6px;
            right: 2%;
            height: 23px;
            width: 24px;
            z-index: 9;
            display: inline-block;
            background-color: #ffffff;
          }
          .searchIcon {
            width: 16px;
            height: 16px;
            margin-top: 5px;
            background-position: -96px -25px;
          }

          .lastList {
            padding: 8px 10px;
            border-bottom: dotted 1px #d4d9dc;
            font-size: 14px;
            border-bottom-style: solid;
          }
        `}
      </style>
    </>
  );
};

export default Search;
