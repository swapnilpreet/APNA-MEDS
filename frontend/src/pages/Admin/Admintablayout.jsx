import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./css/AdminTabsLayout.css";
import { ToastContainer } from "react-toastify";

const Admintablayout = () => {
   return (
    <div className="admin-wrapper">
      <ToastContainer/>
      <h1 className="admin-title">Admin Panel</h1>
      <div className="admin-tabs">
        <NavLink to="orderstabs" className="admin-tab">
          Orders
        </NavLink>
        <NavLink to="medicinestabs" className="admin-tab">
          Medicines
        </NavLink>
        <NavLink to="userstabs" className="admin-tab">
          Users
        </NavLink>
        <NavLink to="statstabs" className="admin-tab">
          Stats
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}

export default Admintablayout