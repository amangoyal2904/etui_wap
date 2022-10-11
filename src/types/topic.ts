import { SEOProps } from "./seo";
import { versionControlProps } from "./versionControl";

export interface  TopicDataProps {
  length: number;
  data: {
    title: string;
    synopsis: string;
    img: string;
    date: string;
    url: string;
    type: string;
  }[];
  name:string;
  title: string;

}
export interface PageProps {
  searchResult: [
    {
      name: string;
      data: TopicDataProps;
    },
    TopicDataProps
    
  ];
  seo: SEOProps;
  version_control?: versionControlProps;
  parameters:{
    query:string;
    type:string;
  }
}
