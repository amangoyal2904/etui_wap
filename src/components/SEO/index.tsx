import Meta from "./Meta";
import Schema from "./Schema";
import { SEOProps } from "types/seo";

const SEO = (props: SEOProps) => {
  return (
    <>
      <Meta {...props} />
      <Schema {...props} />
    </>
  );
};

export default SEO;
