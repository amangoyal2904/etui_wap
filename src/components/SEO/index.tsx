import { NextPage } from "next";
import Meta from "./Meta";
import Schema from "./Schema";
import { SEOProps } from "./types";

const SEO: NextPage<SEOProps> = (props) => {
  return (
    <>
      <Meta {...props} />
      <Schema {...props} />
    </>
  );
};

export default SEO;
