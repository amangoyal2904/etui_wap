import { FC } from "react";

interface pageProps {
  query: string | string[];
}

const ArticleList: FC<pageProps> = ({ query }) => {
  return (
    <>
      <div className="root">ArticleList {query}</div>
    </>
  );
};

export default ArticleList;
