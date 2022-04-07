// components/Layout.js
import { FC } from "react";
import Headers from "./Head";
import AppHeader from "./AppHeader";
import Footer from "components/Footer";

const Layout: FC = ({ children }) => {
  return (
    <>
      <Headers />
      <AppHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
