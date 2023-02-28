export interface BreadCrumbProps {
  title: string;
  url?: string;
}

export interface SEOProps {
  lang?: string;
  title?: string;
  url?: string;
  actualURL?: string;
  canonical?: string;
  type?: string; // e.g. article
  description?: string;
  image?: string;
  inLanguage?: string;
  authors?: string[];
  agency?: string[];
  date?: string;
  updated?: string;
  articleSection?: string;
  story?: string;
  remove_paywall_schema?: number;
  behindLogin?: number;
  hostid?: number;
  langInfo?: { url: string; lang: string }[];
  ampURL?: string;
  keywords?: string;
  news_keywords?: string;
  noindex?: number;
  noindexFollow?: number;
  expiry?: string;
  sponsored?: number;
  maxImgPreview?: number;
  isPrime?: number;
  subsecnames?: {
    subsec1?: number;
    subsecname1?: string;
    subsec2?: number;
    subsecname2?: string;
    subsec3?: number;
    subsecname3?: string;
    subsec4?: number;
    subsecname4?: string;
    subsec5?: number;
    subsecname5?: string;
  };
  schemaType?: string;
  schemaMeta?: string;
  seoschema?: {
    webPage?: object;
    newsArticle?: object;
    videoObject?: object;
  };
  org_img?: string;
  org_img_hin?: string;
  page?: string;
  breadcrumb?: BreadCrumbProps[];
  seoListData?: { url: string; title: string; date: string; img: string }[]; // needed for articlelist and topic
}
export interface WebPageSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  publisher?: {
    type?: string;
    name?: string;
    url?: string;
    logo?: {
      type?: string;
      url?: string;
    };
  };
}
export interface NewsArticleSchemaProps {
  inLanguage?: string;
  keywords?: string;
  headline?: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  name?: string;
  url?: string;
  mainEntityOfPage?: string;
  articleSection?: string;
  articleBody?: string;
  image?: {
    type?: string;
    url?: string;
    width?: string;
    height?: string;
  };
  author?: {
    type?: string;
    name?: string;
  };
  publisher?: {
    type?: string;
    name?: string;
    logo?: {
      type?: string;
      url?: string;
      width?: string;
      height?: string;
    };
  };
}
export interface VideoObjectSchemaProps {
  thumbnailUrl?: string;
  uploadDate?: string;
  datePublished?: string;
  dateModified?: string;
  name?: string;
  description?: string;
  keywords?: string;
  inLanguage?: string;
  contenturl?: string;
  duration?: string;
  publisher?: {
    name?: string;
    logo?: {
      url?: string;
      width?: string;
      height?: string;
    };
  };
  potentialAction?: {
    urlTemplate?: string;
    valueRequired?: boolean;
    valueName?: string;
  };
  image?: {
    url?: string;
    width?: string;
    height?: string;
  };
}
export interface SearchResultProps {
  headline?: string;
  description?: string;
  url?: string;
  mainEntityOfPage?: string;
}
export interface CollectionPageProps {
  headline?: any;
  url?: any;
  description?: any;
  hasPart?: any;
}
