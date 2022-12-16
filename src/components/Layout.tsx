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

  return (
    <>
      <Headers isprimeuser={isprimeuser} reqData={reqData} />
      <AppHeader page={page} />
      <main>{children}</main>
      <PrivacyPolicy />
      <Scripts objVc={objVc} isprimeuser={isprimeuser} />
      {page !== "quickreads" && <Footer dynamicFooterData={dynamicFooterData} />}
    </>
  );
};

export default Layout;
