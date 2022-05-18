import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { callJsOnRouteChange, InitialJsOnAppLoad } from "../utils/priority";
import { wrapper } from "../app/store";
import dynamic from "next/dynamic";
const ArticleList = dynamic(() => import("containers/ArticleList"));
const ArticleShow = dynamic(() => import("containers/ArticleShow"));
const VideoShow = dynamic(() => import("containers/VideoShow"));
const Home = dynamic(() => import("containers/Home"));
import NotFound from "containers/NotFound";

const Container = ({ page, data }) => {
  let container = <NotFound {...data} />;
  switch (page) {
    case "home":
      container = <Home {...data} />;
      break;
    case "videoshow":
      container = <VideoShow {...data} />;
      break;
    case "articleshow":
      container = <ArticleShow {...data} />;
      break;
    default:
      container = <ArticleList {...data} />;
      break;
  }
  return container;
};

declare global {
  interface Window {
    initalJsCalled: boolean;
    objVc: any;
  }
}
const MyApp = ({ Component, pageProps }: AppProps) => {
  const { response, page, isprimeuser } = pageProps;
  const data = response?.[page]?.data || {};
  const versionControl = response?.common?.data?.version_control || {};

  const router = useRouter();

  if (typeof window != "undefined") {
    window.objVc = versionControl || {};
    if (!window.initalJsCalled) {
      window.initalJsCalled = true;
      InitialJsOnAppLoad();
    }
  }
  useEffect(() => {
    // event registered on every route change
    router.events.on("routeChangeComplete", handleRouteChange);
    // eslint-disable-next-line
  }, []);

  const handleRouteChange = (url) => {
    callJsOnRouteChange(url);
  };
  return (
    <Layout>
      <Container page={page} data={data} />
    </Layout>
  );
};

export default wrapper.withRedux(MyApp);
