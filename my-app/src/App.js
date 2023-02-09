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

axios.defaults.withCredentials = true;

export const StoreContext = React.createContext({});
export const StoreContextM = React.createContext({});
export let importsession = () => {};
export let deletesession = () => {};
export let importmate = () => {};

function App() {
  const navigation = useNavigate();

  const initialloginuser = JSON.parse(localStorage.getItem("login"));
  const [loginUser, setLoginUser] = React.useState(initialloginuser);
  const [loginUsermate, setLoginUsermate] = React.useState(null);

  const seq = "";

  importsession = async () => {
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

  deletesession = async () => {
    await axios({
      url: "http://localhost:5000/userdelete",
    }).then((res) => {
      console.log("세션이 삭제됩니다");
      localStorage.removeItem("login");
      setLoginUser(null);
      navigation("/");
    });
  };

  importmate = async () => {
    await axios({
      url: "http://localhost:5000/matelist",
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          console.log("친구목록불러오기", data);
          setLoginUsermate(data);
        }
      })
      .catch((e) => {
        console.log("메이트 목록 업데이트 오류!", e);
      });
  };

  React.useEffect(() => {
    if (loginUser) {
      //친구 목록 저장
      importmate();
    }
  }, [loginUser]);

  return (
    <StoreContext.Provider
      value={{
        loginUser: loginUser,
      }}
    >
      <StoreContextM.Provider
        value={{
          Mate: loginUsermate,
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
          <Route exact path="/mytrip/plan/:seq" element={<Plan seq={seq} />} />
          <Route exact path="/my" element={<My />} />
        </Routes>
      </StoreContextM.Provider>
    </StoreContext.Provider>
  );
}

export default App;
