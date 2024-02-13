import Head from "next/head";
import { removeBackSlash } from "utils";
import { ET_WAP_URL, ET_WEB_URL, SiteConfig } from "utils/common";
import { SEOProps } from "types/seo";

/**
 * TODO: append _col_uuid from cookies in android:url
 * <meta property="al:android:url" content={data.actualURL + "?utm_source=test&cid="+_col_uuid} />
 */
const Meta = (props: SEOProps) => {
  const data = props;
  let meta = null;
  // const data = props.metaData || null;
  const { ampURL, langInfo, hostid } = data;
  const modified = data.updated;
  // const ampURL= data.ampURL;
  // const langInfo = data.langInfo;
  // const og = props.og || {};
  const title = data.title ? data.title : SiteConfig.title;
  const description = data.description ? data.description : SiteConfig.description;
  const keywords = data.keywords ? data.keywords : SiteConfig.keywords;
  const image = data.image ? data.image : SiteConfig.image;
  const type = data.type ? data.type : "website";
  const url = data.url ? data.url : SiteConfig.weburl;
  const alternateUrl = (data.actualURL && data.actualURL.replace(ET_WAP_URL, ET_WEB_URL)) || "";
  const metarobotstag = data.metarobotstag || 0;

  const getRegion = (subsecName: any) => {
    const { subsec3 = "" } = subsecName || {};
    if (subsec3 == 92130584) {
      return "UK";
    } else if (subsec3 == 89994305) {
      return "US";
    } else if (subsec3 == 92130570) {
      return "CA";
    } else if (subsec3 == 78613995) {
      return "AE";
    }
    return "";
  };

  if (data) {
    const canonical = data.canonical || ET_WAP_URL;
    meta = (
      <>
        <title>{removeBackSlash(data.title)}</title>
        <meta name="keywords" content={data.keywords} />
        <link rel="shortcut icon" href={`https://m.economictimes.com/favicon.ico`} type="image/x-icon" />
        <meta httpEquiv="content-language" content={hostid && hostid == 317 ? "hi" : "en"} />
        {data.news_keywords && <meta name="news_keywords" content={data.news_keywords} />}
        <meta name="description" content={removeBackSlash(data.description)} />
        {data.noindex == 1 ? (
          <meta content="noindex, nofollow" name="robots" />
        ) : (
          ampURL && <link rel="amphtml" href={ampURL} />
        )}
        {data.noindex == 1 ? <meta name="googlebot" content="noindex,nofollow" /> : ""}
        {metarobotstag == 1 ? <meta content="index,follow" name="robots" /> : ""}
        {data && data.noindexFollow && data.noindexFollow == 1 ? (
          <meta content="noindex, follow" name="robots" />
        ) : null}
        {langInfo && Array.isArray(langInfo) && langInfo.length ? (
          langInfo.map((item, index) => <link rel="alternate" key={index} hrefLang={item.lang} href={item.url} />)
        ) : data.noindex != 1 || data.type != "topic" ? (
          <link rel="alternate" href={alternateUrl} />
        ) : (
          ""
        )}
        {data.expiry && <meta name="expires" content={data.expiry} />}
        {data.sponsored && <meta property="cr:sponsored" />}
        {data.maxImgPreview && <meta name="robots" content="max-image-preview:large" />}

        {data.noindex != 1 || data.type != "topic" ? <link href={canonical} rel="canonical" /> : ""}
        <meta name="props" content="yes" />
        {modified && <meta httpEquiv="Last-Modified" content={modified} />}
        <meta name="google-site-verification" content="5jF2vNhBpP6iJYYbQwvUv-2WPh3B7O16SpPtd1m3EsM" />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="The Economic Times" />
        <meta property="og:url" content={url} />
        <meta property="og:type" content={type} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        {data && (data.page == "videoshow" || data.page == "videoshownew") && (
          <meta content={getRegion(data.subsecnames)} name="geo.region" />
        )}

        {data.actualURL && (
          <>
            <meta property="al:android:url" content={data.actualURL + "?utm_source=test"} />
            <meta property="al:android:com" content="com.et.reader.activities" />
            <meta property="al:android:app_name" content="The Economic Times" />
          </>
        )}
      </>
    );
  } else {
    meta = (
      <>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <title>{title}</title>
        <meta name="props" content="no" />
      </>
    );
  }

  return <Head>{meta}</Head>;
};

export default Meta;
