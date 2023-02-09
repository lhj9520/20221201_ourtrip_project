import React from "react";
import axios from "axios";
import classnames from "classnames";
import "./Login.css";
import logoimg from "../img/logo_oco.png";

import { importsession } from "../App";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigation = useNavigate();

  const [userlogin, setUserlogin] = React.useState({
    id: "",
    pw: "",
    msg1: "",
    msg2: "",
    autologin: false,
  });

  const idchange = (event) => {
    const data = event.target.value;
    if (data.length <= 12) {
      setUserlogin((prevState) => {
        return { ...prevState, id: data, msg1: "" };
      });
    }
  };

  const pwchange = (event) => {
    const data = event.target.value;
    if (data.length <= 20) {
      setUserlogin((prevState) => {
        return { ...prevState, pw: data, msg2: "" };
      });
    }
  };

  const userloginHandler = async () => {
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

    //자동로그인 확인
    await axios({
      url: "http://localhost:5000/login",
      method: "POST",
      data: {
        id: userlogin.id,
        pw: userlogin.pw,
        autologin: userlogin.autologin,
      },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "error") {
          alert(message);
          return;
        }
        importsession();
        navigation("/", { replace: true }); //{ replace: true }
      })
      .catch((e) => {
        console.log("로그인 오류!", e);
      });
  };

  //체크 확인(자동로그인)
  const handleClickRadioButton = (e) => {
    if (e.target.checked) {
      // console.log("체크");
      setUserlogin((prevState) => {
        return { ...prevState, autologin: true };
      });
    } else {
      // console.log("안체크");
      setUserlogin((prevState) => {
        return { ...prevState, autologin: false };
      });
    }
  };

  return (
    <div className="login-container">
      <div className="centerfix">
        <div className="logininfo">
          <img
            src={logoimg}
            alt="logo이미지"
            onClick={() => {
              navigation("/");
            }}
          />
          <span className="title">로그인</span>
          <input
            type="text"
            maxLength={12}
            value={userlogin.id}
            name="id"
            placeholder="아이디"
            className="item"
            onChange={idchange}
          />
          <span className="msg">{userlogin.msg1}</span>
          <input
            type="password"
            maxLength={20}
            value={userlogin.pw}
            name="pw"
            placeholder="비밀번호"
            className="item pwbox"
            onChange={pwchange}
          />
          <span className="msg">{userlogin.msg2}</span>
          {/* <span className="autologincheck">
            <input type="checkbox" onClick={handleClickRadioButton} />
            자동로그인
          </span> */}
          <button className="loginbtn" onClick={userloginHandler}>
            로그인
          </button>
        </div>
        <div className="more">
          <span
            onClick={() => {
              navigation("/join");
            }}
          >
            회원가입
          </span>
          <span
            onClick={() => {
              navigation("/userfind", { state: "id" });
            }}
          >
            아이디 찾기
          </span>
          <span
            onClick={() => {
              navigation("/userfind", { state: "pw" });
            }}
          >
            비밀번호 찾기
          </span>
        </div>
        {/* <div className="hr-sect">SNS 간편 로그인</div>
        <div className="easylogin">여기에 아이콘들</div> */}
      </div>
    </div>
  );
}

export default Login;
