import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script'

import * as Config from './../utils/common';

interface Props {
  isprimeuser?: number
}

const Headers: NextPage<Props> = ({isprimeuser}) => {
  const router = useRouter();
  const reqData = router.query;
  const isReady = router.isReady;

  const prefetchDomains = !isprimeuser
  ? <>
              <link rel="dns-prefetch" href="https://cm.g.doubleclick.net" />
              <link rel="dns-prefetch" href="https://stats.g.doubleclick.net"/>
              <link rel="dns-prefetch" href="https://securepubads.g.doubleclick.net"/>
              <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net"/>
              <link rel="dns-prefetch" href="https://sb.scorecardresearch.com"/>
              <link rel="dns-prefetch" href="https://b.scorecardresearch.com"/>
              <link rel="dns-prefetch" href="https://ade.clmbtech.com"/>
              <link rel="dns-prefetch" href="https://static.clmbtech.com"/>
              <link rel="dns-prefetch" href="https://googletagservices.com"/>
              <link rel="dns-prefetch" href="https://commondatastorage.googleapis.com"/>
              <link rel="dns-prefetch" href="https://c1.adform.net"/>
              <link rel="dns-prefetch" href="https://bs.serving-sys.com"/>
              <link rel="dns-prefetch" href="https://ase.clmbtech.com"/>
              <link rel="dns-prefetch" href="https://image6.pubmatic.com"/>
              <link rel="dns-prefetch" href="https://ads.pubmatic.com"/>
              <link rel="dns-prefetch" href="https://bcp.crwdcntrl.net"/>
              <link rel="dns-prefetch" href="https://tpc.googlesyndication.com"/>
              <link rel="dns-prefetch" href="https://adservice.google.com"/>
              <link rel="dns-prefetch" href="https://adservice.google.co.in"/>
              <link rel="dns-prefetch" href="https://images.outbrainimg.com"/>
              <link rel="dns-prefetch" href="https://survey.survicate.com"/>
              <link rel="dns-prefetch" href="https://surveys-static.survicate.com"/>
              <link rel="dns-prefetch" href="https://s0.2mdn.net"/>
              <link rel="dns-prefetch" href="https://static.adsafeprotected.com"/>
              <link rel="dns-prefetch" href="https://pixel.adsafeprotected.com"/>
              <link rel="dns-prefetch" href="https://googletagmanager.com"/>
              <link rel="dns-prefetch" href="https://js-sec.indexww.com"/>
              <link rel="dns-prefetch" href="https://static.criteo.net"/>
              <link rel="dns-prefetch" href="https://accounts.google.com"/>
              <link rel="dns-prefetch" href="https://gstatic.com"/>
              <link rel="dns-prefetch" href="https://fonts.googleapis.com"/>
              <link rel="dns-prefetch" href="https://ad.doubleclick.net"/>
              <link rel="dns-prefetch" href="https://api.ibeat-analytics.com"/>
              <link rel="dns-prefetch" href="https://tml.clmbtech.com"/>
              <link rel="dns-prefetch" href="https://px.ads.linkedin.com"/>
              <link rel="dns-prefetch" href="https://secure-assets.rubiconproject.com"/>
              <link rel="dns-prefetch" href="https://snap.licdn.com"/>
              <link rel="dns-prefetch" href="https://apw.economictimes.indiatimes.com"/>
              <link rel="dns-prefetch" href="https://match.adsrvr.org"/>
              <link rel="dns-prefetch" href="https://htlb.casalemedia.com"/>
              <link rel="dns-prefetch" href="https://timesinternet-d.openx.net"/>
              <link rel="dns-prefetch" href="https://bidder.criteo.com"/>
              <link rel="dns-prefetch" href="https://ib.adnxs.com"/>
              <link rel="dns-prefetch" href="https://as-sec.casalemedia.com"/>
              <link rel="dns-prefetch" href="https://ads.yahoo.com"/>
              <link rel="dns-prefetch" href="https://sync.1rx.io"/>
              <link rel="dns-prefetch" href="https://sync-dsp.ad-m.asia"/>
              <link rel="dns-prefetch" href="https://b1sync.zemanta.com"/>
              <link rel="dns-prefetch" href="https://id.rlcdn.com"/>
              <link rel="dns-prefetch" href="https://stags.bluekai.com"/>
              <link rel="dns-prefetch" href="https://c.amazon-adsystem.com"/>
</> : null;

  return (
    <>
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="generator" content="React" />
        <meta name="viewport" content="width=device-width, height=device-height,initial-scale=1.0,user-scalable=yes,maximum-scale=5" />
        <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
        <meta httpEquiv="" content="IE=edge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge,chrome=1" />
        <meta content="yes" name="apple-touch-fullscreen" />
        <link rel="dns-prefetch" href="https://jssocdn.indiatimes.com/" />
        <link rel="dns-prefetch" href="https://jsso.indiatimes.com/" />
        <link rel="dns-prefetch" href="https://img.etimg.com/" />
        <link rel="dns-prefetch" href="https://js.etimg.com/" />
        <link rel="dns-prefetch" href="https://geoapiet.indiatimes.com/" />
        <link rel="dns-prefetch" href="https://etpwaapi.economictimes.com/" />
        <link rel="dns-prefetch" href="https://static.growthrx.in/" />
        <link rel="dns-prefetch" href="https://etusers.economictimes.indiatimes.com/" />
        <link rel="dns-prefetch" href="https://economictimes.indiatimes.com/" />
        <link rel="dns-prefetch" href="https://mobilelivefeeds.indiatimes.com/" />
        <link rel="dns-prefetch" href="https://google-analytics.com/" />
        <link rel="dns-prefetch" href="https://api.growthrx.in/" />
        <link rel="dns-prefetch" href="https://s3.amazonaws.com/" />
        <link rel="dns-prefetch" href="https://ping.chartbeat.net/" />
        <link rel="dns-prefetch" href="https://static.chartbeat.com" />
        <link rel="dns-prefetch" href="https://cdn.mouseflow.com" />
        <link rel="dns-prefetch" href="https://google.com" />
        <link rel="dns-prefetch" href="https://google.co.in" />
        <link rel="dns-prefetch" href="https://facebook.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://etup.economictimes.indiatimes.com" />
        <link rel="dns-prefetch" href="https://etprecos.economictimes.indiatimes.com" />
        <link rel="dns-prefetch" href="https://etsub3.economictimes.com" />
        <link rel="dns-prefetch" href="https://etusers1.economictimes.com" />
        <link rel="dns-prefetch" href="https://mytimes.indiatimes.com" />
        <link rel="dns-prefetch" href="https://agi-static.indiatimes.com" />
        <link rel="dns-prefetch" href="https://idm.economictimes.com" />
        <link rel="dns-prefetch" href="https://marketservices.indiatimes.com/" />
        {
          prefetchDomains
        }
  
          
      </Head>
      <Script src="https://m.economictimes.com/geoapiet/?cb=et" ></Script>
      {
        !reqData.opt &&
        !isprimeuser && isReady && 
        <>
        <Script src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" strategy="lazyOnload"  onLoad={() => {
           const gptLoaded = new Event('gptLoaded');
          document.dispatchEvent(gptLoaded);
        }} />
        {
          router.asPath.indexOf("skip_ctn=1") == -1 && <Script src="https://static.clmbtech.com/ad/commons/js/2501/colombia_v2.js" strategy="lazyOnload" onLoad={() => {
           
          }} />
        }
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', '${Config.GA.GA_ID}', 'auto');
              ga('send', 'pageview');
              const gaLoaded = new Event('gaLoaded');
              document.dispatchEvent(gaLoaded);
              `,
          }}
        />

        </>
      }
    
    </>
  )
}

Headers.getInitialProps = async ({ req }) => {
  const isprimeuser = req && req.headers && req.headers.primetemplate ? 1 : 0;
  return { isprimeuser }
}

export default Headers
