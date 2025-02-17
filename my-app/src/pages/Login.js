import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import src
import logoimg from "../img/logo_oco.png";
// import css
import "./Login.css";
// import context
import { SessionContext } from "../App";
// import api
import { getLogin } from "../api/Auth";

function Login() {
  const { loginSession, fetchLoginSession } = useContext(SessionContext);

  const navigation = useNavigate();
  const restapikey = process.env.REACT_APP_KAKAO_RESTAPI_KEY;
  const redirect_uri = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  const kakaosnsloginlink = `https://kauth.kakao.com/oauth/authorize?client_id=${restapikey}&redirect_uri=${redirect_uri}&response_type=code`;

  const kakaologinHandler = () => {
    window.location.href = kakaosnsloginlink;
  };

  const [userlogin, setUserlogin] = useState({
    id: "",
    pw: "",
    msg1: "",
    msg2: "",
  });

  const IdvaluechangeHandler = (event) => {
    const data = event.target.value;
    if (data.length <= 12) {
      setUserlogin((prevState) => {
        return { ...prevState, id: data, msg1: "" };
      });
    }
  };

  const PwvaluechangeHandler = (event) => {
    const data = event.target.value;
    if (data.length <= 20) {
      setUserlogin((prevState) => {
        return { ...prevState, pw: data, msg2: "" };
      });
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!userlogin.id) {
      setUserlogin((prevState) => {
        return { ...prevState, msg1: "아이디를 입력하세요.", msg2: "" };
      });
      return;
    }

    if (!userlogin.pw) {
      setUserlogin((prevState) => {
        return { ...prevState, msg2: "비밀번호를 입력하세요.", msg1: "" };
      });
      return;
    }

    const { code, message, redirect } = await getLogin(
      userlogin.id,
      userlogin.pw
    );

    if (code === "error") {
      alert(message);
      return;
    }

    // 로그인 세션 값 받아오기
    await fetchLoginSession();
    // 메인 페이지로 이동
    navigation(redirect);
  };

  return (
    <>
      {loginSession === false && (
        <div className="login-container">
          <form onSubmit={onSubmit} className="loginbox">
            <div className="first">
              <Link to="/">
                <img src={logoimg} alt="logo이미지" />
              </Link>
            </div>
            <div className="inputbox">
              <input
                type="text"
                maxLength={12}
                value={userlogin.id}
                name="id"
                placeholder="아이디"
                className="item"
                onChange={IdvaluechangeHandler}
              />
              <span className="msg">{userlogin.msg1}</span>
              <input
                type="password"
                maxLength={20}
                value={userlogin.pw}
                name="pw"
                placeholder="비밀번호"
                className="item"
                onChange={PwvaluechangeHandler}
              />
              <span className="msg">{userlogin.msg2}</span>
              <button className="loginbtn" type="submit">
                로그인
              </button>
            </div>
            <div className="more">
              <span onClick={() => navigation("/join")}>회원가입</span>
              <span onClick={() => navigation("/userfind", { state: "id" })}>
                아이디 찾기
              </span>
              <span onClick={() => navigation("/userfind", { state: "pw" })}>
                비밀번호 찾기
              </span>
            </div>
            <div className="hr-sect">SNS 간편 로그인</div>
            <div className="snslogin">
              <button type="button" onClick={kakaologinHandler}>
                카카오로 로그인하기
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Login;
