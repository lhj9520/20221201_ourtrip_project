import React, { useContext } from "react";

import { SessionContext } from "../App";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const { loginSession } = useContext(SessionContext);

  return loginSession ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
