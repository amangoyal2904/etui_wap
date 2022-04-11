import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { callJsOnRouteChange, InitialJsOnAppLoad } from "../utils/priority";
import { wrapper } from "../app/store";
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
    window.objVc = pageProps && pageProps.objVc || {}
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
  console.log('process.env: ', process.env.NODE_ENV)
  console.log('objVc data pageProps: ', pageProps)
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default wrapper.withRedux(MyApp);
