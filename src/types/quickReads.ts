interface NewsItem {
  type: any;
  name: string;
  id: string;
  title: string;
  url: string;
  img: string;
  syn: string;
}
export interface QuickReadsProps {
  seo: any;
  version_control: any;
  parameters: any;
  searchResult: [
    {
      name: string;
      data: NewsItem[];
    }
  ];
}
