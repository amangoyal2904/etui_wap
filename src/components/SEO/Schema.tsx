import {
  SEOProps,
  WebPageSchemaProps,
  NewsArticleSchemaProps,
  VideoObjectSchemaProps,
  BreadCrumbProps,
  SearchResultProps,
  CollectionPageProps
} from "types/seo";

const webPageSchema = (data: WebPageSchemaProps) => {
  if (!data) return null;
  const { name, url, description } = data;
  const publisherData = data.publisher;
  const _schema = {
    "@context": "http://schema.org",
    "@type": "WebPage",
    name,
    url,
    description,
    publisher: {
      "@type": publisherData.type,
      name: publisherData.name,
      url: publisherData.url,
      logo: {
        "@type": publisherData.logo.type,
        url: publisherData.logo.url
      }
    }
  };
  return _schema;
};
const newsArticleSchema = (data: NewsArticleSchemaProps) => {
  if (!data) return null;
  const {
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
    articleBody
  } = data;
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
  };
  return _schema;
};
const organizationSchema = (url: string) => {
  if (!url) return null;
  const _schema = {
    "@context": "http://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Economic Times",
    url: "https://economictimes.indiatimes.com/",
    logo: {
      "@type": "ImageObject",
      url,
      width: 600,
      height: 60
    }
  };
  return _schema;
};
const videoObjectSchema = (data: VideoObjectSchemaProps) => {
  if (!data) return null;
  const {
    thumbnailUrl,
    uploadDate,
    datePublished,
    dateModified,
    name,
    description,
    keywords,
    inLanguage,
    contenturl,
    duration
  } = data;
  const publisherData = data.publisher;
  const _schema = {
    "@context": "http://schema.org",
    "@type": "VideoObject",
    thumbnailUrl,
    uploadDate,
    datePublished,
    dateModified,
    name,
    description,
    keywords,
    inLanguage,
    contenturl,
    duration,
    publisher: {
      "@type": "Organization",
      name: publisherData.name,
      logo: {
        "@type": "ImageObject",
        url: publisherData.logo.url,
        width: publisherData.logo.width,
        height: publisherData.logo.height
      }
    },
    potentialAction: {
      "@type": "SeekToAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: data?.potentialAction?.urlTemplate
      },
      "startOffset-input": {
        "@type": "PropertyValueSpecification",
        valueRequired: data.potentialAction.valueRequired,
        valueName: data.potentialAction.valueName
      }
    },
    image: {
      "@type": "ImageObject",
      url: data.image.url,
      width: data.image.width,
      height: data.image.height
    }
  };
  return _schema;
};
const breadcrumbSchema = (data: BreadCrumbProps[]) => {
  if (Array.isArray(data) && data.length > 0) {
    const itemListArr = [];
    const _data = data;
    if (Array.isArray(_data)) {
      _data.forEach((d, index) => {
        if (d && d.url) {
          itemListArr.push({
            "@type": "ListItem",
            position: `${index + 1}`,
            name: `${d.title}`,
            item: {
              "@id": `${d.url}`
            }
          });
        }
      });
    }
    const schema = {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: itemListArr
    };
    return schema;
  } else {
    return null;
  }
};
const searchResultSchema = (data: SearchResultProps) => {
  if (!data) return null;
  const { headline, description, url, mainEntityOfPage } = data;
  const _schema = {
    "@context": "http://schema.org",
    "@type": "SearchResultsPage",
    headline,
    description,
    url,
    mainEntityOfPage
  };
  return _schema;
};

const collectionPageSchema = (data: CollectionPageProps, hasPartArr) => {
  if (!data) return null;
  const { headline, description, url } = data;
  const _schema = {
    "@context": "http://schema.org",
    "@type": "CollectionPage",
    headline,
    description,
    url,
    hasPart: hasPartArr
  };
  return _schema;
};
const listItemSchema = (seoListData) => {
  const itemListArr = seoListData.map((item, index) => {
    return {
      "@type": "ListItem",
      position: `${index + 1}`,
      url: `${item.url}`,
      name: `${item.title}`
    };
  });
  const _schema = {
    "@context": "http://schema.org",
    "@type": "ItemList",
    itemListElement: itemListArr
  };
  return _schema;
};

const Schema = (props: SEOProps) => {
  const data = props;
  const { schemaType, page, seoListData } = data;
  let hasPartArr = [];

  let schema: object | string[] = {};
  const seoschema = data.seoschema || {};

  if (schemaType === "topic") {
    hasPartArr = seoListData?.map((item, index) => {
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
  }

  const _breadcrumbSchema = breadcrumbSchema(data.breadcrumb);
  const _webPageSchema = webPageSchema(seoschema.webPage);
  const _newsArticleSchema = newsArticleSchema(seoschema.newsArticle);
  const _organizationSchema = organizationSchema(data.org_img);
  const _videoObjectSchema =
    schemaType === "videoshow" || page === "videoshow" ? videoObjectSchema(seoschema.videoObject) : {};
  const _searchResultSchema = schemaType === "topic" ? searchResultSchema(seoschema.newsArticle) : {};
  const _collectionPageSchema = schemaType === "topic" ? collectionPageSchema(seoschema.newsArticle, hasPartArr) : {};
  const _listItemSchema = schemaType === "topic" ? listItemSchema(seoListData) : {};

  let schemaData = [
    _breadcrumbSchema,
    _webPageSchema,
    _newsArticleSchema,
    _organizationSchema,
    _videoObjectSchema,
    _searchResultSchema,
    _collectionPageSchema,
    _listItemSchema
  ];
  schemaData = schemaData.filter((data) => {
    if (data != undefined && Object.keys(data).length !== 0) {
      return true;
    }
    return false;
  });
  schema = schemaData;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
};

export default Schema;
