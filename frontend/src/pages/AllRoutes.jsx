import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedPage from "../components/Protect/ProtectedPage";
import Profile from "./Profile/Profile";
import SingleMedicine from "./SingleMedicine/SingleMedicine";
import AdminProtected from "../components/Protect/AdminProtected";
import Login from "./User/Login";
import Signup from "./User/Signup";
import Home from "./Home/Home";
import Cart from "./Cart/Cart";
import MyOrder from "./MyOrder/MyOrder";
import Address from "./Profile/Address";
import Patients from "./Profile/Patients";
// import StatsTabs from "./Admin/StatsTabs";
// import UserTabs from "./Admin/UserTabs";
// import MedicinesTabs from "./Admin/MedicinesTabs";
// import OrderTabs from "./Admin/OrderTabs";
// import AdminTabsLayout from "./Admin/AdminTabsLayout";
import "react-toastify/dist/ReactToastify.css";
import AIsuggestion from "./AI/AIsuggestion";
import VerifyEmail from "../components/common/VerifyEmail";
// import UserTabs from "./Admin/UserTabs";
import Usertab from "./Admin/Usertab";
import Starstab from "./Admin/Starstab";
import Ordertab from "./Admin/Ordertab";
import Medicinetabs from "./Admin/Medicinetabs";
import Admintablayout from "./Admin/Admintablayout";
import Recommendations from "./Recommendations/Recommendations";

const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/"
          element={
            <ProtectedPage>
              <Home />
            </ProtectedPage>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedPage>
              <Profile />
            </ProtectedPage>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedPage>
              <Address />
            </ProtectedPage>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedPage>
              <Patients />
            </ProtectedPage>
          }
        />
        <Route
          path="/medicine/:id"
          element={
            <ProtectedPage>
              <SingleMedicine />
            </ProtectedPage>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedPage>
              <Cart />
            </ProtectedPage>
          }
        />
        <Route
          path="/myorders"
          element={
            <ProtectedPage>
              <MyOrder />
            </ProtectedPage>
          }
        />
        <Route
          path="/ai-suggestions"
          element={
            <ProtectedPage>
              <AIsuggestion />
            </ProtectedPage>
          }
        />
        <Route
          path="/suggestions"
          element={
            <ProtectedPage>
              <Recommendations />
            </ProtectedPage>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedPage>
              <AdminProtected>
                <Admintablayout />
              </AdminProtected>
            </ProtectedPage>
          }
        >
          <Route
            path="orderstabs"
            element={
              <ProtectedPage>
                <AdminProtected>
                  <Ordertab />
                </AdminProtected>
              </ProtectedPage>
            }
          />
          <Route
            path="medicinestabs"
            element={
              <ProtectedPage>
                <AdminProtected>
                  <Medicinetabs />
                </AdminProtected>
              </ProtectedPage>
            }
          />
          <Route
            path="userstabs"
            element={
              <ProtectedPage>
                <AdminProtected>
                  <Usertab />
                </AdminProtected>
              </ProtectedPage>
            }
          />
          <Route
            path="statstabs"
            element={
              <ProtectedPage>
                <AdminProtected>
                  <Starstab />
                </AdminProtected>
              </ProtectedPage>
            }
          />
        </Route>
      </Routes>
    </>
  );
};
export default AllRoutes;
