// components/Layout.js
import { FC, ReactElement } from "react";
import Headers from "./Head";
import Scripts from "./Scripts";
import AppHeader from "./AppHeader";
import Footer from "components/Footer";
import { useRouter } from "next/router";
import PrivacyPolicy from "components/PrivacyPolicy";
interface PageProps {
  page: string;
  dynamicFooterData: any;
  children: ReactElement;
}

const Layout: FC<PageProps> = ({ page, dynamicFooterData, children }) => {
  const { props } = children;
  const { objVc, isprimeuser } = props;

  const router = useRouter();
  const reqData = router.query;
  const standalonePages = ["referrals", "redeemtoi"];
  const isStandAlonePage = standalonePages.indexOf(page) > -1;

  return (
    <>
      <Headers isprimeuser={isprimeuser} reqData={reqData} />
      {!["shortvideos"].includes(page) && !isStandAlonePage && <AppHeader page={page} />}
      <main>{children}</main>
      {/* <PrivacyPolicy /> */}
      <Scripts objVc={objVc} isprimeuser={isprimeuser} />
      {!["quickreads", "shortvideos"].includes(page) && !isStandAlonePage && (
        <Footer objVc={objVc} dynamicFooterData={dynamicFooterData} />
      )}
    </>
  );
};

export default Layout;
