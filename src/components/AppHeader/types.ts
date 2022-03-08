export interface MenuSecProps {
  title: string;
  logo?: string;
  msid?: number;
  url?: string;
  shorturl?: string;
  sec?: MenuSecProps[];
}
export interface MenuProps {
  logo?: string;
  url?: string;
  title?: string;
  sec?: MenuSecProps[];
}