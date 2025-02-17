import React, { useState, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import classnames from "classnames";
// import css
import "./Join.css";
// import src
import logoimg from "../img/logo_oco.png";
// import hook
import useDidMountEffect from "../utils/useDidMountEffect.js";
// import context
import { SessionContext } from "../App";
// import api
import {
  getDuplicateID,
  getDuplicateEmail,
  getEmailcode,
  getDuplicateNickname,
  getJoin,
} from "../api/Auth";

function Join() {
  const { loginSession } = useContext(SessionContext);

  const navigation = useNavigate();

  const [id, setId] = useState({
    value: "",
    dupisvalid: false,
    msg: "",
  });

  const [pw, setPw] = useState({
    value: "",
    revalue: "",
    isvalid: false,
    sameisvalid: false,
    msg1: "",
    msg2: "",
  });

  const [name, setName] = useState({
    value: "",
    isvalid: false,
    msg: "",
  });

  const [email, setEmail] = useState({
    value: "",
    dupisvalid: false,
    msg: "",
    inputcode: "",
    servercode: "",
    isvalid: false,
  });

  const [nickname, setNickname] = useState({
    value: "",
    dupisvalid: false,
    msg: "",
  });

  const [phone, setPhone] = useState({
    value: "",
    isvalid: true,
    msg: "",
  });

  const [disable, setDisable] = useState(true);
  const inputRef = useRef([]);

  // 비밀번호
  useDidMountEffect(() => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

    if ((!pw.value && !pw.revalue) || (!pw.value && pw.revalue)) {
      setPw((prevState) => {
        return {
          ...prevState,
          isvalid: false,
          msg1: "",
          sameisvalid: false,
          msg2: "",
        };
      });
    } else if (pw.value && !pw.revalue) {
      if (!passwordRegex.test(pw.value)) {
        setPw((prevState) => {
          return {
            ...prevState,
            isvalid: false,
            msg1: "숫자+영문자+특수문자 조합으로 8~20자리 입력해주세요.",
          };
        });
      } else {
        setPw((prevState) => {
          return {
            ...prevState,
            isvalid: true,
            msg1: "",
          };
        });
      }
    } else {
      if (pw.value === pw.revalue) {
        setPw((prevState) => {
          return {
            ...prevState,
            sameisvalid: true,
            msg2: "비밀번호가 일치합니다.",
          };
        });
      } else {
        setPw((prevState) => {
          return {
            ...prevState,
            sameisvalid: false,
            msg2: "비밀번호가 일치하지않습니다.",
          };
        });
      }
    }
  }, [pw.value, pw.revalue]);

  // 이름
  useDidMountEffect(() => {
    const nameRegex = /^[가-힣]+$/;
    if (!name.value) {
      setName((prevState) => {
        return { ...prevState, isvalid: false, msg: "" };
      });
    } else {
      if (!nameRegex.test(name.value) || name.value.length < 2) {
        setName((prevState) => {
          return {
            ...prevState,
            isvalid: false,
            msg: "2글자 이상 5글자 이하 한글만 입력해주세요.",
          };
        });
      } else {
        setName((prevState) => {
          return { ...prevState, isvalid: true, msg: "" };
        });
      }
    }
  }, [name.value]);

  // 휴대폰 번호
  useDidMountEffect(() => {
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if (!phone.value) {
      setPhone((prevState) => {
        return { ...prevState, isvalid: true, msg: "" };
      });
    } else {
      if (!phoneRegex.test(phone.value)) {
        setPhone((prevState) => {
          return {
            ...prevState,
            isvalid: false,
            msg: "잘못된 번호입니다. 다시 확인해주세요.",
          };
        });
      } else {
        setPhone((prevState) => {
          return { ...prevState, isvalid: true, msg: "" };
        });
      }
    }
  }, [phone.value]);

  const idvaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 12) {
      setId((prevState) => {
        return { ...prevState, value: data, dupisvalid: false, msg: "" };
      });
    }
  };

  const pwvaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 20) {
      setPw((prevState) => {
        return { ...prevState, value: data };
      });
    }
  };

  const repwvaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 20) {
      setPw((prevState) => {
        return { ...prevState, revalue: data };
      });
    }
  };

  const namevaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 5) {
      setName((prevState) => {
        return { ...prevState, value: data };
      });
    }
  };

  const emailvaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 320) {
      setEmail((prevState) => {
        return {
          ...prevState,
          value: data,
          dupisvalid: false,
          msg: "",
          inputcode: "",
          servercode: "",
          isvalid: false,
        };
      });
    }
  };

  const valuechange = (event) => {
    const codeRegex = /^[0-9]{0,6}$/;

    const data = event.target.value;
    if (data.length <= 6 && codeRegex.test(data)) {
      setEmail((prevState) => {
        return { ...prevState, inputcode: data };
      });
    }
  };

  const nicknamevaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 12) {
      setNickname((prevState) => {
        return { ...prevState, value: data, dupisvalid: false, msg: "" };
      });
    }
  };

  const phonevaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 13) {
      setPhone((prevState) => {
        return { ...prevState, value: data, msg: "" };
      });
    }
  };

  /**
   * 아이디 중복검사
   */
  const duplicateIdCheck = async () => {
    const idRegex = /^[A-Za-z0-9]{4,12}$/;

    //아이디 예외처리
    if (id.value === "") {
      setId((prevState) => {
        return { ...prevState, msg: "아이디를 입력해주세요." };
      });
      return;
    }

    if (!idRegex.test(id.value)) {
      setId((prevState) => {
        return {
          ...prevState,
          msg: "영어+숫자 조합 4~12 글자로 입력해주세요.",
        };
      });
      return;
    }

    if (id.dupisvalid) {
      return;
    }

    const { code, message } = await getDuplicateID(id.value);

    if (code === "success") {
      setId((prevState) => {
        return { ...prevState, dupisvalid: true, msg: message };
      });
    } else {
      setId((prevState) => {
        return { ...prevState, dupisvalid: false, msg: message };
      });
    }
  };

  /**
   * 이메일 중복검사
   */
  const duplicateEmailCheck = async () => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (email.value === "") {
      setEmail((prevState) => {
        return { ...prevState, msg: "이메일을 입력해주세요." };
      });
      return;
    }

    if (!emailRegex.test(email.value)) {
      setEmail((prevState) => {
        return {
          ...prevState,
          msg: "이메일 형식이 아닙니다.",
        };
      });
      return;
    }

    const { code, message } = await getDuplicateEmail(email.value);

    if (code === "success") {
      setEmail((prevState) => {
        return {
          ...prevState,
          dupisvalid: true,
          isvalid: false,
          inputcode: "",
          servercode: "",
          msg: "",
        };
      });
      emailcodeHandler();
    } else {
      setEmail((prevState) => {
        return { ...prevState, dupisvalid: false, msg: message };
      });
    }
  };

  /**
   * 이메일 인증코드 전송
   */
  const emailcodeHandler = async () => {
    alert(
      "인증번호를 발송했습니다.\n인증번호가 오지 않으면 입력하신 정보가 회원정보와 일치하는지 확인해 주세요."
    );
    setDisable(false);

    const { code, vericode } = await getEmailcode({
      yourname: "join",
      youremail: email.value,
    });

    if (code === 200) {
      setEmail((prevState) => {
        return { ...prevState, servercode: vericode };
      });
    }
  };

  /**
   * 이메일 인증코드 검사
   */
  const VerifycodeHandler = async () => {
    if (disable) {
      if (email.inputcode === "") {
        setEmail((prevState) => {
          return { ...prevState, msg: "인증번호전송을 눌러주세요." };
        });
        return;
      }
    } else {
      if (!disable && email.inputcode === "") {
        setEmail((prevState) => {
          return { ...prevState, msg: "인증번호를 입력하세요." };
        });
        return;
      }

      if (email.inputcode != email.servercode) {
        setEmail((prevState) => {
          return { ...prevState, msg: "인증번호가 틀렸습니다." };
        });
        return;
      } else {
        setEmail((prevState) => {
          return { ...prevState, isvalid: true, msg: "인증되었습니다." };
        });
        setDisable(true);
      }
    }
  };

  /**
   * 닉네임 중복검사
   */
  const duplicatenickCheck = async () => {
    if (nickname.value === "") {
      setNickname((prevState) => {
        return { ...prevState, msg: "닉네임을 입력해주세요." };
      });
      return;
    }

    if (nickname.dupisvalid) {
      return;
    }

    const { code, message } = await getDuplicateNickname(nickname.value);

    if (code === "success") {
      setNickname((prevState) => {
        return { ...prevState, dupisvalid: true, msg: message };
      });
    } else {
      setNickname((prevState) => {
        return { ...prevState, dupisvalid: false, msg: message };
      });
    }
  };

  /**
   * 회원가입 값 유효성 검사
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    //아이디
    if (!id.dupisvalid) {
      inputRef.current[0].focus();
      return;
    }
    //비밀번호
    if (!pw.isvalid) {
      inputRef.current[1].focus();
      return;
    }
    //비밀번호 확인
    if (!pw.sameisvalid) {
      inputRef.current[2].focus();
      return;
    }
    //이름 확인
    if (!name.isvalid) {
      inputRef.current[3].focus();
      return;
    }

    //이메일 인증확인
    if (!email.dupisvalid || !email.isvalid) {
      inputRef.current[5].focus();
      return;
    }

    //닉네임 확인
    if (!nickname.dupisvalid) {
      inputRef.current[6].focus();
      return;
    }
    //번호 확인
    if (!phone.isvalid) {
      inputRef.current[7].focus();
      return;
    }

    const { code, message } = await getJoin({
      id: id.value,
      pw: pw.value,
      name: name.value,
      email: email.value,
      nickname: nickname.value,
      phone: phone.value,
    });

    if (code === "error") {
      alert(message);
      return;
    }

    alert("회원가입이 완료 되었습니다!");

    // 회원가입 후 로그인 페이지로 이동
    navigation("/login");
  };

  return (
    <>
      {loginSession === false && (
        <div className="join-container">
          <div className="centerfix">
            <div className="first">
              <Link to="/">
                <img src={logoimg} alt="logo이미지" />
              </Link>
            </div>
            <form onSubmit={onSubmit} className="userinfo">
              <div className="idcontainer">
                <section className="title">
                  <span>아이디</span>
                  <span className="essential">*</span>
                </section>
                <input
                  ref={(el) => (inputRef.current[0] = el)}
                  type="text"
                  name="id"
                  maxLength={12}
                  value={id.value}
                  placeholder="아이디"
                  className="item overlap"
                  onChange={idvaluechange}
                />
                <button
                  type="button"
                  className={classnames("overlapbtn", { over: id.dupisvalid })}
                  onClick={duplicateIdCheck}
                >
                  중복확인
                </button>
                <section className="msgtitle">
                  <span className="msg">{id.msg}</span>
                </section>
              </div>
              <div className="pwcontainer">
                <section className="title">
                  <span>비밀번호</span>
                  <span className="essential">*</span>
                </section>
                <input
                  ref={(el) => (inputRef.current[1] = el)}
                  type="password"
                  name="pw"
                  maxLength={20}
                  value={pw.value}
                  placeholder="비밀번호"
                  className="item"
                  onChange={pwvaluechange}
                />
                <span>
                  8~20자까지 영문,숫자,특수문자(_!@#$%^&*)모두 조합하여 입력
                </span>
                <section className="msgtitle">
                  <span className="msg">{pw.msg1}</span>
                </section>
              </div>
              <div className="repwcontainer">
                <section className="title">
                  <span>비밀번호 재입력</span>
                  <span className="essential">*</span>
                </section>
                <input
                  ref={(el) => (inputRef.current[2] = el)}
                  type="password"
                  name="repw"
                  maxLength={20}
                  value={pw.revalue}
                  placeholder="비밀번호 재입력"
                  className="item"
                  onChange={repwvaluechange}
                />
                <section className="msgtitle">
                  <span className="msg">{pw.msg2}</span>
                </section>
              </div>
              <div className="namecontainer">
                <section className="title">
                  <span>이름</span>
                  <span className="essential">*</span>
                </section>
                <input
                  ref={(el) => (inputRef.current[3] = el)}
                  type="text"
                  name="name"
                  maxLength={5}
                  value={name.value}
                  placeholder="이름"
                  className="item"
                  onChange={namevaluechange}
                />
                <section className="msgtitle">
                  <span className="msg">{name.msg}</span>
                </section>
              </div>
              <div className="emailcontainer">
                <section className="title">
                  <span>이메일</span>
                  <span className="essential">*</span>
                </section>
                <input
                  ref={(el) => (inputRef.current[5] = el)}
                  type="text"
                  name="email"
                  maxLength={320}
                  value={email.value}
                  placeholder="geenee@gmail.com"
                  className="item overlap"
                  onChange={emailvaluechange}
                />
                <button
                  type="button"
                  className="overlapbtn"
                  onClick={duplicateEmailCheck}
                >
                  인증번호전송
                </button>
                <div className="emailcode">
                  <span>인증 번호</span>
                  <input
                    type="text"
                    value={email.inputcode}
                    onChange={valuechange}
                    placeholder="인증번호 6자리 숫자 입력"
                    disabled={disable}
                  />
                  <button
                    type="button"
                    className="overlapbtn"
                    onClick={VerifycodeHandler}
                  >
                    확인
                  </button>
                </div>
                <section className="msgtitle">
                  <span className="msg">{email.msg}</span>
                </section>
              </div>
              <div className="nicknamecontainer">
                <section className="title">
                  <span>닉네임</span>
                  <span className="essential">*</span>
                </section>
                <input
                  ref={(el) => (inputRef.current[6] = el)}
                  type="text"
                  name="nickname"
                  maxLength={12}
                  value={nickname.value}
                  placeholder="닉네임"
                  className="item overlap"
                  onChange={nicknamevaluechange}
                />
                <button
                  type="button"
                  className={classnames("overlapbtn", {
                    over: nickname.dupisvalid,
                  })}
                  onClick={duplicatenickCheck}
                >
                  중복확인
                </button>
                <section className="msgtitle">
                  <span className="msg">{nickname.msg}</span>
                </section>
              </div>
              <div className="phonecontainer">
                <section className="title">
                  <span>휴대폰 번호</span>
                </section>
                <input
                  ref={(el) => (inputRef.current[7] = el)}
                  type="text"
                  name="phone"
                  maxLength={13}
                  value={phone.value}
                  placeholder="010-1234-1234"
                  className="item"
                  onChange={phonevaluechange}
                />
                <section className="msgtitle">
                  <span className="msg">{phone.msg}</span>
                </section>
              </div>
              <button className="joinbtn" type="submit">
                회원가입
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Join;
