import { Fragment, useEffect, useState, useCallback } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";

interface ShowSearchUIProps {
  isPrimeUser?: number;
  oncloseSearch: any;
}

export default function ShowSearchUISec({ oncloseSearch }: ShowSearchUIProps) {
  const [stockData, setStockData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Debounce function to delay API calls
  const debounce = (func: any, delay: any) => {
    let timeoutId: any;
    return function (...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };
  // Function to call your API
  const fetchSearchResults = useCallback(async (term) => {
    try {
      const APIURL = `https://etsearch.indiatimes.com/etspeeds/ethome.ep?ticker=${term}&matchCompanyName=true&realstate=false&pp=false&dvr=false&idr=false&trust=false&mcx=false&mf=false&nps=false&insideet=false&detail=false&forex=false&index=false&mecklai=false&etf=false&nonList=false&pagesize=6&language=&outputtype=json`;
      const response = await fetch(APIURL);
      const data = await response.json();
      console.log("___data", data);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);
  const debouncedFetch = useCallback(debounce(fetchSearchResults, 500), [fetchSearchResults]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedFetch(value); // Call API with debounced function
  };
  const highlightMatch = (text, searchTerm) => {
    const startIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (startIndex !== -1) {
      const endIndex = startIndex + searchTerm.length;
      return (
        <>
          {text.substring(0, startIndex)}
          <span className={styles.highlight}>{text.substring(startIndex, endIndex)}</span>
          {text.substring(endIndex)}
        </>
      );
    }
    return text;
  };
  return (
    <>
      <div className={styles.searchSecSR}>
        <div className={styles.sr_search}>
          <div className={styles.formGroup}>
            <i onClick={() => oncloseSearch()} className={styles.iBack}></i>
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search Stock Reports"
              className={styles.inputBox}
              name="ticker_newsearch"
              data-search-input=""
              autoComplete="off"
            />
            <i className={styles.iSearch}></i>
          </div>
          <ul className={styles.resultListItem}>
            {searchResults.map((result, index) => (
              <li key={index}>
                <Link href={`/${result.tagSeoName}/stockreports/reportid-${result.tagId}.cms`}>
                  <a target="_blank">{highlightMatch(result.tagName, searchTerm)}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
