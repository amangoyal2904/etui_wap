import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ArticleList = dynamic(() => import("containers/ArticleList"));
const ArticleShow = dynamic(() => import("containers/ArticleShow"));
const VideoShow = dynamic(() => import("containers/VideoShow"));
const Home = dynamic(() => import("containers/Home"));
import { wrapper } from "app/store";
import { fetchArticle } from "Slices/article";
import { fetchVideoshow } from "Slices/videoshow";
import { pageType, getMSID } from "utils/utils";
import { useStore } from "react-redux";

export default function All({ page }) {
  const router = useRouter();
  const { all } = router.query;
  const storeState = useStore().getState();
  const data = storeState?.[page]?.data || {};

  if (page == "home") {
    return <Home />;
  } else if (page == "articleshow") {
    return <ArticleShow query={all} data={data} />;
  } else if (page == "videoshow") {
    return <VideoShow data={data} />;
  } else {
    return <ArticleList query={all} />;
  }
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ params, resolvedUrl }) => {
  const { all } = params;
  const lastUrlComponent: string = all?.slice(-1).toString();

  const page = pageType(resolvedUrl);

  if (page == "home") {
    console.log("came in home");
  } else if (page == "articleshow") {
    await store.dispatch(fetchArticle(getMSID(lastUrlComponent)));
  } else if (page == "videoshow") {
    await store.dispatch(fetchVideoshow(getMSID(lastUrlComponent)));
  } else {
    console.log("came in articlelist");
  }

  return {
    props: {
      page
    }
  };
});
