import { SEOProps } from "./seo";
import { versionControlProps } from "./versionControl";

export interface OtherVidsProps {
  data: {
    duration: string;
    img: string;
    title: string;
    url: string;
    views: string;
    type: string;
  }[];
  title: string;
  name: string;
}
export interface StockReportsProps {
  hostid: string;
  msid: string;
  hideAds: number;
  stockapitype: string;
  allowSortFields?: any;
  requestObj?: any;
  pageSummary?: any;
  slikeid?: string;
  relKeywords: {
    title: string;
    url: string;
  }[];
  iframeUrl: string;
  title: string;
  synopsis: string;
  agency: string;
  authors: any;
  date: string;
  url: string;
  views: string | number;
  nextvideo?: number | string;
}
export interface StocksTabs {
  tabs: {
    name: string;
    activeCategory: string;
    array: any;
  }[];
}
export interface PageProps {
  searchResult: [
    {
      name: string;
      data: StockReportsProps;
      stockapitype: string;
      json: StockReportsProps;
    },
    {
      name: string;
      json: StockOverViewProps;
      stockapitype: string;
      data: StockReportsProps;
    }
  ];
  defaultFiterName: string;
  defaultFilerId: string;
  stockapitype: string;
  seo: SEOProps;
  version_control?: versionControlProps;
  parameters: {
    msid?: string;
  };
  tabs: {
    name: string;
    activeCategory: string;
    array: any;
  }[];
  srpluscontent: {
    listItem: any;
    head: string;
    ctaTxt: string;
  };
  overlayBlocker: {
    textForData: string;
    textForReport: string;
    ctaText: string;
    textBenefits: string;
    discCoupon: string;
  };
}

export interface StockOverViewProps {
  totalRecords: string;
  id: string;
  name: string;
  dataList: any[];
  allowSortFields: any;
  requestObj?: any;
  pageSummary?: {
    pageno: any;
    pagesize: any;
    totalRecords: any;
    totalpages: any;
  };
}
