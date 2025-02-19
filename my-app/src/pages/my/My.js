import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  createContext,
} from "react";
// import css
import "./My.css";
import "./MyModal.css";
// import src
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
//import component
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";
// import context
import { SessionContext } from "../../App";
// import api
import {
  getLogout,
  getWithdrawal,
  getEmailcode,
  getDuplicateEmail,
  getDuplicateNickname,
} from "../../api/Auth";
import {
  getUserInfo,
  getUpdateNickname,
  getUpdateEmail,
  getUpdateName,
  getUpdatePhone,
  getCheckPassword,
  getUpdatePassword,
} from "../../api/My";

function NicknameValue() {
  const { loginUser, setLoginUser } = useContext(userInfoContext);
  const inputFocus = useRef(null);
  const [inputstate, setInputstate] = useState(true);
  const [nickname, setNickname] = useState("");
  const [emsg, setEmsg] = useState("");

  useEffect(() => {
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
    // 닉네임 변경
    const { code } = await getUpdateNickname(loginUser.mem_idx, nickname);

    if (code === "success") {
      // userInfo Update
      setLoginUser(await getUserInfo());
      setEmsg("");
      setInputstate(!inputstate);
    }
  };

  const nicknamevalidcheck = async () => {
    if (nickname === "") {
      setEmsg("닉네임을 입력하세요.");
      inputFocus.current.focus();
      return;
    }

    if (nickname === loginUser.mem_nickname) {
      setEmsg("");
      setInputstate(!inputstate);
      return;
    }

    const { code, message } = await getDuplicateNickname(nickname);

    if (code === "error") {
      setEmsg(message);
    } else {
      nicknamechange();
    }
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
  const { loginUser, setLoginUser } = useContext(userInfoContext);

  const inputFocus = useRef(null);

  const [state, setState] = useState(false);
  const [disable, setDibable] = useState(true);
  const [inemail, setInemail] = useState("");
  const [email, setEmail] = useState("");
  const [emsg1, setEmsg1] = useState("");

  const [incode, setIncode] = useState("");
  const [servercode, setServercode] = useState("");
  const [emsg2, setEmsg2] = useState("");

  const valuechange = (event) => {
    const data = event.target.value;
    if (data.length <= 320) {
      setInemail(data);
    }
  };

  const codevaluechange = (event) => {
    const data = event.target.value;
    if (data.length <= 6) {
      setIncode(data);
    }
  };

  const emailcodeHandler = async () => {
    const { code, useremail, vericode } = await getEmailcode({
      youremail: inemail,
    });

    if (code === 200) {
      setEmail(useremail);
      setServercode(vericode);
    }
  };

  const emailchange = async () => {
    if (!disable && incode === "") {
      setEmsg2("인증번호를 입력하세요.");
      return;
    }

    if (incode != servercode) {
      setEmsg2("인증번호가 틀렸습니다.");
      return;
    }

    setEmsg2("");
    // 이메일 변경
    const { code } = await getUpdateEmail(loginUser.mem_idx, email);

    if (code === "success") {
      // userInfo Update
      setLoginUser(await getUserInfo());
      setState(true);
    }
  };

  const emailvalidcheck = async () => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (inemail === "") {
      setEmsg1("이메일을 입력하세요.");
      inputFocus.current.focus();
      return;
    }
    if (!emailRegex.test(inemail)) {
      setEmsg1("이메일 형식이 아닙니다.");
      inputFocus.current.focus();
      return;
    }
    if (inemail === loginUser.mem_email) {
      setEmsg1("같은 이메일입니동");
      return;
    }

    const { code, message } = await getDuplicateEmail(inemail);

    if (code === "error") {
      setEmsg1(message);
    } else {
      emailcodeHandler();
      setEmsg1("인증번호를 전송하였습니다.");
      setDibable(false);
    }
  };

  return (
    <div className="emailchangebox">
      {!state && (
        <>
          <div>
            <span>현재 이메일</span>
            <span>{loginUser && loginUser.mem_email}</span>
          </div>
          <div>
            <span>변경 이메일</span>
            <input
              ref={inputFocus}
              type="text"
              maxLength={320}
              value={inemail}
              onChange={valuechange}
            />
            <button onClick={emailvalidcheck}>인증번호 받기</button>
            <span className="msg">{emsg1}</span>
          </div>
          <div>
            <span>인증 번호</span>
            <input
              type="text"
              value={incode}
              maxLength={6}
              onChange={codevaluechange}
              placeholder="인증번호 6자리 숫자 입력"
              disabled={disable}
            />
            <button onClick={emailchange} disabled={disable}>
              확인
            </button>
            <span className="msg">{emsg2}</span>
          </div>
        </>
      )}
      {state && (
        <div className="emailchanged">
          <span>이메일이 변경되었습니다.</span>
        </div>
      )}
    </div>
  );
}
function EmailModModal() {
  const { loginUser, loginType } = useContext(userInfoContext);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="item">
      <span>이메일</span>
      <div className="info-box">
        <span>{loginUser.mem_email}</span>
        {loginType === "local" && (
          <button
            className="pwdbtn"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            수정
          </button>
        )}
      </div>
      <Modal
        open={modalOpen}
        close={() => {
          setModalOpen(false);
        }}
        header="이메일 변경"
      >
        <EmailValue />
      </Modal>
    </div>
  );
}
function NameValue() {
  const { loginUser, setLoginUser } = useContext(userInfoContext);

  const inputFocus = useRef(null);

  const [inputstate, setInputstate] = useState(true);
  const [username, setUserame] = useState("");
  const [emsg, setEmsg] = useState("");

  useEffect(() => {
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

    const { code } = await getUpdateName(loginUser.mem_idx, username);

    if (code === "success") {
      // userInfo Update
      setLoginUser(await getUserInfo());
      setEmsg("");
      setInputstate(!inputstate);
    }
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
  const { loginUser, setLoginUser } = useContext(userInfoContext);

  const inputFocus = useRef(null);

  const [inputstate, setInputstate] = useState(true);
  const [phone, setPhone] = useState("");
  const [emsg, setEmsg] = useState("");

  useEffect(() => {
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

    const { code } = await getUpdatePhone(loginUser.mem_idx, phone);

    if (code === "success") {
      setLoginUser(await getUserInfo());
      setEmsg("");
      setInputstate(!inputstate);
    }
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
  const { loginUser, setLoginUser } = useContext(userInfoContext);

  const inputFocus = useRef([]);

  const [passwordType1, setPasswordType1] = useState("password");
  const [passwordType2, setPasswordType2] = useState("password");
  const [passwordType3, setPasswordType3] = useState("password");
  const [icontype1, setIcontype1] = useState(true);
  const [icontype2, setIcontype2] = useState(true);
  const [icontype3, setIcontype3] = useState(true);

  const [curpwd, setCurpwd] = useState("");
  const [modpwd, setModpwd] = useState("");
  const [repwd, setRepwd] = useState("");
  const [pwisvalid, setPwisvalid] = useState(false);
  const [samepwisvalid, setSamepwisvalid] = useState(false);

  const [emsg1, setEmsg1] = useState("");
  const [emsg2, setEmsg2] = useState("");
  const [emsg3, setEmsg3] = useState("");

  const [inputset, setInputset] = useState(true);

  const pwdvalchange = async () => {
    const { code, message } = await getUpdatePassword(
      loginUser.mem_idx,
      modpwd
    );

    if (code === "success") {
      // userInfo Update
      setLoginUser(await getUserInfo());
      setInputset(false);
    }
  };

  const pwdcheck = async () => {
    const { code, message } = await getCheckPassword(loginUser.mem_idx, curpwd);

    if (code === "error") {
      setEmsg1(message);
      inputFocus.current[0].focus();
    } else {
      if (!pwisvalid) {
        inputFocus.current[1].focus();
        return;
      }
      if (!samepwisvalid) {
        inputFocus.current[2].focus();
        return;
      }
      pwdvalchange();
    }
  };

  const pwdchange = () => {
    if (curpwd.length === 0) {
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
  const [modalOpen, setModalOpen] = useState(false);

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

const userInfoContext = createContext(null);

function My() {
  const { loginSession, loginType, fetchLoginSession } =
    useContext(SessionContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [loginUser, setLoginUser] = useState(null);

  // 로그인 세션에 따른 사용자 정보 저장
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoginUser(await getUserInfo());
    };

    if (loginSession) fetchUserInfo();
  }, [loginSession]);

  // 회원 탈퇴 요청
  const withdrawalHandler = async () => {
    const { code, message } = await getWithdrawal(loginUser.mem_idx);

    if (code === "success") {
      alert(message);
      // 로그아웃
      await getLogout();
      // 로그인 세션 가져오기
      await fetchLoginSession();
    }
  };

  return (
    <>
      {loginSession && loginUser && loginType && (
        <userInfoContext.Provider
          value={{ loginUser, setLoginUser, loginType }}
        >
          <Menubar />
          <div className="contents-container mycon">
            <div className="title my">
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
                {loginType === "local" && <PwdModModal />}
                <NicknameValue />
              </section>
              <section className="user-info">
                <span className="title">본인 확인 정보</span>
                <NameValue />
                <EmailModModal />
                <PhoneValue />
              </section>
              <section className="Withdrawal">
                <span onClick={() => setModalOpen(true)}>회원탈퇴하기</span>
                <Modal
                  open={modalOpen}
                  close={() => setModalOpen(false)}
                  header="회원 탈퇴"
                >
                  <div className="Withdrawal-box">
                    <span>정말로 탈퇴하시겠습니까?</span>
                    <span className="small">
                      작성한 글은 자동으로 삭제되지 않습니다.
                    </span>
                    <div>
                      <button
                        className="withdrawalbtn"
                        onClick={withdrawalHandler}
                      >
                        확인
                      </button>
                      <button onClick={() => setModalOpen(false)}>취소</button>
                    </div>
                  </div>
                </Modal>
              </section>
            </div>
          </div>
        </userInfoContext.Provider>
      )}
    </>
  );
}

export default My;
