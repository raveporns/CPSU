import React from "react";
import "../css/header.css";
import Theme from "./theme";
import ProfileMenu from "../component/ProfileMenu";

const Headers = () => {
  return (
    <div className="header-component d-flex justify-content-end align-items-center gap-3">
      <Theme />
      <ProfileMenu />
    </div>
  );
};

export default Headers;
