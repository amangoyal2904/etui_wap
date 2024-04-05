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
export interface VideoShowProps {
  img: string;
  hostid: string;
  msid: string;
  hideAds: number;
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
export interface PageProps {
  searchResult: [
    {
      name: string;
      data: VideoShowProps;
    },
    OtherVidsProps
  ];
  seo: SEOProps;
  version_control?: versionControlProps;
  parameters: {
    msid?: string;
  };
}
