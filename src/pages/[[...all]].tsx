import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ArticleList = dynamic(() => import("containers/ArticleList"));
const ArticleShow = dynamic(() => import("containers/ArticleShow"));
const VideoShow = dynamic(() => import("containers/VideoShow"));
const Home = dynamic(() => import("containers/Home"));
import { wrapper } from "app/store";
import { fetchArticle } from "Slices/article";
import { pageType } from "utils/utils";
import { setCommonData } from "Slices/common";

export default function All(props) {
  const router = useRouter();
  const { all } = router.query;

  if (props.page && props.page == "home") {
    return <Home />;
  } else if (props.page && props.page == "articleshow") {
    return <ArticleShow query={all} />;
  } else if (props.page && props.page == "videoshow") {
    return <VideoShow data={props.pageData} />;
  } else {
    return <ArticleList query={all} />;
  }
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ params, resolvedUrl }) => {
  const { all } = params;
  const lastUrlComponent: string = all?.slice(-1).toString();

  const page = pageType(resolvedUrl);
  const pageData = {};
  let commonData_store = {
    pageType: page
  };

  if (page == "home") {
    console.log("came in home");
  } else if (page == "articleshow") {
    await store.dispatch(fetchArticle(lastUrlComponent.split(".cms")[0]));
  } else if (page == "videoshow") {
    const url =
      "https://etdev8243.indiatimes.com/reactfeed.cms?feedtype=etjson&type=videoshow&msid=90067526&platform=wap";
    // const { data } = await Service.get(url);
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const { seo } = data;
        commonData_store = Object.assign({}, commonData_store, {
          subsec: seo.subsecnames
        });
        Object.assign(pageData, data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.log("came in articlelist");
  }

  await store.dispatch(setCommonData(commonData_store));

  return {
    props: {
      page,
      pageData
    }
  };
});
