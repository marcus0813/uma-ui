import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
const Layout = () => {
  return (
    <div className="App">
      <Header />
      <Outlet></Outlet>
      <Footer />
    </div>
  );
};

export default Layout;
