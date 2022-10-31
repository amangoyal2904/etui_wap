import React, { FC, useState } from "react";
import styles from "./styles.module.scss";
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
    <div className={styles.srchoverlaydiv}>
      <div className={styles.srchoverlaycontent}>
        <div>
          <span className={styles.srchclose}></span>
        </div>
        <div className={styles.searchBarContainer}>
          <input
            onChange={handleChange}
            autoComplete="off"
            type="text"
            name="ticker_newsearch"
            placeholder="Search News, Stock Quotes &amp; NAV"
            value={searchKeyword}
            className={styles.inputBox}
            onKeyUp={(e) => {
              e.key === "Enter" && handleSearchClick();
            }}
          />
          <div className={styles.searchBar} onClick={handleSearchClick}>
            <span className={`${styles.searchIcon} ${styles.commonSprite}`}></span>
          </div>
        </div>
        <div className={styles.srchclose} onClick={() => setIsOpen(false)}>
          +
        </div>
        {searchKeyword.trim().length > 0 && (
          <ul className={styles.searchListAll}>
            {searchResult.length > 0 &&
              (!checkIfEmptyResults() ? (
                searchResult.map((data, index) => {
                  return <SearchList index={index} key={index} searchValue={searchKeyword.trim()} data={data} />;
                })
              ) : (
                <li className={styles.lastList}>No results found</li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
