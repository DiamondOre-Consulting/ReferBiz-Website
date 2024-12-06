import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { userProfile } from "../Redux/Slices/authSlice";

const RequireAuth = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = useSelector((state) => state?.auth?.data?.role);

  const location = useLocation();

  useEffect(() => {
    console.log(1);
    // setLoading(true);
    const fetchData = async () => {
      try {
        const res = await dispatch(userProfile());
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dispatch, isLoggedIn, location.pathname]);

  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn);
    console.log("role:", role);
  }, [isLoggedIn, role]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/denied" />;
  }

  return <Outlet />;
};

export default RequireAuth;
