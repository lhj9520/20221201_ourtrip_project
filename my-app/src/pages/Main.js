import React from "react";
import "./Main.css";
import logoimg from "../img/yeohaengGo(logo)_crop.png";

import { StoreContext, 세션삭제하기 } from "../App";
import { useNavigate } from "react-router-dom";

function Main() {
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
      setState({ session: "로그아웃" });
    }
  }, [loginUser]);

  const loginNout = () => {
    if (State.session === "로그인") {
      navigation("/login");
      setState({ session: "로그아웃" });
    } else if (State.session === "로그아웃") {
      //세션 해제
      세션삭제하기();
      setState({ session: "로그인" });
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
              <li className="item">커뮤니티</li>
              <li className="item">일정 만들기</li>
              <li className="item">이용 방법</li>
            </ul>
            <div>
              <button className="loginbtn" onClick={loginNout}>
                {State.session}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="contents-container">
        <div>메인페이지입니다.</div>
        {/* <img src={imgimg} alt="" /> */}
      </div>
    </div>
  );
}

export default Main;
