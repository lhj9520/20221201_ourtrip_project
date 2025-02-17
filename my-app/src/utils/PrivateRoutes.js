import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { SessionContext } from "../App";

const PrivateRoutes = () => {
  const { loginSession } = useContext(SessionContext);

  return loginSession ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
