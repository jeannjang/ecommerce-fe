import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { showToastMessage } from "../features/common/uiSlice";

const PrivateRoute = ({ permissionLevel }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // admin이 customer route로
  if (user.level === "admin" && permissionLevel === "customer") {
    dispatch(
      showToastMessage({
        message:
          "Admin cannot place orders. Please log in with a personal account.",
        status: "warning",
      })
    );
    return <Navigate to="/" />;
  }

  // customer가 admin route로
  if (user.level === "customer" && permissionLevel === "admin") {
    dispatch(
      showToastMessage({
        message: "Admin permission required",
        status: "error",
      })
    );
    return <Navigate to="/" />;
  }

  // permissionLevel 일치
  if (user.level === permissionLevel) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;
