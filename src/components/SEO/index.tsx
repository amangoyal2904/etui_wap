import { NextPage } from "next";
import Meta from "./Meta";
import Schema from "./Schema";

const SEO: NextPage<any> = (props) => {  
  return (
    <>      
      <Meta {...props}/>
      <Schema {...props}/>      
    </>
  );
};

export default SEO;
