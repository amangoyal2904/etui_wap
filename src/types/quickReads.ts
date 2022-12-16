interface NewsItem {
  id: string;
  title: string;
  url: string;
  img: string;
  syn: string;
}
export interface QuickReadsProps {
  searchResult: [
    {
      name: string;
      data: NewsItem[];
    }
  ];
}
