import { FC } from "react";
import Link from "next/link";
interface pageProps {
  data: object;
}

const ArticleList: FC<pageProps> = (props) => {
  return (
    <>
      <h1>ArticleList</h1>
      <div>
        <Link href="/">
          <a>Back Home</a>
        </Link>
      </div>
    </>
  );
};

export default ArticleList;
