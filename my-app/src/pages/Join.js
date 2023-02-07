import React, { useRef } from "react";
import axios from "axios";
import $ from "jquery";
import classnames from "classnames";
import "./Join.css";
import logoimg from "../img/logo_oco.png";
import useDidMountEffect from "./useDidMountEffect.js";

import { useNavigate } from "react-router-dom";

function Join() {
  const navigation = useNavigate();

  const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const dayArr = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  const [id, setId] = React.useState({
    value: "",
    dupisvalid: false,
    msg: "",
  });

  const [pw, setPw] = React.useState({
    value: "",
    revalue: "",
    isvalid: false,
    sameisvalid: false,
    msg1: "",
    msg2: "",
  });

  const [name, setName] = React.useState({
    value: "",
    isvalid: false,
    msg: "",
  });

  const [birth, setBirth] = React.useState({
    year: "",
    month: 0,
    day: 0,
    isvalid: false,
    msg: "",
  });

  const [email, setEmail] = React.useState({
    value: "",
    dupisvalid: false,
    msg: "",
    inputcode: "",
    servercode: "",
    isvalid: false,
  });

  const [gender, setGender] = React.useState({
    value: "",
    msg: "",
  });

  const [nickname, setNickname] = React.useState({
    value: "",
    dupisvalid: false,
    msg: "",
  });

  const [phone, setPhone] = React.useState({
    value: "",
    isvalid: true,
    msg: "",
  });

  const [disable, setDisable] = React.useState(true);

  const inputRef = useRef([]);

  const idvaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 12) {
      setId((prevState) => {
        return { ...prevState, value: data, dupisvalid: false, msg: "" };
      });
    }
  };

  useDidMountEffect(() => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

    if ((!pw.value && !pw.revalue) || (!pw.value && pw.revalue)) {
      // console.log("둘 다 비었음");
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
      // console.log("확인 비었음");
      if (!passwordRegex.test(pw.value)) {
        // setEmsg2("숫자+영문자+특수문자 조합으로 8~20자리 입력해주세요.");
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
      // console.log("둘다 입력된 상태");
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

  useDidMountEffect(() => {
    const nameRegex = /^[가-힣]+$/;
    if (!name.value) {
      // console.log("이름 비었음");
      setName((prevState) => {
        return { ...prevState, isvalid: false, msg: "" };
      });
    } else {
      // console.log("이름 입력중");
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

  const namevaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 5) {
      setName((prevState) => {
        return { ...prevState, value: data };
      });
    }
  };

  const yearvaluechange = (event) => {
    const codeRegex = /^[0-9]{0,4}$/;

    const data = event.target.value;
    if (data.length <= 4 && codeRegex.test(data)) {
      setBirth((prevState) => {
        return { ...prevState, year: data };
      });
    }
  };

  useDidMountEffect(() => {
    // console.log(cloneData);

    if (birth.year && birth.month && birth.day) {
      setBirth((prevState) => {
        return { ...prevState, isvalid: true, msg: "" };
      });
    } else {
      setBirth((prevState) => {
        return { ...prevState, isvalid: false, msg: "필수입니다." };
      });
    }
  }, [birth.year, birth.month, birth.day]);

  const birthvaluechange = (event) => {
    const target = $(event.target);
    const name = target.closest("select").attr("id");
    const vbrith = event.target.value;

    const cloneData = { ...birth };
    cloneData[name] = vbrith;
    setBirth(cloneData);
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

  const gendervaluechange = (event) => {
    const data = event.target.value;
    if (data === "") {
      setGender((prevState) => {
        return { ...prevState, isvalid: false, msg: "필수입니다." };
      });
    } else {
      setGender((prevState) => {
        return { ...prevState, value: data, msg: "" };
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
      console.log("아이디 중복확인 완료");
      return;
    }

    await axios({
      url: "http://localhost:5000/idcheck",
      method: "POST",
      data: { id: id.value },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          setId((prevState) => {
            return { ...prevState, dupisvalid: true, msg: message };
          });
        } else {
          setId((prevState) => {
            return { ...prevState, dupisvalid: false, msg: message };
          });
        }
      })
      .catch((e) => {
        console.log("아이디 중복체크 오류!", e);
      });
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

    await axios({
      url: "http://localhost:5000/emailcheck",
      method: "POST",
      data: { email: email.value },
    })
      .then((res) => {
        const { code, message } = res.data;
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
      })
      .catch((e) => {
        console.log("이메일 중복체크 오류!", e);
      });
  };

  /**
   * 이메일 인증코드 전송
   */
  const emailcodeHandler = async () => {
    alert(
      "인증번호를 발송했습니다.\n인증번호가 오지 않으면 입력하신 정보가 회원정보와 일치하는지 확인해 주세요."
    );
    setDisable(false);

    await axios({
      url: "http://localhost:5000/mail",
      method: "POST",
      data: {
        yourname: "join",
        youremail: email.value,
      },
    })
      .then((res) => {
        const { code, vericode } = res.data;
        if (code === 200) {
          setEmail((prevState) => {
            return { ...prevState, servercode: vericode };
          });
        }
      })
      .catch((e) => {
        console.log("이메일 인증 코드 발송 오류!", e);
      });
  };
  /**
   * 이메일 인증코드 검사
   */
  const VerifycodeHandler = async () => {
    if (disable) {
      // console.log("비활성화");
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

      // setEmail((prevState) => {
      //   return { ...prevState, isvalid: true, msg: "인증되었습니다." };
      // });
      // setDisable(true);
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
      console.log("닉네임 중복 확인 완료");
      return;
    }

    await axios({
      url: "http://localhost:5000/nicknamecheck",
      method: "POST",
      data: { nickname: nickname.value },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          setNickname((prevState) => {
            return { ...prevState, dupisvalid: true, msg: message };
          });
        } else {
          setNickname((prevState) => {
            return { ...prevState, dupisvalid: false, msg: message };
          });
        }
      })
      .catch((e) => {
        console.log("닉네임 중복체크 오류!", e);
      });
  };
  /**
   * 회원가입 값 유효성 검사
   */
  const joinHandler = async () => {
    // console.log(id, pw, name, birth, email, gender, nickname, phone);
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
    //생년월일 확인
    if (!birth.isvalid) {
      inputRef.current[4].focus();
      return;
    }
    //이메일 인증확인
    if (!email.dupisvalid || !email.isvalid) {
      inputRef.current[5].focus();
      return;
    }
    //성별 확인
    if (!gender.value) {
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

    await axios({
      url: "http://localhost:5000/join",
      method: "POST",
      data: {
        id: id.value,
        pw: pw.value,
        name: name.value,
        birth: birth,
        email: email.value,
        gender: gender.value,
        nickname: nickname.value,
        phone: phone.value,
      },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "error") {
          alert(message);
          return;
        }
        navigation("/login");
      })
      .catch((e) => {
        console.log("회원가입 오류!", e);
      });
  };

  return (
    <div className="join-container">
      <div className="centerfix">
        <img
          src={logoimg}
          alt="logo이미지"
          onClick={() => {
            navigation("/");
          }}
        />
        <span className="title">회원가입</span>
        <div className="userinfo">
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
          <div className="birthcontainer">
            <section className="title">
              <span>생년월일</span>
              <span className="essential">*</span>
            </section>
            <input
              ref={(el) => (inputRef.current[4] = el)}
              type="text"
              maxLength={4}
              value={birth.year}
              placeholder="년(4자)"
              className="item small"
              onChange={yearvaluechange}
            />
            <select
              className="b-box second"
              id="month"
              required
              onChange={birthvaluechange}
            >
              <option value="">월</option>
              {monthArr.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="b-box"
              id="day"
              required
              onChange={birthvaluechange}
            >
              <option value="">일</option>
              {dayArr.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <div className="line">
              <section className="msgtitle">
                <span className="msg">{birth.msg}</span>
              </section>
            </div>
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
              className="overlapbtn"
              // className={classnames("overlapbtn", { over: email.dupisvalid })}
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
              <button className="overlapbtn" onClick={VerifycodeHandler}>
                확인
              </button>
            </div>
            <section className="msgtitle">
              <span className="msg">{email.msg}</span>
            </section>
          </div>
          <div className="gendercontainer">
            <section className="title">
              <span>성별</span>
              <span className="essential">*</span>
            </section>
            <select
              className="g-box full"
              id="gender-list"
              required
              onChange={gendervaluechange}
            >
              <option value="">성별</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
            <section className="msgtitle">
              <span className="msg">{gender.msg}</span>
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
          <button className="joinbtn" onClick={joinHandler}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default Join;
