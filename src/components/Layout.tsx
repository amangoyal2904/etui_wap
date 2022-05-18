// components/Layout.js
import { FC, ReactElement, ReactNode } from "react";
import Headers from "./Head";
import Scripts from "./Scripts";
import AppHeader from "./AppHeader";
import Footer from "components/Footer";

const Layout: FC = ({ children }: { children: ReactElement }) => {
  const { props } = children;
  const { objVc, isprimeuser } = props;
  return (
    <>
      <Headers isprimeuser={isprimeuser} />
      <AppHeader />
      <main>{children}</main>
      <Scripts objVc={objVc} isprimeuser={isprimeuser} />
      <Footer />
    </>
  );
};

export default Layout;
