import React, { startTransition } from "react";
import "./Main.css";
import Menubar from "../component/menubar";

import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigation = useNavigate();

  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);

  return (
    <>
      <Menubar />
      <div className="contents-container">
        <div>메인페이지입니다.</div>
      </div>
    </>
  );
}

export default Main;
