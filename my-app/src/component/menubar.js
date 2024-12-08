import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { SessionContext } from "../App";
import { getLogout } from "../api/Auth";

import "./menubar.css";
import logoimg from "../img/logo_oco.png";

function Menubar() {
  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginSession, setLoginSession } = useContext(SessionContext);

  const navigation = useNavigate();
  const location = useLocation();

  const [State, setState] = useState({
    session: "",
  });

  useEffect(() => {
    if (!loginSession) {
      setState({ session: loginSession === undefined ? "" : "로그인" });
    } else {
      if (location.pathname === "/my") {
        setState({ session: "로그아웃" });
      } else {
        setState({ session: "마이페이지" });
      }
    }
  }, [loginSession, location]);

  const LoginSessionHandler = async () => {
    if (State.session === "로그인") {
      navigation("/login");
    } else if (State.session === "마이페이지") {
      navigation("/my");
    } else if (State.session === "로그아웃") {
      setLoginSession(await getLogout());
    }
  };

  return (
    <div className="menubar-container">
      <header className="fixheader">
        <div className="menu-container">
          <Link to="/" className="img-box-link">
            <img src={logoimg} alt="logo이미지" className="item" />
          </Link>
          <div className="menu">
            <ul>
              <li className="item">
                <Link to="/mymate">나의 메이트</Link>
              </li>
              <li className="item">
                <Link to="/mytrip">나의 여행</Link>
              </li>
              <li className="item">
                <Link to="/howtouse">이용 방법</Link>
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
