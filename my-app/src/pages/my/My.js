import React, { useRef } from "react";
import axios from "axios";
import "./My.css";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";

import { StoreContext, 세션정보가져오기 } from "../../App";
import { useNavigate } from "react-router-dom";

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
        {inputstate && <span>{loginUser.mem_nickname}</span>}
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
        {inputstate && <span>{loginUser.mem_email}</span>}
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
        {inputstate && <span>{loginUser.mem_username}</span>}
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
        {inputstate && <span>{loginUser.mem_phone}</span>}
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

function PwdValue() {
  const inputFocus = useRef(null);

  const [modalOpen1, setModalOpen1] = React.useState(false);
  const [inputstate, setInputstate] = React.useState(true);
  const [pwd, setPhone] = React.useState("");
  const [emsg1, setEmsg1] = React.useState("");
  const [emsg2, setEmsg2] = React.useState("");

  React.useEffect(() => {
    if (!inputstate) {
      inputFocus.current.focus();
      return;
    }
  }, [inputstate]);

  return (
    <div className="item">
      <span>비밀번호</span>
      <button
        className="pwdbtn"
        onClick={() => {
          setModalOpen1(true);
        }}
      >
        비밀번호 변경
      </button>

      <Modal
        open={modalOpen1}
        close={() => {
          setModalOpen1(false);
        }}
        header="비밀번호 변경"
      >
        비밀번호변경모달
      </Modal>
    </div>
  );
}

function My() {
  const navigation = useNavigate();

  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);

  const [State, setState] = React.useState({
    session: "로그인",
  });

  React.useEffect(() => {
    if (loginUser.mem_userid !== undefined) {
      // setState({ session: "마이" });
      // console.log(loginUser);
    }
  }, [loginUser]);

  return (
    <div className="container">
      <Menubar />
      <div className="contents-container">
        <div className="title">
          <span className="myinfo">내정보 관리</span>
        </div>
        <div className="myinfo-container">
          <section className="login-info">
            <span className="title">로그인 정보</span>
            <div className="item">
              <span>아이디</span>
              <div className="info-box">
                <span>{loginUser.mem_userid}</span>
              </div>
            </div>
            <PwdValue></PwdValue>
            <NicknameValue></NicknameValue>
            <EmailValue></EmailValue>
          </section>
          <section className="user-info">
            <span className="title">본인 확인 정보</span>
            <NameValue></NameValue>
            <div className="item">
              <span>생년월일</span>
              <div className="info-box">
                <span>{loginUser.mem_birth}</span>
              </div>
            </div>
            <PhoneValue></PhoneValue>
          </section>
          <section className="Withdrawal">
            <span
              onClick={() => {
                // 모달 띄울까요?
                alert("정말탈퇴하시겠습니까?");
              }}
            >
              회원탈퇴하기
            </span>
          </section>
        </div>
      </div>
    </div>
  );
}

export default My;
