import '../styles/globals.css';
import {useEffect} from 'react';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { useRouter } from 'next/router'
import { callJsOnRouteChange, InitialJsOnAppLoad } from '../utils/priority';
import {wrapper} from '../app/store';
declare global {
  interface Window {
    initalJsCalled: any;
  }
}
 const MyApp = ({ Component, pageProps }: AppProps) => {

  const router = useRouter();

  if (typeof window != 'undefined' && !window.initalJsCalled) {
    window.initalJsCalled = true;
    InitialJsOnAppLoad();
  }
  useEffect(() => {
    // event registered on every route change
    router.events.on('routeChangeComplete', handleRouteChange);
  }, [])

  const handleRouteChange = (url) => {
    callJsOnRouteChange(url);
  };
  return (
    <Provider store={store}>
      <Layout>
          <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default wrapper.withRedux(MyApp);
