import React from "react";
import axios from "axios";
import "./App.css";

import { Route, Routes, useNavigate } from "react-router-dom";

import Join from "./pages/Join";
import Login from "./pages/Login";
import UserFind from "./pages/my/UserFind";
import Main from "./pages/Main";
import Howtouse from "./pages/Howtouse";
import Mymate from "./pages/my/Mymate";
import Mytrip from "./pages/my/Mytrip";
import My from "./pages/my/My";
import Plan from "./pages/plan/Plan";
import Kakao from "./pages/KakaoLogin";
import { BASE_URL } from "./config";

axios.defaults.withCredentials = true;

export const StoreContext = React.createContext({});
export let importsession = () => {};
export let deletesession = () => {};

function App() {
  const navigation = useNavigate();

  const [loginUser, setLoginUser] = React.useState({});

  const seq = "";

  importsession = async () => {
    await axios({
      url: `${BASE_URL}/auth/user`,
    }).then((res) => {
      setLoginUser(res.data);
      if (res.data) {
        setLoginUser(res.data);
      }
    });
  };

  deletesession = async () => {
    await axios({
      url: `${BASE_URL}/auth/logout`,
    }).then((res) => {
      if (res.data) {
        setLoginUser(res.data);
        navigation("/");
      }
    });
  };

  React.useEffect(() => {
    importsession();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        loginUser: loginUser,
      }}
    >
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/join" element={<Join />} />
        <Route exact path="/oauth/callback/kakao" element={<Kakao />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/userfind" element={<UserFind />} />
        <Route exact path="/howtouse" element={<Howtouse />} />
        <Route exact path="/mymate" element={<Mymate />} />
        <Route exact path="/mytrip" element={<Mytrip />} />
        <Route exact path="/mytrip/:seq" element={<Plan seq={seq} />} />
        <Route exact path="/my" element={<My />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
