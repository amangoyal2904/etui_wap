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
import Head from "next/head";

const ArticleList = dynamic(() => import("containers/ArticleList"));
const ArticleShow = dynamic(() => import("containers/ArticleShow"));
const VideoShow = dynamic(() => import("containers/VideoShow"));
const VideoShowNew = dynamic(() => import("containers/VideoShowNew"));
const Home = dynamic(() => import("containers/Home"));
const Topic = dynamic(() => import("containers/Topic"));
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

interface PageProps {
  page?: string;
  isprimeuser?: number;
  response?: any;
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
    case "videoshownew":
      container = <VideoShowNew {...data} />;
      break;
    case "articleshow":
      container = <ArticleShow {...data} />;
      break;
    case "topic":
      container = <Topic {...data} />;
      break;
    default:
      container = <ArticleList {...data} />;
      break;
  }
  return container;
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { response, page, isprimeuser }: PageProps = pageProps;

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
    <>
      <Head>
        <link
          href="https://m.economictimes.com/et_fonts.cms?minify=1&amp;v=6&amp;type=3"
          type="text/css"
          rel="stylesheet"
          media="all"
        />
      </Head>
      <Layout>
        <Container objVc={versionControl} isprimeuser={isprimeuser} page={page} data={data} />
      </Layout>
    </>
  );
};

export default wrapper.withRedux(MyApp);
