import { FC } from "react";
import Meta from "./Meta";
import Schema from "./Schema";
import { SEOProps } from "types/seo";

const SEO: FC<SEOProps> = (props) => {
  return (
    <>
      <Meta {...props} />
      <Schema {...props} />
    </>
  );
};

export default SEO;
