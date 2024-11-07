import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ permissionLevel }) => {
  const user = useSelector((state) => state.user.user);

  const isAuthorized =
    user?.level === permissionLevel || user?.level === "admin";

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
