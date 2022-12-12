import React from "react";
import "./Howtouse.css";
import logoimg from "../img/logo_oco.png";

import { StoreContext, 세션삭제하기 } from "../App";
import { useNavigate } from "react-router-dom";

function Howtouse() {
  const navigation = useNavigate();
  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);
  //   console.log(loginUser.id);
  const [State, setState] = React.useState({
    session: "로그인",
  });

  React.useEffect(() => {
    // console.log("loginUser 바뀜");
    if (loginUser.mem_userid !== undefined) {
      setState({ session: "마이페이지" });
    }
  }, [loginUser]);

  const login = () => {
    if (State.session === "로그인") {
      navigation("/login");
      setState({ session: "마이페이지" });
    } else if (State.session === "마이페이지") {
      navigation("/my");
    }
  };

  return (
    <div className="container">
      <header className="fixheader">
        <div className="menu-container">
          <img
            src={logoimg}
            alt="logo이미지"
            className="item"
            onClick={() => {
              navigation("/main");
            }}
          />
          <div className="menu">
            <ul>
              <li
                className="item"
                onClick={() => {
                  navigation("/community");
                }}
              >
                커뮤니티
              </li>
              <li
                className="item"
                onClick={() => {
                  if (loginUser.mem_userid === undefined) {
                    alert("로그인 후 이용가능합니다.");
                  } else {
                    navigation("/create");
                  }
                  // navigation("/Create");
                }}
              >
                일정 만들기
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
      <div className="contents-container">
        <div>이용방법페이지입니다.</div>
        {/* <img src={imgimg} alt="" /> */}
      </div>
    </div>
  );
}

export default Howtouse;
