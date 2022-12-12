import React from "react";
import "./My.css";
import logoimg from "../../img/logo_oco.png";

import { StoreContext, 세션정보가져오기, 세션삭제하기 } from "../../App";
import { useNavigate } from "react-router-dom";

function My() {
  const navigation = useNavigate();
  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);
  //   console.log(loginUser.id);
  const [State, setState] = React.useState({
    session: "로그인",
  });

  React.useEffect(() => {
    if (loginUser.mem_userid !== undefined) {
      setState({ session: "로그아웃" });
    }
  }, [loginUser]);

  const login = () => {
    if (State.session === "로그아웃") {
      //세션 해제
      세션삭제하기();
      navigation("/main", { replace: true });
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
        <div>내정보페이지입니다.</div>
      </div>
    </div>
  );
}

export default My;
