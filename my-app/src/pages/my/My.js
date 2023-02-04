import React, { useRef } from "react";
import axios from "axios";
import "./My.css";
import "./MyModal.css";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";

import { StoreContext, 세션정보가져오기, 세션삭제하기 } from "../../App";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";

function LogininfoCon() {
  const { loginUser } = React.useContext(StoreContext);

  return (
    <section className="login-info">
      <span className="title">로그인 정보</span>
      <div className="item">
        <span>아이디</span>
        <div className="info-box">
          <span>{loginUser && loginUser.mem_userid}</span>
        </div>
      </div>
      <PwdModModal></PwdModModal>
      <NicknameValue></NicknameValue>
      <EmailValue></EmailValue>
    </section>
  );
}

function UserinfoCon() {
  const { loginUser } = React.useContext(StoreContext);

  return (
    <section className="user-info">
      <span className="title">본인 확인 정보</span>
      <NameValue></NameValue>
      <div className="item">
        <span>생년월일</span>
        <div className="info-box">
          <span>{loginUser && loginUser.mem_birth}</span>
        </div>
      </div>
      <PhoneValue></PhoneValue>
    </section>
  );
}

function NicknameValue() {
  const { loginUser } = React.useContext(StoreContext);

  const inputFocus = useRef(null);

  const [inputstate, setInputstate] = React.useState(true);
  const [nickname, setNickname] = React.useState("");
  const [emsg, setEmsg] = React.useState("");

  React.useEffect(() => {
    if (!inputstate) {
      inputFocus.current.focus();
      return;
    }
  }, [inputstate]);

  const valuechange = (event) => {
    const data = event.target.value;
    if (data.length !== 13) {
      setNickname(data);
    }
  };

  const nicknamechange = async () => {
    await axios({
      url: "http://localhost:5000/nicknamechange",
      method: "POST",
      data: { idx: loginUser.mem_idx, nickname: nickname },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          세션정보가져오기();
          setEmsg("");
          setInputstate(!inputstate);
        }
      })
      .catch((e) => {
        console.log("닉네임 변경 오류!", e);
      });
  };

  const nicknamevalidcheck = async () => {
    if (nickname === "") {
      // console.log("닉네임을 입력하세요");
      setEmsg("닉네임을 입력하세요.");
      inputFocus.current.focus();
      return;
    }

    if (nickname === loginUser.mem_nickname) {
      setEmsg("");
      setInputstate(!inputstate);
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
          setEmsg(message);
        } else {
          nicknamechange();
        }
      })
      .catch((e) => {
        console.log("닉네임 중복체크 오류!", e);
      });
  };

  return (
    <div className="item">
      <span>닉네임</span>
      <div className="info-box">
        {inputstate && <span>{loginUser && loginUser.mem_nickname}</span>}
        {!inputstate && (
          <input
            ref={inputFocus}
            type="text"
            maxLength={12}
            value={nickname}
            onChange={valuechange}
          />
        )}
        {inputstate && (
          <button
            onClick={() => {
              setInputstate(!inputstate);
              setNickname(loginUser.mem_nickname);
            }}
          >
            수정
          </button>
        )}
        {!inputstate && (
          <div>
            <button onClick={nicknamevalidcheck}>확인</button>
            <button
              onClick={(e) => {
                setInputstate(!inputstate);
                setEmsg("");
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>
      <span className="msg">{emsg}</span>
    </div>
  );
}
function EmailValue() {
  const { loginUser } = React.useContext(StoreContext);

  const inputFocus = useRef(null);

  const [inputstate, setInputstate] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [emsg, setEmsg] = React.useState("");

  React.useEffect(() => {
    if (!inputstate) {
      inputFocus.current.focus();
      return;
    }
  }, [inputstate]);

  const valuechange = (event) => {
    const data = event.target.value;
    setEmail(data);
  };

  const emailchange = async () => {
    await axios({
      url: "http://localhost:5000/emailchange",
      method: "POST",
      data: { idx: loginUser.mem_idx, email: email },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          세션정보가져오기();
          setEmsg("");
          setInputstate(!inputstate);
        }
      })
      .catch((e) => {
        console.log("이메일 변경 오류!", e);
      });
  };

  const emailvalidcheck = async () => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (email === "") {
      setEmsg("이메일을 입력하세요.");
      inputFocus.current.focus();
      return;
    }
    if (!emailRegex.test(email)) {
      setEmsg("이메일 형식이 아닙니다.");
      inputFocus.current.focus();
      return;
    }
    if (email === loginUser.mem_email) {
      setEmsg("");
      setInputstate(!inputstate);
      return;
    }
    await axios({
      url: "http://localhost:5000/emailcheck",
      method: "POST",
      data: { nickname: email },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "error") {
          setEmsg(message);
        } else {
          emailchange();
        }
      })
      .catch((e) => {
        console.log("이메일 중복체크 오류!", e);
      });
  };

  return (
    <div className="item">
      <span>이메일</span>
      <div className="info-box">
        {inputstate && <span>{loginUser && loginUser.mem_email}</span>}
        {!inputstate && (
          <input
            ref={inputFocus}
            type="text"
            value={email}
            onChange={valuechange}
          />
        )}
        {inputstate && (
          <button
            onClick={() => {
              setInputstate(!inputstate);
              setEmail(loginUser.mem_email);
            }}
          >
            수정
          </button>
        )}
        {!inputstate && (
          <div>
            <button onClick={emailvalidcheck}>확인</button>
            <button
              onClick={(e) => {
                setInputstate(!inputstate);
                setEmsg("");
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>
      <span className="msg">{emsg}</span>
    </div>
  );
}
function NameValue() {
  const { loginUser } = React.useContext(StoreContext);

  const inputFocus = useRef(null);

  const [inputstate, setInputstate] = React.useState(true);
  const [username, setUserame] = React.useState("");
  const [emsg, setEmsg] = React.useState("");

  React.useEffect(() => {
    if (!inputstate) {
      inputFocus.current.focus();
      return;
    }
  }, [inputstate]);

  const valuechange = (event) => {
    const data = event.target.value;
    if (data.length !== 6) {
      setUserame(data);
    }
  };

  const usernamechange = async () => {
    const nameRegex = /^[가-힣]+$/;

    if (username === "") {
      setEmsg("이름을 입력하세요.");
      inputFocus.current.focus();
      return;
    }
    if (!nameRegex.test(username) || username.length < 2) {
      setEmsg("2글자 이상 5글자 이하 한글만 입력해주세요.");
      inputFocus.current.focus();
      return;
    }
    if (username === loginUser.mem_username) {
      setEmsg("");
      setInputstate(!inputstate);
      return;
    }
    await axios({
      url: "http://localhost:5000/usernamechange",
      method: "POST",
      data: { idx: loginUser.mem_idx, username: username },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          세션정보가져오기();
          setEmsg("");
          setInputstate(!inputstate);
        }
      })
      .catch((e) => {
        console.log("이름 변경 오류!", e);
      });
  };

  return (
    <div className="item">
      <span>이름</span>
      <div className="info-box">
        {inputstate && <span>{loginUser && loginUser.mem_username}</span>}
        {!inputstate && (
          <input
            ref={inputFocus}
            type="text"
            maxLength={5}
            value={username}
            onChange={valuechange}
          />
        )}
        {inputstate && (
          <button
            onClick={() => {
              setInputstate(!inputstate);
              setUserame(loginUser.mem_username);
            }}
          >
            수정
          </button>
        )}
        {!inputstate && (
          <div>
            <button onClick={usernamechange}>확인</button>
            <button
              onClick={(e) => {
                setInputstate(!inputstate);
                setEmsg("");
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>
      <span className="msg">{emsg}</span>
    </div>
  );
}
function PhoneValue() {
  const { loginUser } = React.useContext(StoreContext);

  const inputFocus = useRef(null);

  const [inputstate, setInputstate] = React.useState(true);
  const [phone, setPhone] = React.useState("");
  const [emsg, setEmsg] = React.useState("");

  React.useEffect(() => {
    if (!inputstate) {
      inputFocus.current.focus();
      return;
    }
  }, [inputstate]);

  const valuechange = (event) => {
    const data = event.target.value;
    if (data.length !== 14) {
      setPhone(data);
    }
  };

  const phonechange = async () => {
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if (!phoneRegex.test(phone) && phone.length !== 0) {
      setEmsg("전화번호를 입력하세요.");
      inputFocus.current.focus();
      return;
    }
    if (phone === loginUser.mem_phone) {
      setEmsg("");
      setInputstate(!inputstate);
      return;
    }
    await axios({
      url: "http://localhost:5000/phonechange",
      method: "POST",
      data: { idx: loginUser.mem_idx, phone: phone },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          세션정보가져오기();
          setEmsg("");
          setInputstate(!inputstate);
        }
      })
      .catch((e) => {
        console.log("전화번호 변경 오류!", e);
      });
  };

  return (
    <div className="item">
      <span>휴대폰 전화번호</span>
      <div className="info-box">
        {inputstate && <span>{loginUser && loginUser.mem_phone}</span>}
        {!inputstate && (
          <input
            ref={inputFocus}
            type="text"
            maxLength={13}
            value={phone}
            onChange={valuechange}
          />
        )}
        {inputstate && (
          <button
            onClick={() => {
              setInputstate(!inputstate);
              setPhone(loginUser.mem_phone);
            }}
          >
            수정
          </button>
        )}
        {!inputstate && (
          <div>
            <button onClick={phonechange}>확인</button>
            <button
              onClick={(e) => {
                setInputstate(!inputstate);
                setEmsg("");
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>
      <span className="msg">{emsg}</span>
    </div>
  );
}
function Pwdvalue() {
  const { loginUser } = React.useContext(StoreContext);

  const inputFocus = useRef([]);

  const [passwordType1, setPasswordType1] = React.useState("password");
  const [passwordType2, setPasswordType2] = React.useState("password");
  const [passwordType3, setPasswordType3] = React.useState("password");
  const [icontype1, setIcontype1] = React.useState(true);
  const [icontype2, setIcontype2] = React.useState(true);
  const [icontype3, setIcontype3] = React.useState(true);

  const [curpwd, setCurpwd] = React.useState("");
  const [modpwd, setModpwd] = React.useState("");
  const [repwd, setRepwd] = React.useState("");
  const [pwisvalid, setPwisvalid] = React.useState(false);
  const [samepwisvalid, setSamepwisvalid] = React.useState(false);

  const [emsg1, setEmsg1] = React.useState("");
  const [emsg2, setEmsg2] = React.useState("");
  const [emsg3, setEmsg3] = React.useState("");

  const [inputset, setInputset] = React.useState(true);

  const pwdcheck = async () => {
    await axios({
      url: "http://localhost:5000/pwdcheck",
      method: "POST",
      data: { idx: loginUser.mem_idx, curpwd: curpwd },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "error") {
          setEmsg1(message);
          inputFocus.current[0].focus();
        } else {
          if (!pwisvalid) {
            // console.log("비밀번호를 확인하세요.");
            inputFocus.current[1].focus();
            return;
          }
          if (!samepwisvalid) {
            // console.log("비밀번호확인을 확인하세요.");
            inputFocus.current[2].focus();
            return;
          }
          // console.log("여기서 비밀번호 바꾸면 됩니다.");
          pwdvalchange();
        }
      })
      .catch((e) => {
        console.log("비밀번호 확인 오류!", e);
      });
  };

  const pwdvalchange = async () => {
    await axios({
      url: "http://localhost:5000/pwdchange",
      method: "POST",
      data: { idx: loginUser.mem_idx, modpwd: modpwd },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          console.log(message);
          세션정보가져오기();
          setInputset(false);
        }
      })
      .catch((e) => {
        console.log("비밀번호 변경 오류!", e);
      });
  };

  const pwdchange = () => {
    // setInputset(false);
    // console.log(curpwd);
    if (curpwd.length === 0) {
      // console.log("비밀번호를 입력해주세요.");
      setEmsg1("비밀번호를 입력해주세요.");
      inputFocus.current[0].focus();
      return;
    } else {
      pwdcheck();
    }
  };

  const valuechange1 = (event) => {
    const data = event.target.value;
    setCurpwd(data);
    if (data.length < 8 && data.length >= 1) {
      setEmsg1("8자리 이상 입력해주세요.");
    } else {
      setEmsg1("");
    }
  };

  const valuechange2 = (event) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    const data = event.target.value;
    setModpwd(data);
    //비밀번호 예외처리
    if (data === "") {
      setEmsg2("필수입니다.");
      setPwisvalid(false);
    } else {
      if (!passwordRegex.test(data)) {
        setEmsg2("숫자+영문자+특수문자 조합으로 8~20자리 입력해주세요.");
        setPwisvalid(false);
      } else {
        setEmsg2("");
        setPwisvalid(true);
      }

      if (data === repwd) {
        setEmsg3("비밀번호가 일치합니다.");
        setSamepwisvalid(true);
      } else {
        if (repwd.length !== 0) {
          setEmsg3("비밀번호가 일치하지 않습니다.");
        }
        setSamepwisvalid(false);
        // setEmsg3("비밀번호가 일치하지 않습니다.");
      }
    }
  };

  const valuechange3 = (event) => {
    const data = event.target.value;
    setRepwd(data);
    //비밀번호확인 예외처리
    if (data === "") {
      setEmsg3("필수입니다.");
      setSamepwisvalid(false);
    } else {
      if (data === modpwd) {
        setEmsg3("비밀번호가 일치합니다.");
        setSamepwisvalid(true);
      } else {
        if (modpwd.length !== 0) {
          setEmsg3("비밀번호가 일치하지 않습니다.");
        }
        setSamepwisvalid(false);
        // setEmsg3("비밀번호가 일치하지 않습니다.");
      }
    }
  };

  return (
    <div className="pwdmod">
      {inputset && (
        <div>
          <div>
            <input
              ref={(el) => (inputFocus.current[0] = el)}
              type={passwordType1}
              maxLength={20}
              placeholder="현재 비밀번호"
              onChange={valuechange1}
            />
            <FontAwesomeIcon
              icon={icontype1 ? faEyeSlash : faEye}
              className="imgicon"
              onMouseDown={() => {
                setIcontype1(false);
                setPasswordType1("text");
              }}
              onMouseUp={() => {
                setIcontype1(true);
                setPasswordType1("password");
              }}
            />
            <span className="msg">{emsg1}</span>
          </div>
          <div>
            <input
              // ref={inputFocus[1]}
              ref={(el) => (inputFocus.current[1] = el)}
              type={passwordType2}
              maxLength={20}
              placeholder="새 비밀번호"
              onChange={valuechange2}
            />
            <FontAwesomeIcon
              icon={icontype2 ? faEyeSlash : faEye}
              className="imgicon"
              onMouseDown={() => {
                setIcontype2(false);
                setPasswordType2("text");
              }}
              onMouseUp={() => {
                setIcontype2(true);
                setPasswordType2("password");
              }}
            />
            <span className="msg">{emsg2}</span>
          </div>
          <div>
            <input
              ref={(el) => (inputFocus.current[2] = el)}
              type={passwordType3}
              maxLength={20}
              placeholder="새 비밀번호 확인"
              onChange={valuechange3}
            />
            <FontAwesomeIcon
              icon={icontype3 ? faEyeSlash : faEye}
              className="imgicon"
              onMouseDown={() => {
                setIcontype3(false);
                setPasswordType3("text");
              }}
              onMouseUp={() => {
                setIcontype3(true);
                setPasswordType3("password");
              }}
            />
            <span className="msg">{emsg3}</span>
          </div>
          <div className="btncontainer">
            <button onClick={pwdchange}>변경</button>
          </div>
        </div>
      )}
      {!inputset && (
        <div className="pwdchanged">
          <span>비밀번호가 변경되었습니다.</span>
        </div>
      )}
    </div>
  );
}
function PwdModModal() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="item">
      <span>비밀번호</span>
      <button
        className="pwdbtn"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        비밀번호 변경
      </button>
      <Modal
        open={modalOpen}
        close={() => {
          setModalOpen(false);
        }}
        header="비밀번호 변경"
      >
        <Pwdvalue></Pwdvalue>
      </Modal>
    </div>
  );
}

function My() {
  const navigation = useNavigate();

  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);

  const [modalOpen, setModalOpen] = React.useState(false);

  const [State, setState] = React.useState({
    session: "로그인",
  });

  React.useEffect(() => {
    if (loginUser === null) {
      console.log("세션 없어요");
      navigation("/login");
    } else {
      //loginUser 값이 있을 때
    }
  }, []);

  const withdrawalreq = async () => {
    await axios({
      url: "http://localhost:5000/withdrawalreq",
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          세션삭제하기();
          navigation("/", { replace: true });
        }
      })
      .catch((e) => {
        console.log("닉네임 변경 오류!", e);
      });
  };
  return (
    <div className="container">
      <Menubar />
      <div className="contents-container">
        <div className="title">
          <span className="myinfo">내정보 관리</span>
        </div>
        <div className="myinfo-container">
          <LogininfoCon></LogininfoCon>
          <UserinfoCon></UserinfoCon>
          <section className="Withdrawal">
            <span
              onClick={() => {
                setModalOpen(true);
              }}
            >
              회원탈퇴하기
            </span>
            <Modal
              open={modalOpen}
              close={() => {
                setModalOpen(false);
              }}
              header="회원 탈퇴"
            >
              <div className="Withdrawal-box">
                <span>정말로 탈퇴하시겠습니까?</span>
                <span className="small">
                  작성한 글은 자동으로 삭제되지 않습니다.
                </span>
                <div>
                  <button className="withdrawalbtn" onClick={withdrawalreq}>
                    확인
                  </button>
                  <button
                    onClick={() => {
                      setModalOpen(false);
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            </Modal>
          </section>
        </div>
      </div>
    </div>
  );
}

export default My;
