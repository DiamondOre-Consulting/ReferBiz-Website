import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./Pages/PageNotFound";
import { useSelector } from "react-redux";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import RequireAuth from "./Components/RequireAuth";
import UsersList from "./Pages/UserList";
import VendorList from "./Pages/VendorList";
import CategoriesList from "./Pages/CategoriesList";
import CategoryDetail from "./Pages/CategoryDetail";
import RegisterVendor from "./Pages/Auth/RegisterVendor";
import VendorDetail from "./Pages/VendorDetail";
import { UserEnquiry } from "./Pages/UserEnquiry";
import { VendorEnquiry } from "./Pages/VendorEnquiry";
import UserDetails from "./Pages/UserDetails";

const App = () => {
  const { role } = useSelector((state) => state?.auth);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/" element={<Home />} />
          <Route path="/user-list" element={<UsersList />} />
          <Route path="/vendor-list" element={<VendorList />} />
          <Route path="/category-list" element={<CategoriesList />} />
          <Route path="/category/:id" element={<CategoryDetail />} />
          <Route path="/register-vendor" element={<RegisterVendor />} />
          <Route path="/vendor/enquiry" element={<VendorEnquiry />} />
          <Route path="/user/:id" element={<UserDetails />} />
          <Route path="/user/enquiry" element={<UserEnquiry />} />
        </Route>
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
