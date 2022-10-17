import { SEOProps } from "./seo";
import { versionControlProps } from "./versionControl";

export interface TopicDataProps {
  length: number;
  data: {
    name: string;
    title: string;
    synopsis: string;
    img: string;
    date: string;
    url: string;
    type: string;
  }[];
  name: string;
  title: string;
}
export interface PageProps {
  searchResult: [
    {
      name: string;
      data: {
        name: string;
        title: string;
        synopsis: string;
        img: string;
        date: string;
        url: string;
        type: string;
      }[];
    },
    TopicDataProps
  ];
  seo: SEOProps;
  version_control?: versionControlProps;
  parameters: {
    query: string;
    tab: string;
  };
}
