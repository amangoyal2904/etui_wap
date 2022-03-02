export interface SEOProps {
  data: {
    lang: string;
    title: string;
    url: string;
    actualURL: string;
    canonical: string;
    type: string; // e.g. article
    description: string;
    image: string;
    inLanguage: string;
    authors?: string[],
    agency?: string[],
    date: string;
    updated: string;
    articleSection?: number;
    story?: string;
    remove_paywall_schema?: number;
    behindLogin?: number;
    hostid: number;
    langInfo?: {url: string; lang: string}[];
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
    };
    schemaType?: string;
    schemaMeta?: string;
    seoschema?: object;
    breadcrumb?: {title: string; url: string;}[];
    seoListData?: {url: string; title: string; date: string; img: string;}[]; // needed for articlelist and topic
  };
  page: string;
}