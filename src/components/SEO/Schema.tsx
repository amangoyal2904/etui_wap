import {
  SEOProps,
  WebPageSchemaProps,
  NewsArticleSchemaProps,
  VideoObjectSchemaProps,
  BreadCrumbProps
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
    contentUrl,
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
    contentUrl,
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

const Schema = (props: SEOProps) => {
  const data = props;
  const { schemaType, page } = data;

  let schema: object | string[] = {};
  const seoschema = data.seoschema || {};

  if (schemaType === "videoshow" || page === "videoshow") {
    const _breadcrumbSchema = breadcrumbSchema(data.breadcrumb);
    const _webPageSchema = webPageSchema(seoschema.webPage);
    const _newsArticleSchema = newsArticleSchema(seoschema.newsArticle);
    const _organizationSchema = organizationSchema(data.org_img);
    const _videoObjectSchema = videoObjectSchema(seoschema.videoObject);
    schema = [_breadcrumbSchema, _webPageSchema, _newsArticleSchema, _organizationSchema, _videoObjectSchema];
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
};

export default Schema;
