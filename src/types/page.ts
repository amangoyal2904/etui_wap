import { SEOProps } from "./seo";
import { versionControlProps } from "./versionControl";
export interface PageProps {
  searchResult: [
    {
      name: string;
      data: object;
    },
    widgetProps
  ];
  seo: SEOProps;
  version_control?: versionControlProps;
  parameters: object;
}
export interface widgetProps {
  data: {
    img: string;
    title: string;
    url: string;
    type: string;
  }[];
  title: string;
  name: string;
}
