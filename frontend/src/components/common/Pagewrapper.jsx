import React from "react";
import "../css/Pagewrapper.css";

const Pagewrapper = ({ children }) => {
  return <div className="wrapper">{children}</div>;
};

export default Pagewrapper;
