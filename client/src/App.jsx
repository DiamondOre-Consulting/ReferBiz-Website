import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import RequireAuth from "./Components/RequireAuth";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Header from "./Components/Header";
import Contact from "./Pages/Contact";
import { VendorContact } from "./Pages/Vendor/VendorContact";
import VendorList from "./Pages/VendorList";
import AboutUs from "./Pages/AboutUs";
import VendorDetail from "./Pages/VendorDetail";
import Profile from "./Pages/Auth/Profile";
import PageNotFound from "./Pages/PageNotFound";
import VendorLogin from "./Pages/Auth/VendorAuth.jsx/VendorLogin";
import VendorHome from "./Pages/Vendor/VendorHome";
import { useSelector } from "react-redux";
import { Product } from "./Pages/Vendor/Product";
import { CustomerList } from "./Pages/Vendor/CutomerList";
import { VendorProfile } from "./Pages/Vendor/VendorProfile";
import { VendorStore } from "./Pages/Vendor/VendorStore";

const App = () => {
  const { role } = useSelector((state) => state?.auth);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/about-us/" element={<AboutUs />} />

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
          <Route path={`/vendor-detail/:id`} element={<VendorDetail />} />
          <Route path="/profile/:fullName" element={<Profile />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["VENDOR"]} />}>
          <Route path="/vendor/dashboard" element={<VendorHome />} />
          <Route path="/profile/:fullName" element={<Profile />} />
          <Route path="/product-list" element={<Product />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/vendor-stores" element={<VendorStore />} />
          <Route path="/vendor-profile" element={<VendorProfile />} />
          <Route path="/vendor-contact" element={<VendorContact />} />
        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
