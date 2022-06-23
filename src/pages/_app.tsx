import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Router, { useRouter } from "next/router";
import { callJsOnRouteChange, InitialJsOnAppLoad } from "../utils/priority";
import { wrapper } from "../app/store";
import ProgressBar from "components/PageTransition";
import NotFound from "containers/NotFound";
import dynamic from "next/dynamic";

const ArticleList = dynamic(() => import("containers/ArticleList"));
const ArticleShow = dynamic(() => import("containers/ArticleShow"));
const VideoShow = dynamic(() => import("containers/VideoShow"));
const Home = dynamic(() => import("containers/Home"));

const progress = new ProgressBar({
  size: 2,
  className: "bar-of-progress",
  delay: 10
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

declare global {
  interface Window {
    initalJsCalled: boolean;
    objVc: any;
    __APP: {
      env?: string;
      login?: any;
    };
    objUser: any;
    objInts: any;
    isprimeuser: number;
    dataLayer: [];
  }
}

const Container = (props) => {
  const { page, data } = props;
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

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { response, page, isprimeuser } = pageProps;
  const data = response?.[page]?.data || {};
  const versionControl = response?.common?.data?.version_control || {};

  const router = useRouter();

  if (typeof window != "undefined") {
    window.objVc = versionControl || {};
    window.isprimeuser = isprimeuser;
    if (!window.initalJsCalled) {
      window.initalJsCalled = true;
      InitialJsOnAppLoad();
    }
  }
  useEffect(() => {
    // event registered on every route change
    router.events.on("routeChangeComplete", callJsOnRouteChange);
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <Container objVc={versionControl} isprimeuser={isprimeuser} page={page} data={data} />
    </Layout>
  );
};

export default wrapper.withRedux(MyApp);
