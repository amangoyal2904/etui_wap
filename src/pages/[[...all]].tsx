import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ArticleList = dynamic(() => import("containers/ArticleList"));
const ArticleShow = dynamic(() => import("containers/ArticleShow"));
const VideoShow = dynamic(() => import("containers/VideoShow"));
const Home = dynamic(() => import("containers/Home"));
import { wrapper } from "app/store";
import { fetchArticle } from "Slices/article";
import { useStore } from "react-redux";
import { pageType } from "utils/utils";
import { setCommonData } from "Slices/common";
interface Query {
  all: string[];
}

export default function All(props) {
  const router = useRouter();
  const { all } = router.query;
  console.log(all, props);
  let storeState = useStore().getState();
  if (props.page && props.page == "home") {
    return <Home />;
  } else if (props.page && props.page == "articleshow") {
    return <ArticleShow query={all} data={storeState.article} />;
  } else if (props.page && props.page == "videoshow") {
    return <VideoShow query={all} data={props.data} />;
  } else {
    return <ArticleList query={all} />;
  }
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, resolvedUrl }) => {
      const { all } = params;
      const lastUrlComponent: string = all?.slice(-1).toString();

      let page = pageType(resolvedUrl);
      let data = {};
      let subsecData = {
        subsec: {
          subsec1: "",
          subsec2: "",
          subsec3: "",
          subsec4: "",
          subsec5: "",
        },
      };

      if (page == "home") {
        console.log("came in home");
      } else if (page == "articleshow") {
        await store.dispatch(fetchArticle(lastUrlComponent.split(".cms")[0]));
      } else if (page == "videoshow") {
        let url =
          "https://etdev8243.indiatimes.com/reactfeed.cms?feedtype=etjson&type=videoshow&msid=90067526&platform=wap";
        // const { data } = await Service.get(url);
        let res = await fetch(url);
        data = await res.json();
        subsecData.subsec = data?.seo.subsecnames;
      } else {
        console.log("came in articlelist");
      }

      await store.dispatch(setCommonData(subsecData));
      return {
        props: {
          page,
          data,
        },
      };
    }
);
