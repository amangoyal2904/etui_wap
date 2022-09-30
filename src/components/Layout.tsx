// components/Layout.js
import { FC, ReactElement } from "react";
import Headers from "./Head";
import Scripts from "./Scripts";
import AppHeader from "./AppHeader";
import Footer from "components/Footer";
import { useRouter } from "next/router";
import PrivacyPolicy from "components/PrivacyPolicy";
import Script from "next/script";

const Layout: FC = ({ children }: { children: ReactElement }) => {
  const { props } = children;
  const { objVc, isprimeuser } = props;

  const router = useRouter();
  const reqData = router.query;

  return (
    <>
      <Headers isprimeuser={isprimeuser} reqData={reqData} />
      <AppHeader />
      <main>{children}</main>
      {reqData?.all?.includes("videoshownew") && (
        <>
          <Script strategy="lazyOnload" src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" />
          <Script
            strategy="lazyOnload"
            src="https://tvid.in/sdk/loader.js"
            onLoad={() => {
              const objSlikeScriptsLoaded = new Event("objSlikeScriptsLoaded");
              document.dispatchEvent(objSlikeScriptsLoaded);
            }}
          />
        </>
      )}
      <PrivacyPolicy />
      <Scripts objVc={objVc} isprimeuser={isprimeuser} />
      <Footer />
    </>
  );
};

export default Layout;
