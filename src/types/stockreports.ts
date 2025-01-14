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
  title: string;
  synopsis: string;
  agency: string;
  authors: any;
  date: string;
  url: string;
}
export interface StocksTabs {
  tabs: {
    name: string;
    apiType: string;
  }[];
}
export interface PageProps {
  searchResult: [
    {
      name: string;
      data: StockReportsProps;
      stockapitype: string;
      faq: any;
    },
    {
      name: string;
      data: StockOverViewProps;
      stockapitype: string;
      faq: any;
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
    apiType: string;
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
  btmBlocker: {
    text: string;
    ctaText: string;
  };
}

export interface StockOverViewProps {
  totalRecords: string;
  id: string;
  name: string;
  dataList: any[];
}
