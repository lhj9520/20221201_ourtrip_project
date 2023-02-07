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
import Create from "./pages/plan/Create";

axios.defaults.withCredentials = true;

export const StoreContext = React.createContext({});
export let 세션정보가져오기 = () => {};
export let 세션삭제하기 = () => {};

function App() {
  const navigation = useNavigate();

  const initialloginuser = JSON.parse(localStorage.getItem("login"));
  const [loginUser, setLoginUser] = React.useState(initialloginuser);

  세션정보가져오기 = async () => {
    await axios({
      url: "http://localhost:5000/user",
    }).then((res) => {
      // console.log("세션정보가져오기", res.data);
      if (res.data) {
        console.log("세션정보저장하기", res.data);
        localStorage.setItem("login", JSON.stringify(res.data));
        setLoginUser(res.data);
      }
    });
  };

  세션삭제하기 = async () => {
    await axios({
      url: "http://localhost:5000/userdelete",
    }).then((res) => {
      console.log("세션이 삭제됩니다");
      localStorage.removeItem("login");
      setLoginUser(null);
      navigation("/");
    });
  };

  // React.useEffect(() => {
  //   console.log("loginuser정보", loginUser);
  // }, []);

  return (
    <StoreContext.Provider
      value={{
        loginUser: loginUser,
      }}
    >
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/join" element={<Join />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/userfind" element={<UserFind />} />
        <Route exact path="/howtouse" element={<Howtouse />} />
        <Route exact path="/mymate" element={<Mymate />} />
        <Route exact path="/mytrip" element={<Mytrip />} />
        <Route exact path="/create" element={<Create />} />
        <Route exact path="/my" element={<My />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
