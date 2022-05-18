import Link from "next/link";
import styles from "./NotFound.module.scss";
import DfpAds from "components/Ad/DfpAds";
import SEO from "components/SEO";
import { FC } from "react";
interface PageProps {
  data: object;
}

const ArticleShow: FC<PageProps> = (props) => {
  return (
    <>
      <div className={`${styles.hdAdContainer} adContainer`}>
        <DfpAds adInfo={{ key: "atf" }} />
      </div>
      <div className={styles.notFound}>404 Not Found</div>
      <div>
        <Link href="/">
          <a>Back Home</a>
        </Link>
      </div>
    </>
  );
};

export default ArticleShow;
