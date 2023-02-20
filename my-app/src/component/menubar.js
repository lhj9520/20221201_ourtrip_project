import React from "react";
import "./menubar.css";
import logoimg from "../img/logo_oco.png";

import { StoreContext, importsession, deletesession } from "../App";
import { useNavigate, useLocation } from "react-router-dom";

function Menubar() {
  const navigation = useNavigate();
  const location = useLocation();

  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);

  const [State, setState] = React.useState({
    session: "로그인",
  });

  React.useEffect(() => {
    if (loginUser.session === "none") {
      setState({ session: "로그인" });
    } else if (Object.keys(loginUser).length > 1) {
      if (location.pathname === "/my") {
        setState({ session: "로그아웃" });
      } else {
        setState({ session: "마이페이지" });
      }
    }
  }, [loginUser]);

  const LoginSessionHandler = () => {
    if (State.session === "로그인") {
      navigation("/login");
    } else if (State.session === "마이페이지") {
      navigation("/my");
    } else if (State.session === "로그아웃") {
      deletesession();
    }
  };

  const MoveToMainHandler = () => {
    navigation("/");
    importsession();
  };

  const MoveToMyMateHandler = () => {
    if (loginUser.session === "none") {
      alert("로그인 후 이용가능합니다.");
    } else {
      navigation("/mymate");
    }
  };

  const MoveToMyTripHandler = () => {
    if (loginUser.session === "none") {
      alert("로그인 후 이용가능합니다.");
    } else {
      navigation("/mytrip");
    }
  };

  return (
    <div className="menubar-container">
      <header className="fixheader">
        <div className="menu-container">
          <img
            src={logoimg}
            alt="logo이미지"
            className="item"
            onClick={MoveToMainHandler}
          />
          <div className="menu">
            <ul>
              <li className="item" onClick={MoveToMyMateHandler}>
                나의 메이트
              </li>
              <li className="item" onClick={MoveToMyTripHandler}>
                나의 여행
              </li>
              <li className="item" onClick={() => navigation("/howtouse")}>
                이용 방법
              </li>
            </ul>
            <div>
              <button className="loginbtn" onClick={LoginSessionHandler}>
                {State.session}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Menubar;
