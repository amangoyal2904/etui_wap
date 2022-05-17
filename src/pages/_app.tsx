import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Router, { useRouter } from "next/router";
import { callJsOnRouteChange, InitialJsOnAppLoad } from "../utils/priority";
import { wrapper } from "../app/store";
import ProgressBar from "components/PageTransition";

const progress = new ProgressBar({
  size: 2,
  color: "#209cee",
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
  }
}
const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  if (typeof window != "undefined" && !window.initalJsCalled) {
    window.initalJsCalled = true;
    window.objVc = (pageProps && pageProps.objVc) || {};
    InitialJsOnAppLoad();
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
      <Component {...pageProps} />
    </Layout>
  );
};

export default wrapper.withRedux(MyApp);
