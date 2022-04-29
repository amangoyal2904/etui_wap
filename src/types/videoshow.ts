import { SEOProps } from "./seo";

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
  relKeywords: {
    title: string;
    url: string;
  }[];
  iframeUrl: string;
  title: string;
  synopsis: string;
  agency: string;
  date: string;
  url: string;
  views: string | number;
}
interface CommonConfigProps {
  seo?: {
    org_img?: string;
    org_img_hin?: string;
  };
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
  common_config?: CommonConfigProps;
}
