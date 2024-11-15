import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import RequireAuth from "./Components/RequireAuth";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Header from "./Components/Header";
import Contact from "./Pages/Contact";
import VendorList from "./Pages/VendorList";
import VendorDetail from "./Pages/VendorDetail";
import Profile from "./Pages/Auth/Profile";
import PageNotFound from "./Pages/PageNotFound";
import VendorLogin from "./Pages/Auth/VendorAuth.jsx/VendorLogin";
import VendorHome from "./Pages/Vendor/VendorHome";
import { useSelector } from "react-redux";

const App = () => {
  const { role } = useSelector((state) => state?.auth);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/vendor/login" element={<VendorLogin />} />

        <Route
          path="/"
          element={
            role === "VENDOR" ? (
              <Navigate to="/vendor/dashboard" replace />
            ) : (
              <Home />
            )
          }
        />

        <Route
          path="/register"
          element={
            role === "VENDOR" ? (
              <Navigate to="/vendor/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/vendor-list"
          element={
            role === "VENDOR" ? (
              <Navigate to="/vendor/dashboard" replace />
            ) : (
              <VendorList />
            )
          }
        />
        <Route
          path="/contact"
          element={
            role === "VENDOR" ? (
              <Navigate to="/vendor/dashboard" replace />
            ) : (
              <Contact />
            )
          }
        />

        <Route element={<RequireAuth allowedRoles={["USER"]} />}>
          <Route path="/vendor-detail" element={<VendorDetail />} />
          <Route path="/profile/:fullName" element={<Profile />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["VENDOR"]} />}>
          <Route path="/vendor/dashboard" element={<VendorHome />} />
          <Route path="/profile/:fullName" element={<Profile />} />
        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
