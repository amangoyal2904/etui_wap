// components/Layout.js
import { FC, ReactElement, ReactNode } from "react";
import Headers from "./Head";
import Scripts from "./Scripts";
import AppHeader from "./AppHeader";
import Footer from "components/Footer";
import { useRouter } from "next/router";

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
      <Scripts objVc={objVc} isprimeuser={isprimeuser} />
      <Footer />
    </>
  );
};

export default Layout;
