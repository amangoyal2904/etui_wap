// components/Layout.js
import { FC } from "react";
import Headers from "./Head";
import Header from "./AppHeader";
import Footer from "components/Footer";

const Layout: FC = ({ children }) => {
  return (
    <>
      <Headers />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
