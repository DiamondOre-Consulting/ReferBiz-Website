import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./Pages/PageNotFound";
import { useSelector } from "react-redux";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import RequireAuth from "./Components/RequireAuth";

const App = () => {
  const { role } = useSelector((state) => state?.auth);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth allowedRoles={['ADMIN']} />} >
          <Route path="/" element={<Home />} />

        </Route>
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;