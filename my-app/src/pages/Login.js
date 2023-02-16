import React from "react";
import axios from "axios";
import "./Login.css";
import logoimg from "../img/logo_oco.png";

import { useNavigate } from "react-router-dom";
import { importsession } from "../App";

function Login() {
  const navigation = useNavigate();

  const [userlogin, setUserlogin] = React.useState({
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

  const UserLoginHandler = async () => {
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

    await axios({
      url: "http://localhost:5000/auth/login",
      method: "POST",
      data: {
        id: userlogin.id,
        pw: userlogin.pw,
      },
    })
      .then((res) => {
        const { code, message, redirect } = res.data;
        if (code === "error") {
          alert(message);
          return;
        } else {
          importsession();
          navigation(redirect);
        }
      })
      .catch((e) => {
        console.log("로그인 오류!", e);
      });
  };

  return (
    <div className="login-container">
      <div className="loginbox">
        <div className="first">
          <img src={logoimg} alt="logo이미지" onClick={() => navigation("/")} />
          <span className="title">로그인</span>
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
          <button className="loginbtn" onClick={UserLoginHandler}>
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
      </div>
    </div>
  );
}

export default Login;
