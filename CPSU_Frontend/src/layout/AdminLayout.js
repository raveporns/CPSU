import React from "react";
import Headers from "../component/header";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import Menu from "../component/menu";

const AdminLayout = ({ children }) => {
  return (
    <>
      <Headers />
      <Navbar />

      <div className="container-fluid mt-4 px-4">
        <div className="row">
          
          {/* Sidebar */}
          <div className="col-md-2">
            <Menu />
          </div>

          {/* Main Content */}
          <div className="col-md-10">
            {children}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminLayout;
