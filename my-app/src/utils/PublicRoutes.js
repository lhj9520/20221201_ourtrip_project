import React, { useContext } from "react";

import { SessionContext } from "../App";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoutes = () => {
  const { loginSession } = useContext(SessionContext);

  return loginSession ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;
