import React from "react";
import { TbFaceIdError } from "react-icons/tb";
import '../css/Error.css'
import {Link, useNavigate} from 'react-router-dom';

const Error = ({ message ,btntext,path="/"}) => {

  const navigate=useNavigate();

  return (
    <div className="error">
      <TbFaceIdError size={65} className="icon"/>
      <h1>{message}</h1>
      {btntext && <button onClick={()=>navigate(path)}>{btntext}</button>}
    </div>
  );
};

export default Error;
