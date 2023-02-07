import React from "react";
import "./menubar.css";
import logoimg from "../img/logo_oco.png";

import { StoreContext, 세션정보가져오기, 세션삭제하기 } from "../App";
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
    console.log("메뉴바 이팩트", loginUser);

    if (loginUser === null) {
      setState({ session: "로그인" });
    } else {
      setState({ session: "마이페이지" });
      if (location.pathname === "/my") {
        setState({ session: "로그아웃" });
      }
    }
  }, [loginUser]);

  const login = () => {
    if (State.session === "로그인") {
      navigation("/login");
    } else if (State.session === "마이페이지") {
      navigation("/my");
    } else if (State.session === "로그아웃") {
      세션삭제하기();
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
            onClick={() => {
              세션정보가져오기();
              navigation("/");
            }}
          />
          <div className="menu">
            <ul>
              {/* <li
                className="item"
                onClick={() => {
                  navigation("/community");
                }}
              >
                커뮤니티
              </li> */}
              <li
                className="item"
                onClick={() => {
                  if (loginUser === null) {
                    alert("로그인 후 이용가능합니다.");
                  } else {
                    navigation("/mymate");
                  }
                }}
              >
                나의 메이트
              </li>
              <li
                className="item"
                onClick={() => {
                  if (loginUser === null) {
                    alert("로그인 후 이용가능합니다.");
                  } else {
                    navigation("/mytrip");
                  }
                }}
              >
                나의 여행
              </li>
              <li
                className="item"
                onClick={() => {
                  navigation("/howtouse");
                }}
              >
                이용 방법
              </li>
            </ul>
            <div>
              <button className="loginbtn" onClick={login}>
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
