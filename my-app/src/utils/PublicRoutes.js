import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { SessionContext } from "../App";

const PublicRoutes = () => {
  const { loginSession } = useContext(SessionContext);

  return loginSession ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;
