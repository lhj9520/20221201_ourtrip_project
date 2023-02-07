import React, { startTransition } from "react";
import "./Main.css";
import Menubar from "../component/menubar";

import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigation = useNavigate();

  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);

  const [State, setState] = React.useState({
    session: "로그인",
  });

  React.useEffect(() => {
    // console.log("로그인 세션", loginUser);
    if (loginUser !== null) {
      setState({ session: "마이페이지" });
    }
  }, [loginUser]);

  return (
    <div className="container">
      <Menubar />
      <div className="contents-container">
        <div>메인페이지입니다.</div>
      </div>
    </div>
  );
}

export default Main;
