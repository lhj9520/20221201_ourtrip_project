import React, { useRef } from "react";
import axios from "axios";
import $ from "jquery";
import classnames from "classnames";
import "./Join.css";
import logoimg from "../img/logo_oco.png";

import { useNavigate } from "react-router-dom";

function Join() {
  const navigation = useNavigate();

  const [emsg1, setEmsg1] = React.useState("");
  const [emsg2, setEmsg2] = React.useState("");
  const [emsg3, setEmsg3] = React.useState("");
  const [emsg4, setEmsg4] = React.useState("");
  const [emsg5_1, setEmsg5_1] = React.useState("");
  const [emsg5_2, setEmsg5_2] = React.useState("");
  const [emsg5_3, setEmsg5_3] = React.useState("");
  const [emsg6, setEmsg6] = React.useState("");
  const [emsg7, setEmsg7] = React.useState("");
  const [emsg8, setEmsg8] = React.useState("");
  const [emsg9, setEmsg9] = React.useState("");

  const [id, setId] = React.useState("");
  const [idisvalid, setIdisvalid] = React.useState(false);
  const [dupidisvalid, setDupidisvalid] = React.useState(false);

  const [pw, setPw] = React.useState("");
  const [rpw, setRpw] = React.useState("");
  const [pwisvalid, setPwisvalid] = React.useState(false);
  const [samepwisvalid, setSamepwisvalid] = React.useState(false);

  const [name, setName] = React.useState("");
  const [nameisvalid, setNameisvalid] = React.useState(false);

  const [birth, setBirth] = React.useState({
    year: "",
    month: "",
    day: "",
  });

  const [email, setEmail] = React.useState("");
  const [emailisvalid, setEmailisvalid] = React.useState(false);
  const [dupemailisvalid, setDupemailisvalid] = React.useState(false);

  const [gender, setGender] = React.useState("");
  const [genderidvalid, setGenderisvalid] = React.useState(false);

  const [nickname, setNickname] = React.useState("");
  const [nicknameisvalid, setNicknameisvalid] = React.useState(false);
  const [dupnicknameisvalid, setDupnicknameisvalid] = React.useState(false);

  const [phone, setPhone] = React.useState("");
  const [phoneisvalid, setPhoneisvalid] = React.useState(true);

  const date = new Date();
  const currentyear = date.getFullYear();
  let yearArr = [];
  for (let i = currentyear; i > currentyear - 100; i--) {
    yearArr.push(i);
  }
  const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const dayArr = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  const inputRef = useRef([]);

  const idvaluechange = (event) => {
    const idRegex = /^[A-Za-z0-9]{4,12}$/;
    const vid = event.target.value;
    setId(vid);
    setDupidisvalid(false);
    //아이디 예외처리
    if (vid === "") {
      setEmsg1("필수입니다.");
      setIdisvalid(false);
    } else {
      if (!idRegex.test(vid)) {
        setEmsg1("영어+숫자 4~12 글자로 입력해주세요.");
        setIdisvalid(false);
      } else {
        setEmsg1("");
        setIdisvalid(true);
      }
    }
  };

  const pwvaluechange = (event) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    const vpw = event.target.value;
    setPw(vpw);
    //비밀번호 예외처리
    if (vpw === "") {
      setEmsg2("필수입니다.");
      setPwisvalid(false);
    } else {
      // setEmsg2("");
      if (!passwordRegex.test(vpw)) {
        setEmsg2("숫자+영문자+특수문자 조합으로 8~20자리 입력해주세요.");
        setPwisvalid(false);
      } else {
        setEmsg2("");
        setPwisvalid(true);
      }

      if (vpw === rpw) {
        setEmsg3("비밀번호가 일치합니다.");
        setSamepwisvalid(true);
      } else {
        setEmsg3("비밀번호가 일치하지 않습니다.");
        setSamepwisvalid(false);
      }
    }
  };

  const repwvaluechange = (event) => {
    const vrpw = event.target.value;
    setRpw(vrpw);
    //비밀번호확인 예외처리
    if (vrpw === "") {
      setEmsg3("필수입니다.");
      setSamepwisvalid(false);
    } else {
      if (vrpw === pw) {
        setEmsg3("비밀번호가 일치합니다.");
        setSamepwisvalid(true);
      } else {
        setEmsg3("비밀번호가 일치하지 않습니다.");
        setSamepwisvalid(false);
      }
    }
  };

  const namevaluechange = (event) => {
    const nameRegex = /^[가-힣]+$/;

    const vname = event.target.value;
    setName(vname);
    //이름 예외처리
    if (vname === "") {
      setEmsg4("필수입니다.");
      setNameisvalid(false);
    } else {
      if (!nameRegex.test(vname) || vname.length < 2 || vname.length > 5) {
        setEmsg4("2글자 이상 5글자 이하 한글만 입력해주세요.");
        setNameisvalid(false);
      } else {
        setEmsg4("");
        setNameisvalid(true);
      }
    }
  };

  const birthvaluechange = (event) => {
    const target = $(event.target);
    const name = target.closest("select").attr("id");
    const vbrith = event.target.value;

    const cloneData = { ...birth };
    cloneData[name] = vbrith;
    setBirth(cloneData);

    // console.log(cloneData);

    if (name === "year" && vbrith === "") {
      setEmsg5_1("필수입니다.");
    } else if (name === "month" && vbrith === "") {
      setEmsg5_2("필수입니다.");
    } else if (name === "day" && vbrith === "") {
      setEmsg5_3("필수입니다.");
    } else if (name === "year" && vbrith) {
      setEmsg5_1("");
    } else if (name === "month" && vbrith) {
      setEmsg5_2("");
    } else if (name === "day" && vbrith) {
      setEmsg5_3("");
    }
  };

  const emailvaluechange = (event) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const vemail = event.target.value;
    setEmail(vemail);
    setDupemailisvalid(false);
    //email 예외처리
    if (vemail === "") {
      setEmsg6("필수입니다.");
      setEmailisvalid(false);
    } else {
      if (!emailRegex.test(vemail)) {
        setEmsg6("이메일 형식이 아닙니다.");
        setEmailisvalid(false);
      } else {
        setEmsg6("");
        setEmailisvalid(true);
      }
    }
  };

  const gendervaluechange = (event) => {
    const vgender = event.target.value;
    // console.log(vgender);
    setGender(vgender);
    if (vgender === "") {
      setEmsg7("필수입니다.");
      setGenderisvalid(false);
    } else {
      setEmsg7("");
      setGenderisvalid(true);
    }
  };

  const nicknamevaluechange = (event) => {
    const vnname = event.target.value;
    setNickname(vnname);
    setDupnicknameisvalid(false);
    //이름 예외처리
    if (vnname === "") {
      setEmsg8("필수입니다.");
      setNicknameisvalid(false);
    } else {
      if (vnname.length > 12) {
        setEmsg8("12글자 미만으로 입력해주세요.");
        setNicknameisvalid(false);
      } else {
        setEmsg8("");
        setNicknameisvalid(true);
      }
    }
  };

  const phonevaluechange = (event) => {
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    const vphone = event.target.value;

    setPhone(vphone);

    if (vphone === "") {
      setEmsg9("");
      setPhoneisvalid(true);
      return;
    }
    if (!phoneRegex.test(vphone)) {
      setEmsg9("잘못된 번호입니다. 다시 확인해주세요.");
      setPhoneisvalid(false);
    } else {
      setEmsg9("");
      setPhoneisvalid(true);
    }
  };

  /**
   * 아이디 중복검사
   */
  const duplicateIdCheck = async () => {
    if (!idisvalid) {
      // console.log("아이디가 유효하지 않습니다");
      return;
    }
    if (dupidisvalid) {
      // console.log("아이디 중복 확인 완료");
      return;
    }
    await axios({
      url: "http://localhost:5000/idcheck",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "error") {
          setEmsg1(message);
          setIdisvalid(false);
          setDupidisvalid(false);
        } else {
          setEmsg1(message);
          setIdisvalid(true);
          setDupidisvalid(true);
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
    if (!emailisvalid) {
      // console.log("이메일이 유효하지 않습니다");
      return;
    }
    if (dupemailisvalid) {
      // console.log("이메일 중복 확인 완료");
      return;
    }
    await axios({
      url: "http://localhost:5000/emailcheck",
      method: "POST",
      data: { email: email },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "error") {
          setEmsg6(message);
          setEmailisvalid(false);
          setDupemailisvalid(false);
        } else {
          setEmsg6(message);
          setEmailisvalid(true);
          setDupemailisvalid(true);
        }
      })
      .catch((e) => {
        console.log("이메일 중복체크 오류!", e);
      });
  };

  /**
   * 닉네임 중복검사
   */
  const duplicatenickCheck = async () => {
    if (!nicknameisvalid) {
      // console.log("닉네임이 유효하지 않습니다");
      return;
    }
    if (dupnicknameisvalid) {
      // console.log("닉네임 중복 확인 완료");
      return;
    }
    await axios({
      url: "http://localhost:5000/nicknamecheck",
      method: "POST",
      data: { nickname: nickname },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "error") {
          setEmsg8(message);
          setNicknameisvalid(false);
          setDupnicknameisvalid(false);
        } else {
          setEmsg8(message);
          setNicknameisvalid(true);
          setDupnicknameisvalid(true);
        }
      })
      .catch((e) => {
        console.log("닉네임 중복체크 오류!", e);
      });
  };
  /**
   * 회원가입 값 유효성 검사
   */
  const joinisvalid = () => {
    if (!idisvalid) {
      // console.log("아이디를 확인하세요");
      inputRef.current[0].focus();
      return;
    }
    if (!dupidisvalid) {
      // console.log("아이디 중복을 확인하세요");
      return;
    }
    if (!pwisvalid) {
      // console.log("비밀번호를 확인하세요");
      inputRef.current[1].focus();
      return;
    }
    if (!samepwisvalid) {
      // console.log("비밀번호 재입력을 확인하세요");
      inputRef.current[2].focus();
      return;
    }
    if (!nameisvalid) {
      // console.log("이름을 확인하세요");
      inputRef.current[3].focus();
      return;
    }
    //생일
    if (!birth.year || !birth.month || !birth.day) {
      // console.log("날짜를 확인하세요");
      return;
    }
    if (!emailisvalid) {
      // console.log("이메일을 확인하세요");
      inputRef.current[4].focus();
      return;
    }
    if (!dupemailisvalid) {
      // console.log("이메일 중복을 확인하세요");
      return;
    }
    if (!genderidvalid) {
      // console.log("성별을 확인하세요");
      return;
    }
    if (!nicknameisvalid) {
      // console.log("닉네임을 확인하세요");

      inputRef.current[5].focus();
      return;
    }
    if (!dupnicknameisvalid) {
      // console.log("닉네임 중복을 확인하세요");
      return;
    }
    if (!phoneisvalid) {
      // console.log("번호를 확인하세요");
      return;
    }

    joincheck();
  };

  const joincheck = async () => {
    await axios({
      url: "http://localhost:5000/join",
      method: "POST",
      data: {
        id: id,
        pw: pw,
        name: name,
        birth: birth,
        email: email,
        gender: gender,
        nickname: nickname,
        phone: phone,
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
      {/* <div className="toast">어쩌고노ㅓ라어ㅣ나어리</div>; */}
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
              placeholder="아이디"
              className="item overlap"
              onChange={idvaluechange}
            />
            <button
              className={classnames("overlapbtn", { over: dupidisvalid })}
              onClick={duplicateIdCheck}
            >
              중복확인
            </button>
            <section className="msgtitle">
              <span className="msg">{emsg1}</span>
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
              placeholder="비밀번호"
              className="item"
              onChange={pwvaluechange}
            />
            <span>
              8~20자까지 영문,숫자,특수문자(_!@#$%^&*)모두 조합하여 입력
            </span>
            <section className="msgtitle">
              <span className="msg">{emsg2}</span>
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
              placeholder="비밀번호 재입력"
              className="item"
              onChange={repwvaluechange}
            />
            <section className="msgtitle">
              <span className="msg">{emsg3}</span>
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
              placeholder="이름"
              className="item"
              onChange={namevaluechange}
            />
            <section className="msgtitle">
              <span className="msg">{emsg4}</span>
            </section>
          </div>
          <div className="birthcontainer">
            <section className="title">
              <span>생년월일</span>
              <span className="essential">*</span>
            </section>
            <select
              className="b-box"
              id="year"
              required
              onChange={birthvaluechange}
            >
              <option value="">연도</option>
              {yearArr.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
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
                <span className="msg">{emsg5_1}</span>
              </section>
              <section className="msgtitle">
                <span className="msg">{emsg5_2}</span>
              </section>
              <section className="msgtitle">
                <span className="msg">{emsg5_3}</span>
              </section>
            </div>
          </div>
          <div className="emailcontainer">
            <section className="title">
              <span>이메일</span>
              <span className="essential">*</span>
            </section>
            <input
              ref={(el) => (inputRef.current[4] = el)}
              type="text"
              name="email"
              placeholder="geenee@gmail.com"
              className="item overlap"
              onChange={emailvaluechange}
            />
            <button
              className={classnames("overlapbtn", { over: dupemailisvalid })}
              onClick={duplicateEmailCheck}
            >
              중복확인
            </button>
            <section className="msgtitle">
              <span className="msg">{emsg6}</span>
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
              <span className="msg">{emsg7}</span>
            </section>
          </div>
          <div className="nicknamecontainer">
            <section className="title">
              <span>닉네임</span>
              <span className="essential">*</span>
            </section>
            <input
              ref={(el) => (inputRef.current[5] = el)}
              type="text"
              name="nickname"
              placeholder="닉네임"
              className="item overlap"
              onChange={nicknamevaluechange}
            />
            <button
              className={classnames("overlapbtn", { over: dupnicknameisvalid })}
              onClick={duplicatenickCheck}
            >
              중복확인
            </button>
            <section className="msgtitle">
              <span className="msg">{emsg8}</span>
            </section>
          </div>
          <div className="phonecontainer">
            <section className="title">
              <span>휴대폰 번호</span>
            </section>
            <input
              type="text"
              name="phone"
              placeholder="010-1234-1234"
              className="item"
              onChange={phonevaluechange}
            />
            <section className="msgtitle">
              <span className="msg">{emsg9}</span>
            </section>
          </div>
          <button className="joinbtn" onClick={joinisvalid}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default Join;
