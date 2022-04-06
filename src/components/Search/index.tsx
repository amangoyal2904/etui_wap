import React, { FC, useState } from "react";
import styles from "./styles.module.scss";
import { isDevEnv } from "utils/utils";
import apiConfig from "network/config.json";
import SearchList from "./SearchList";

interface SearchProps {
  setIsOpen: (flag: boolean) => void;
}

const Search: FC<SearchProps> = ({ setIsOpen }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const isDev = isDevEnv();
  let typingTimer = null;

  const getSearchData = (searchValue) => {
    searchValue = searchValue.trim();
    if (searchValue) {
      const ethomeURL = isDev ? apiConfig.ethome["development"] : apiConfig.ethome["production"];
      const newsSearchURL = isDev ? apiConfig.newsSearch["development"] : apiConfig.newsSearch["production"];
      const defSearchURL = isDev ? apiConfig.definitionSearch["development"] : apiConfig.definitionSearch["production"];
      const reptrSearchURL = isDev ? apiConfig.reporterSearch["development"] : apiConfig.reporterSearch["production"];

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
    const url = `https://${
      isDev ? "spmdev8243.indiatimes" : "m.economictimes"
    }.com/jcms_search.cms?feedtype=json&keywords=${keyword}`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const redirectURL = res.url;
        if (redirectURL) {
          window.location =
            redirectURL.indexOf("https://") == -1 && redirectURL.indexOf("http://") == -1
              ? "https://m.economictimes.com" + redirectURL
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
      //GA.event('Search Bar', window.location.href, keyword.toLowerCase());
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
            <span className={`${styles.searchIcon} ${styles.cSprite}`}></span>
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
