import { NextPage } from "next";
import { PAGE_TYPE, SiteConfig } from "utils/common";
import { removeBackSlash } from "utils/utils";
import { SEOProps, WebPageSchemaProps, NewsArticleSchemaProps, VideoObjectSchemaProps } from "./types";

const itemList = (schemaType: string) => {
  return schemaType == PAGE_TYPE.articlelist
    ? {
      itemScope: "itemscope",
      itemType: "http://schema.org/ItemList"
    }
    : "";
}

const listItem = (schemaType: string) => {
  return schemaType == PAGE_TYPE.articlelist
    ? {
      itemProp: "itemListElement",
      itemScope: "itemscope",
      itemType: "http://schema.org/ListItem"
    }
    : "";
}

const listItemPos = (schemaType: string, position: number) => {
  return schemaType == PAGE_TYPE.articlelist ? { pos: position } : "";
}

const metaUrl = (schemaType: string, url: string) => {
  const condition = schemaType == PAGE_TYPE.articlelist;
  return condition ? <meta itemProp="url" content={url} /> : "";
}

const metaPosition = (schemaType: string, position: string) => {
  const condition = schemaType == PAGE_TYPE.articlelist;
  return condition ? <meta itemProp="position" content={position} /> : "";
}

const siteNav = () => {
  return {
    itemScope: "itemscope",
    itemType: "http://www.schema.org/SiteNavigationElement"
  };
}

const metaTag = (name: string, content: string) => {
  let contentval = content ? content.toString() : "";
  contentval =
    contentval.indexOf(".com") > -1
      ? contentval
      : contentval == "websitename"
        ? SiteConfig.wapsiteregionalname
        : contentval.substring(0, 110);
  return name && content ? (
    <meta itemProp={name} content={contentval} />
  ) : null;
}

const itemProp = (prop) => {
  return { itemProp: prop };
}

const getAuthors = (d) => {
  var authors = [];
  try {
    if (d.authors && d.authors.length > 0) {
      d.authors.forEach(c => {
        authors.push({
          "@type": "Person",
          name: c.title,
          url: c.url
        });
      });
    } else if (d.agency) {
      authors.push({
        "@type": "Thing",
        name: d.agency
      })
    }
  } catch (error) {
    console.log("error in getAuthors");
  }
  return authors;
}

const seoDate = (dateStr: string) => {
  try {
    const monthObj = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"
    };
    const str: string[] = dateStr.split(",");
    let month = monthObj[str[0].split(" ")[0]];
    let date = str[0].split(" ")[1];
    let year = str[1].trim();
    let timeInfo = str[2].split(" ");
    let time = timeInfo[1];
    let period = timeInfo[2];
    if (period == "PM") {
      time =
        parseInt(time.split(":")[0]) + 12 + ":" + time.split(":")[1] + ":00";
    } else {
      time = parseInt(time.split(":")[0]) + ":" + time.split(":")[1] + ":00";
    }
    return year + "-" + month + "-" + date + "T" + time + "+05:30";
  } catch (err) {
    return "";
  }
}
const webPageSchema = (data:WebPageSchemaProps) =>{
  const {name, url, description} = data;
  const publisherData = data.publisher;
  const _schema = {
    "@context": "http://schema.org",
    "@type": "WebPage",
    name,
    url,
    description,
    publisher:{
      "@type": publisherData.type,
      name: publisherData.name,
      url:  publisherData.url,
      logo: {
        "@type": publisherData.logo.type,
        url: publisherData.logo.url
      }
    }
  }
  return _schema;
}
const newsArticleSchema = (data:NewsArticleSchemaProps) =>{
  const {inLanguage, keywords, headline,  description, datePublished, dateModified, name, url, mainEntityOfPage, articleSection, articleBody} = data;
  const publisherData = data.publisher;
  const _schema = {
    "@context": "http://schema.org",
    "@type": "NewsArticle",
    inLanguage,
    keywords,
    headline,
    description,
    datePublished,
    dateModified,
    name,
    url,
    mainEntityOfPage,
    articleSection,
    articleBody,
    image: {
      "@type": data.image.type,
      url: data.image.url,
      height: data.image.height,
      width: data.image.width
    },
    author: {
      "@type": data.author.type,
      name: data.author.name
    },				  
    publisher: {
      "@type": publisherData.type,
      name: publisherData.name,
      logo: {
        "@type": publisherData.logo.type,
        url: publisherData.logo.url,
        width: publisherData.logo.width,
        height: publisherData.logo.height
      }
    }
  }
  return _schema;
}
const organizationSchema = (url:string)=>{
  const _schema = {
    "@context" : "http://schema.org",
    "@type" : "NewsMediaOrganization",
    name : "Economic Times",
    url : "https://economictimes.indiatimes.com/",
    logo : {
      "@type" : "ImageObject",
      url,
      width:600,
      height:60
    }
  }
  return _schema
}
const videoObjectSchema = (data:VideoObjectSchemaProps)=>{
  const {thumbnailUrl, uploadDate, datePublished, dateModified, name, description, keywords, inLanguage, contentUrl, duration} = data;
  const publisherData = data.publisher;
  const _schema = {
    "@context" : "http://schema.org",
    "@type": "VideoObject",
    thumbnailUrl,
    uploadDate,
    datePublished,
    dateModified,
    name,
    description,
    keywords,
    inLanguage,
    contentUrl,
    duration,
    publisher:{
      "@type":"Organization",
      name:publisherData.name,
      logo:{
        "@type":"ImageObject",
        url:publisherData.logo.url,
        width:publisherData.logo.width,
        height:publisherData.logo.height
      }
    },
    image:{
      "@type":"ImageObject",
      url:data.image.url,
      width:data.image.width,
      height:data.image.height
    }
  }
  return _schema
}
const breadcrumbSchema = (data:any)=>{
  const itemListArr = [];
    data.forEach((d, index) => {
      if (d && d.url) {
        itemListArr.push({
          "@type": "ListItem",
          position: `${index + 1}`,
          name: `${d.title}`,
          item: {
            "@id": `${d.url}`
          }
        })
      }
    });
    const schema = {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: itemListArr
    };
    return schema;
}

