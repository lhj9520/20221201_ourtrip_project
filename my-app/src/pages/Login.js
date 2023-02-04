import React from "react";
import axios from "axios";
import classnames from "classnames";
import "./Login.css";
import logoimg from "../img/logo_oco.png";

import { 세션정보가져오기 } from "../App";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigation = useNavigate();

  const [idstatus, setIdtatus] = React.useState(true);
  const [pwstatus, setPwtatus] = React.useState(true);
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [emsg, setEmsg] = React.useState("");
  const [autologin, Setautologin] = React.useState(false);

  const idchange = (event) => {
    const vid = event.target.value;
    setId(vid);
    //아이디 예외처리
    if (vid === "") {
      setIdtatus(false);
    } else {
      setIdtatus(true);
    }
  };

  const pwchange = (event) => {
    const vpw = event.target.value;
    setPw(vpw);
    //비밀번호 길이 예외처리
    if (vpw === "") {
      setEmsg("비밀번호를 입력해주세요.");
      setPwtatus(false);
    } else if (pw.length > 19 || pw.length < 7) {
      setEmsg("8~20자까지 입력가능합니다.");
      setPwtatus(false);
    } else {
      setEmsg("");
      setPwtatus(true);
    }
  };

  const userlogin = async () => {
    //코드 확인
    if (!idstatus || !pwstatus) {
      return;
    }
    //자동로그인 확인
    await axios({
      url: "http://localhost:5000/login",
      method: "POST",
      data: { id: id, pw: pw, autologin: autologin },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "error") {
          alert(message);
          return;
        }
        세션정보가져오기();
        navigation("/", { replace: true }); //{ replace: true }
      })
      .catch((e) => {
        console.log("로그인 오류!", e);
      });
  };

  //체크 확인(자동로그인)
  const handleClickRadioButton = (e) => {
    if (e.target.checked) {
      //체크
      // console.log("체크");
      Setautologin(true);
    } else {
      //안체크
      // console.log("안체크");
      Setautologin(false);
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
            name="id"
            placeholder="아이디"
            className="item"
            onChange={idchange}
          />
          <span className={classnames("msg", { close: idstatus })}>
            아이디를 입력해주세요.
          </span>
          <input
            type="password"
            name="pw"
            placeholder="비밀번호"
            className="item pwbox"
            onChange={pwchange}
          />
          <span className={classnames("msg", { close: pwstatus })}>{emsg}</span>
          {/* <span className="autologincheck">
            <input type="checkbox" onClick={handleClickRadioButton} />
            자동로그인
          </span> */}
          <button className="loginbtn" onClick={userlogin}>
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
        <div className="hr-sect">SNS 간편 로그인</div>
        <div className="easylogin">여기에 아이콘들</div>
      </div>
    </div>
  );
}

export default Login;
