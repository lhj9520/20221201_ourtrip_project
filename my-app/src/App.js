import React from "react";
import "./App.css";
import axios from "axios";

import Join from "./pages/Join";
import Login from "./pages/Login";
import Main from "./pages/Main";

import { Route, Routes } from "react-router-dom";

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
      // console.log(res.data);
      setLoginUser(res.data);
    });
  };

  세션삭제하기 = async () => {
    await axios({
      url: "http://localhost:5000/userdelete",
    }).then((res) => {
      setLoginUser(res.data);
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
        <Route exact path="/main" element={<Main />} />
        <Route exact path="/join" element={<Join />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