const Schema: NextPage<SEOProps> = ({data, page}) => {
  console.log('schema data', data.seoschema)
  const pageType = data.page || '';
  const { schemaType, behindLogin, isPrime, subsecnames } = data;
  const schemaMeta = data.schemaMeta || {};  

  let schema: object | string[] = {};
  let primeSchema = {};

  const authors = getAuthors(data);
  const alternativeHeadline = `${data.keywords && data.keywords.substring(0, 110)}`;
  const headline = `${removeBackSlash(data.title && data.title.substring(0, 110))}`;
  const dateUpdated = seoDate(data.updated ? data.updated : "");
  const datePublished = seoDate(data.date ? data.date : "");
  const keywords = data.keywords ? data.keywords.split(",") : [];
  const movieSchema = schemaMeta && Object.keys(schemaMeta).length !== 0 ? schemaMeta : '';
  

  const schemaData = {
    inLanguage: data.lang,
    authors: data.authors,
    agency: data.agency,
    date: data.date,
    updated: data.updated,
    articleSection: data.articleSection,
    story: data.story || "",
    remove_paywall_schema: data.remove_paywall_schema || 0,
    arttitle: data.title
  };

  const seoschema = data.seoschema || '';
  // let publisherLogo = (objVc && objVc.seo && objVc.seo.org_img) || SiteConfig.publisherLogo || '';
  let publisherLogo = '';
  if ((behindLogin || isPrime) && !data.remove_paywall_schema) {
    primeSchema = {
      "isAccessibleForFree": "http://schema.org/False",
      "hasPart": {
        "@type": "WebPageElement",
        "isAccessibleForFree": "http://schema.org/False",
        "cssSelector": ".paywall"
      },
      "isPartOf": {
        "@type": ["CreativeWork", "Product"],
        "name": "Economic Times",
        "productID": "https://m.economictimes.com:prime"
      }
    }
  }

  if (pageType == "articleshow") {
    let subsecname2 = (subsecnames && subsecnames.subsecname2) || '';
    let type = (subsecname2 == 'Interviews') ? 'ReportageNewsArticle' : (subsecname2 == 'Analysis' ? 'AnalysisNewsArticle' : "NewsArticle");
    schema = [
      {
        "@context": "http://schema.org",
        "@type": type,
        inLanguage: data.inLanguage,
        headline,
        keywords,
        alternativeHeadline,
        image: {
          "@type": "ImageObject",
          url: `${data.image}`,
          height: 900,
          width: 1200
        },
        datePublished: `${datePublished}`,
        dateModified: `${dateUpdated}`,
        url: `${data.canonical}`,
        mainEntityOfPage: `${data.canonical}`,
        articleSection: `${data.articleSection}`,
        articleBody: `${data.story}`,
        author: authors,
        publisher: {
          "@type": "NewsMediaOrganization",
          name: "Economic Times",
          logo: {
            "@type": "ImageObject",
            url: publisherLogo,
            width: 600,
            height: 60
          }
        },
        description: `${data.description}`,
        ...primeSchema
      },
      {
        "@context": "http://schema.org/",
        "@type": "WebPage",
        name: `${removeBackSlash(data.title)}`,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["headline", `${data.description}`]
        },
        url: `${data.canonical}`
      }
    ];
    if (movieSchema && Array.isArray(schema)) {
      schema.push(movieSchema);
    }
    if (seoschema && Array.isArray(schema)) {
      schema.push(seoschema);
    }
  } else if (pageType == "articlelist" || pageType == "topic") {
    let mapdata = (data.seoListData && ((schemaType == "topic") ? data.seoListData.slice(0, 20) : data.seoListData.slice(0, 10))) || [];
    const itemListArr = mapdata.map((item, index) => {
      // console.log("data", index, item.title, item.url);
      return {
        "@type": "ListItem",
        position: `${index + 1}`,
        url: `${item.url}`,
        name: `${item.title}`
      };
    });

    schema = [
      {
        "@context": "http://schema.org",
        "@type": "ItemList",
        itemListElement: itemListArr
      },
      {
        "@context": "http://schema.org/",
        "@type": "WebPage",
        name: `${removeBackSlash(data.title)}`,
        url: `${data.canonical}`,
        description: `${data.description}`,
        publisher: {
          "@type": "NewsMediaOrganization",
          name: "Economic Times",
          url: "https://m.economictimes.com/",
          logo: {
            "@type": "ImageObject",
            url: publisherLogo,
            width: 600,
            height: 60
          }
        },
      }
    ];
    seoschema && Array.isArray(schema) && schema.push(seoschema);

    if (schemaType == "topic") {
      let breadcrumbData = data && data.breadcrumb || [];
      const itemListArr = [];
      breadcrumbData.forEach((d, index) => {
        if (d && d.url) {
          itemListArr.push({
            "@type": "ListItem",
            position: `${index + 1}`,
            name: `${d.title}`,
            item: {
              "@id": `${d.url}`
            }
          })
        }
      });
      const hasPartArr = mapdata.map((item, index) => {
        return {
          "@type": "NewsArticle",
          headline: item.title,
          url: `${item.url}`,
          name: `${item.title}`,
          mainentityofpage: `${item.url}`,
          datePublished: item.date,
          dateModified: item.date,
          publisher: {
            "@type": "Organization",
            name: "ET",
            logo: {
              "@type": "ImageObject",
              url: item.img,
              width: 600,
              height: 60
            }
          },
          image: {
            "@type": "ImageObject",
            url: item.img,
            width: 1200,
            height: 900
          },
          author: {
            "@type": "Thing",
            name: "Economic Times"
          }
        };
      });

      Array.isArray(schema) && schema.push(
        {
          "@context": "http://schema.org",
          "@type": "SearchResultsPage",
          description: `${data.description}`,
          url: `${data.canonical}`,
          mainentityofpage: `${data.canonical}`,
        },
        {
          "@context": "http://schema.org",
          "@type": "CollectionPage",
          description: `${data.description}`,
          url: `${data.canonical}`,
          "hasPart": hasPartArr
        },
        {
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: itemListArr
        }
      );
    }
  }else if(pageType == "videoshow"){
    //Array.isArray(data) && data.length > 0
    const _breadcrumbSchema = Array.isArray(data.breadcrumb) && data.breadcrumb.length > 0  ? breadcrumbSchema(data.breadcrumb) : null;
    const _logoImgUrl = data.org_img || '';
    const _webPageSchema = data.seoschema.webPage ? webPageSchema(data.seoschema.webPage) : null 
    const _newsArticleSchema = data.seoschema.newsArticle ?  newsArticleSchema(data.seoschema.newsArticle) : null
    const  _organizationSchema = _logoImgUrl && _logoImgUrl !== '' ? organizationSchema(_logoImgUrl) : null
    const _videoObjectSchema = data.seoschema.videoObject ? videoObjectSchema(data.seoschema.videoObject) : null;
    schema = [_breadcrumbSchema, _webPageSchema, _newsArticleSchema, _organizationSchema, _videoObjectSchema]
    //data.seoschema
  }

  return (
    <>
      {/* {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData)
          }}
        />
      )} */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema)}}
      />
    </>
  );
}

export default Schema;
