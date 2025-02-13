import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
// import css
import "./App.css";
// import component
import Join from "./pages/Join";
import Login from "./pages/Login";
import UserFind from "./pages/my/UserFind";
import Main from "./pages/Main";
import Howtouse from "./pages/Howtouse";
import Mymate from "./pages/my/Mymate";
import Mytrip from "./pages/my/Mytrip";
import My from "./pages/my/My";
import Plan from "./pages/plan/Plan";
import Empty from "./pages/Empty";
import PrivateRoutes from "./utils/PrivateRoutes";
import PublicRoutes from "./utils/PublicRoutes";
// import api
import { getLoginSession } from "./api/Auth";

export const SessionContext = React.createContext({});

function App() {
  const seq = "";
  const [loginSession, setLoginSession] = React.useState();
  const [loginType, setLoginType] = React.useState();

  const fetchLoginSession = async () => {
    const { isLogin, type } = await getLoginSession();
    setLoginSession(isLogin);
    setLoginType(type);
  };

  // 로그인 세션 정보 가져오기
  useEffect(() => {
    fetchLoginSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        loginSession,
        loginType,
        fetchLoginSession,
      }}
    >
      {loginSession !== undefined && (
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route exact path="/howtouse" element={<Howtouse />} />

          <Route element={<PublicRoutes />}>
            <Route exact path="/join" element={<Join />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/userfind" element={<UserFind />} />
          </Route>

          <Route element={<PrivateRoutes />}>
            <Route exact path="/mymate" element={<Mymate />} />
            <Route exact path="/mytrip" element={<Mytrip />} />
            <Route exact path="/mytrip/:seq" element={<Plan seq={seq} />} />
            <Route exact path="/my" element={<My />} />
          </Route>

          <Route path="*" element={<Empty />} />
        </Routes>
      )}
    </SessionContext.Provider>
  );
}

export default App;
