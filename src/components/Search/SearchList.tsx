import { getParameterByName, isDevEnv } from 'utils/utils';
import styles from './styles.module.scss';

export default function SearchList(props) {
  let { index, data, searchValue } = props;
  searchValue = searchValue?.toLowerCase();
  const displayListData = (type) => {
    let listData = (type == 'primeNews') ? data.filter(data => data.link.includes('/prime/')) : (type == 'news') ? data.filter(data => !data.link.includes('/prime/')) : data;
    let list = listData.length > 0 && listData.map((data, i) => <li className={(i == listData.length - 1) ? styles.lastList : styles.list} key={i}><a href={type == 'reptr' ? `https://m.economictimes.com${data.link}` : data.link}>{makeBold(data.title)}</a> </li>)
    return list;
  }
  const getCompanyData = (type) => {
    switch (type) {
      case "company":
        return data.filter(data => ((data.entityType == "company" && data.subType != 'NonList') || data.entityType == "dvr" || data.entityType == "pp" || data.entityType == "idr" || data.entityType == "ipo"))

      case "mf":
        return data.filter(data => data.entityType == "MutualFund");

      case "nps":
        return data.filter(data => data.entityType == "NPS")

      case "et":
        return data.filter(data => data.entityType == "ET")

      case "cmdt":
        return data.filter(data => data.entityType == "commodity")

      case "forex":
        return data.filter(data => data.entityType.toLowerCase() == "forex")

      case "etf":
        return data.filter(data => data.entityType.toLowerCase() == "etf")

      case "index":
        return data.filter(data => data.entityType == "index")

      case "companyUnlisted":
        return data.filter(data => (data.entityType.toLowerCase() == "company" && data.subType == 'NonList'))

      case "crypto":
        return data.filter(data => data.entityType == "crypto")

      default:
        return data

    }
  }
  const displayCompanyData = (type) => {
    let compData = getCompanyData(type);
    let objLang = {
      maping: { 'HIN': 'hindi', 'GUJ': 'gujarati', 'MAR': 'marathi', 'BEN': 'bengali', 'KAN': 'kannada', 'ORI': 'oriya', 'TEL': 'telugu', 'TAM': 'tamil' },
      currentLang: function () {
        var a = location.pathname.split("/")[1], pLang = getParameterByName('language'), currLang = '';
        for (var key in objLang.maping) {
          if (a == objLang.maping[key])
            currLang = key;
        }
        if (!currLang && typeof objLang.maping[pLang] != 'undefined') {
          currLang = pLang;
        }
        return currLang;
      }
    }

    var currLanguage = objLang.currentLang();
    var langPrefix = objLang.maping[currLanguage], langSufix = '';
    langPrefix = langPrefix ? langPrefix + '/' : '';
    langSufix = currLanguage ? ',language-' + currLanguage : ''
    let domain = 'https://m.economictimes.com'
    let list = compData.length > 0 && compData.map((data, i) => (
      <li className={(i == compData.length - 1) ? styles.lastList : styles.list} key={i}>
        {
          (type == "company" || type == "companyUnlisted") && (
            <a href={type == 'company' ? `${domain}/${data.tagSeoName}/stocks/companyid-${(data.entityType == "dvr" || data.entityType == "pp") ? data.tagId.substring(0, data.tagId.length - 4) : data.tagId}.cms${(data.entityType != 'company' || typeof data.subType != 'undefined') ? (`?companytype=${data.subType ? data.subType : data.entityType}`) : ''}` : `${domain}/company/${data.tagSeoName}/${data.tagId}`}>
              {makeBold(data.tagName)}
            </a>
          )
        }
        {
          (type == "mf" || type == "etf") && (
            <a href={`${domain}/${escape(data.tagSeoName)}/mffactsheet/schemeid-${data.tagId}.cms`}>
              {makeBold(data.tagName.trim())}
            </a>
          )
        }
        {type == "et" && <a href={`${domain}/${data.url}`}> {makeBold(data.key)} </a>}
        {type == "forex" && <a href={`${domain}/forex_home.cms?amount=1&fromcur=${data.fromCurrencyShort}&tocur=${data.toCurrencyShort}`}> {makeBold(data.tagName.replace(data.tagName[0], data.tagName[0].toUpperCase()))} </a>}
        {type == "cmdt" && <a href={`${domain}/${langPrefix}commoditysummary/symbol-${data.fno}${langSufix}.cms`}>{makeBold(data.tagName)}</a>}
        {
          type == "index" &&
          <a href={`${domain}/markets/${data.tagSeoName}/indexsummary/indexid-/${langPrefix}'indices/sensex_${data.tagId == '2369' ? `50` : data.tagId == '2365' ? `30` : ''}_companies,exchange-${data.exchange == 'BSE' ? 47 : 50}.cms`}>
            {makeBold(data.tagName)}
          </a>
        }
        {
          type == "nps" &&
          <a href={`${domain}/${escape(data.tagSeoName)}/nps/schemecode-${data.tagId}.cms`}>
            {makeBold(data.SchemeName)} {((data.SchemeName1 != '' && data.SchemeName1 != undefined) ? (' - ' + data.SchemeName1) : ('')) + ((data.SchemeName2 != '' && data.SchemeName2 != undefined) ? (' - ' + data.SchemeName2) : (''))}
          </a>
        }
        {
          type == 'crypto' &&
          <a href={`${domain}/markets/cryptocurrency/${escape(data.tagSeoName)}/cryptodetail/symbol-${data.tagId}.cms`}>
            {makeBold(data.tagName)}
          </a>
        }
      </li>
    ))
    return list;
  }

  function makeBold(completeText) {
    var matchtext
    if (searchValue.search(/[\[\]?*+|{}\\()@.\n\r]/) != -1) {
      matchtext = new RegExp('/' + searchValue, "i");
    } else {
      matchtext = new RegExp(searchValue, "i");
    }

    if (completeText.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
      let matched = completeText.substr(completeText.search(matchtext), searchValue.length);
      completeText = completeText.replace(matchtext, '<b>' + matched + '</b>');
    }
    return <span dangerouslySetInnerHTML={{ __html: completeText }} ></span>
  }
  let domain = 'https://m.economictimes.com'
  return (<>
    {
      (index == 0 && data.length) ?
        (<>
          {
            (data.some((data) => (data.entityType == "company" && data.subType != 'NonList') || data.entityType == "dvr" || data.entityType == "pp" || data.entityType == "idr" || data.entityType == "ipo")) &&
            <>
              <li className={styles.head}>
                <span className='flt'>COMPANIES</span>
                <a className='flr' target='_blank' href={`${domain}/currentquote.cms?ticker=${searchValue}`}>
                  more
                </a>
                <div className='clr'></div>
              </li>
              {displayCompanyData('company')}
            </>
          }
          {
            (data.some((data) => data.entityType == "MutualFund")) &&
            <>
              <li className={styles.head}>
                <span className='flt'>MUTUAL FUNDS</span>
                <div className='clr'></div>
              </li>
              {displayCompanyData('mf')}
            </>

          }
          {
            (data.some((data) => data.entityType == "NPS")) &&
            <>
              <li className={styles.head} >
                <span className='flt'>NPS</span>
                <div className='clr'></div>
              </li>
              {displayCompanyData('nps')}
            </>

          }
          {
            (data.some((data) => data.entityType == "commodity")) &&
            <>
              <li className={styles.head} >
                <span className='flt'>COMMODITY</span>
                <a className='flr' target='_blank' href={`${domain}/commoditysearch.cms?query=${searchValue}`}>more</a>
                <div className='clr'></div>
              </li>
              {displayCompanyData('cmdt')}
            </>

          }
          {
            (data.some((data) => data.entityType.toLowerCase() == "forex")) &&
            <>
              <li className={styles.head} ><span className='flt'>FOREX</span><div className='clr'></div></li>
              {displayCompanyData('forex')}
            </>

          }
          {
            (data.some((data) => data.entityType.toLowerCase() == "etf")) &&
            <>
              <li className={styles.head} ><span className='flt'>ETF</span><div className='clr'></div></li>
              {displayCompanyData('etf')}
            </>

          }
          {
            (data.some((data) => data.entityType == "index")) &&
            <>
              <li className={styles.head}>
                <span className='flt'>INDICES</span>
                <div className='clr'></div>
              </li>
              {displayCompanyData('index')}
            </>

          }
          {
            (data.some((data) => (data.entityType.toLowerCase() == "company" && data.subType == 'NonList'))) &&
            <>
              <li className={styles.head}>
                <span className='flt'>UNLISTED COMPANIES</span>
                <div className='clr'></div>
              </li>
              {displayCompanyData('companyUnlisted')}
            </>

          }
          {
            (data.some((data) => data.entityType == "crypto")) &&
            <>
              <li className={styles.head}>
                <span className='flt'>CRYPTOCURRENCY</span>
                <div className='clr'></div>
              </li>
              {displayCompanyData('crypto')}
            </>
          }

        </>) : ""
    }
    {
      (index == 1 && data.length) ?
        <>

          {
            (data.some((data) => data.link.includes('/prime/'))) &&
            <>

              <li className={styles.head}>
                <span className='flt'>PRIME STORIES</span>
                <div className='clr'></div>
              </li>
              {displayListData('primeNews')}
            </>
          }

          {(data.some((data) => !data.link.includes('/prime/'))) &&
            <>
              <li className={styles.head}>
                <span className='flt'>NEWS</span>
                <a className='flr' target='_blank' href={`${domain}/topic/${escape(searchValue).replace("%20", "-")}`}>
                  more
                </a>
                <div className='clr'></div>
              </li>
              {displayListData('news')}
            </>
          }
        </> : ""
    }
    {
      (index == 2 && Object.keys(data).length) ?
        <>
          {data.person && data.person.length > 0 && <li className={styles.head}>
            <span className='flt'>PEOPLE</span>
            <a className='flr' target='_blank' href={`/panache/panache-people-101`}>
              more
            </a>
            <div className='clr'>
            </div>
          </li>}
          {
            data.person && data.person.length > 0 && data.person.map((data, i) => {
              return <li className={styles.list} key={i}>
                <a href={`/${data.seo}`}>{makeBold(data.name)}</a>
              </li>
            })
          }
          {data.definitions && data.definitions.length > 0 && <li className={styles.head}>
            <span className='flt'>DEFINITIONS</span>
            <a className='flr' target='_blank' href={`${domain}/definition/search/${searchValue}`}>
              more
            </a>
            <div className='clr'>
            </div>
          </li>}
          {
            data.definitions && data.definitions.length > 0 && data.definitions.map((data, i) => {
              return <li className={styles.list} key={i}>
                <a href={`${domain}/definition/${data.seo}`}>{makeBold(data.name)}</a>
              </li>
            })
          }

        </> : ""
    }
    {
      (index == 3 && data.length) ?
        <>
          <li className={`${styles.head} ${styles.reptr}`}>
            <span className='flt'>REPORTERS</span>
            <div className='clr'></div>
          </li>
          {displayListData('reptr')}
        </> : null
    }


  </>
  )

}