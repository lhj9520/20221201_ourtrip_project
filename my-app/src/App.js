import React from "react";
import axios from "axios";
import "./App.css";

import { Route, Routes } from "react-router-dom";

import Join from "./pages/Join";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Community from "./pages/community/Community";
import Howtouse from "./pages/Howtouse";
import Mymate from "./pages/my/Mymate";
import Mytrip from "./pages/my/Mytrip";
import Create from "./pages/plan/Create";
import My from "./pages/my/My";

axios.defaults.withCredentials = true;

export const StoreContext = React.createContext({});
export let 세션정보가져오기 = () => {};
export let 세션삭제하기 = () => {};

function App() {
  const [loginUser, setLoginUser] = React.useState({});

  세션정보가져오기 = async () => {
    await axios({
      url: "http://localhost:5000/user",
    }).then((res) => {
      console.log("세션정보가져오기", res.data);
      setLoginUser(res.data);
    });
  };

  세션삭제하기 = async () => {
    await axios({
      url: "http://localhost:5000/userdelete",
    }).then((res) => {
      setLoginUser(res.data);
      console.log("세션이 삭제됩니다");
    });
  };

  React.useEffect(() => {
    세션정보가져오기();
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
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/howtouse" element={<Howtouse />} />
        <Route exact path="/community" element={<Community />} />
        <Route exact path="/mymate" element={<Mymate />} />
        <Route exact path="/mytrip" element={<Mytrip />} />
        <Route exact path="/create" element={<Create />} />
        <Route exact path="/my" element={<My />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
