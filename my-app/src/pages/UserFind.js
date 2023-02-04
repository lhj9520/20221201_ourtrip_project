import React from "react";
import axios from "axios";
import classnames from "classnames";
import "./UserFind.css";
import logoimg from "../img/logo_oco.png";

import { 세션정보가져오기 } from "../App";
import { useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { faSistrix } from "@fortawesome/free-brands-svg-icons";

function Inputbox(props) {
  const { seltype } = props;
  const type = seltype === "이메일 주소" ? "email" : "phone";
  const { res1, setRes1 } = React.useContext(StoreContextRes1);

  const [sdata, setSdata] = React.useState({
    type: type,
    name: "",
    ind: "",
  });

  const valuechange1 = (event) => {
    const data = event.target.value;
    if (data.length <= 5) {
      setSdata((prevState) => {
        return { ...prevState, name: data };
      });
    }
  };

  const valuechange2 = (event) => {
    const data = event.target.value;
    if (data.length <= 320) {
      setSdata((prevState) => {
        return { ...prevState, ind: data };
      });
    }
  };

  const findreq = async () => {
    // window.open("https://www.naver.com/", "_blank", "noopener, noreferrer");
    if (sdata.name === "" || sdata.ind === "") {
      return;
    }
    await axios({
      url: "http://localhost:5000/findid",
      method: "POST",
      data: sdata,
    })
      .then((res) => {
        const { code, message, id } = res.data;
        if (code === "success") {
          // console.log(id + " " + message);
          setRes1((prevState) => {
            return { ...prevState, open: true, id: id };
          });
        } else {
          // console.log(message);
          setRes1((prevState) => {
            return { ...prevState, open: true, id: id };
          });
        }
      })
      .catch((e) => {
        console.log("회원 찾기 오류!", e);
      });
  };

  return (
    <div className="findtextbox">
      <span>
        회원정보에 등록한 {seltype + "와"} 입력한 {seltype + "가"} 같아야
        아이디를 찾을 수 있습니다.
      </span>
      <div>
        <span>이름</span>
        <input
          type="text"
          maxLength={5}
          value={sdata.name}
          onChange={valuechange1}
        />
      </div>
      <div>
        <span>{seltype}</span>
        <input type="text" onChange={valuechange2} />
        <button onClick={findreq}>확인</button>
      </div>
    </div>
  );
}

function Inputbox2() {
  const { res2, setRes2 } = React.useContext(StoreContextRes2);

  const [sdata, setSdata] = React.useState({
    id: "",
  });

  const valuechange = (event) => {
    const data = event.target.value;
    if (data.length <= 12) {
      setSdata((prevState) => {
        return { ...prevState, id: data };
      });
    }
  };

  const findreq = async () => {
    await axios({
      url: "http://localhost:5000/findpw",
      method: "POST",
      data: sdata,
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          setRes2((prevState) => {
            return { ...prevState, open: true, code: code };
          });
        } else {
          setRes2((prevState) => {
            return { ...prevState, open: true, code: code };
          });
        }
      })
      .catch((e) => {
        console.log("아이디 찾기 오류!", e);
      });
  };

  return (
    <div className="idchoicecon down">
      <div>
        <span>비밀번호를 찾고자하는 아이디를 입력해주세요.</span>
        <div>
          <span>아이디</span>
          <input
            type="text"
            maxLength={12}
            value={sdata.id}
            onChange={valuechange}
          />
          <button onClick={findreq}>다음</button>
        </div>
      </div>
    </div>
  );
}

function Choicebox() {
  const { res1, setRes1 } = React.useContext(StoreContextRes1);

  const [findtype, setFindtype] = React.useState(true);

  React.useEffect(() => {
    setRes1((prevState) => {
      return { ...prevState, open: false, id: "" };
    });
  }, [findtype]);

  return (
    <div className="idchoicecon">
      <div className="emailbox">
        <input
          type="radio"
          value="email"
          checked={findtype}
          onChange={() => {
            setFindtype(true);
          }}
        />
        <label>회원정보에 등록한 이메일로 찾기</label>
        {findtype && <Inputbox seltype="이메일 주소"></Inputbox>}
      </div>
      <div className="phonebox lastbox">
        <input
          type="radio"
          value="phone"
          checked={!findtype}
          onChange={() => {
            setFindtype(false);
          }}
        />
        <label className="lastbox">회원정보에 등록한 휴대전화로 찾기</label>
        {!findtype && <Inputbox seltype="휴대전화 번호"></Inputbox>}
      </div>
    </div>
  );
}

function Result() {
  const { res1 } = React.useContext(StoreContextRes1);

  return (
    <div>
      {res1.open && (
        <div className="rescon">
          {res1.id === "" ? (
            <span>해당 회원이 존재하지 않습니다.</span>
          ) : (
            <span>회원님의 아이디는 {res1.id}입니다.</span>
          )}
        </div>
      )}
    </div>
  );
}

function Resultpw() {
  const { res2 } = React.useContext(StoreContextRes2);

  return (
    <div>
      {res2.open && (
        <div className="rescon pw">
          {res2.code === "error" ? (
            <span>해당 아이디의 회원이 존재하지 않습니다.</span>
          ) : (
            <div>
              <div>
                <span>비밀번호를 변경하세요.</span>
                <span>
                  숫자+영문자+특수문자 조합으로 8~20자리 입력해주세요.
                </span>
              </div>
              <div>
                <input
                  type="password"
                  maxLength={20}
                  placeholder="새로운 비밀번호 입력"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <input
                  type="password"
                  maxLength={20}
                  placeholder="새로운 비밀번호 확인"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <button>변경</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IdFind() {
  return (
    <div className="id-content">
      <span>아이디 찾기</span>
      <span>아이디 찾는 방법을 선택해주세요.</span>
      <Choicebox></Choicebox>
      <Result></Result>
    </div>
  );
}

function PwFind() {
  return (
    <div className="pw-content">
      <span>비밀번호 찾기</span>
      <Inputbox2></Inputbox2>
      <Resultpw></Resultpw>
    </div>
  );
}

const StoreContextRes1 = React.createContext({});
const StoreContextRes2 = React.createContext({});

function UserFind() {
  const navigation = useNavigate();

  const { state } = useLocation();

  const [type, setType] = React.useState(state);
  const [res1, setRes1] = React.useState({
    open: false,
    id: "",
  });

  const [res2, setRes2] = React.useState({
    open: false,
    code: "",
  });

  React.useEffect(() => {
    // console.log("이거 실행?");
    setRes1((prevState) => {
      return { ...prevState, open: false, id: "" };
    });
    setRes2((prevState) => {
      return { ...prevState, open: false, code: "" };
    });
  }, [type]);

  return (
    <div className="userfind-container">
      <div className="type-header">
        <img
          src={logoimg}
          alt="logo이미지"
          className="item"
          onClick={() => {
            세션정보가져오기();
            navigation("/");
          }}
        />
        <div
          className={type === "id" ? "selected" : ""}
          onClick={() => {
            setType("id");
          }}
        >
          <FontAwesomeIcon icon={faSistrix} className="imgicon" />
          <span>아이디 찾기</span>
        </div>
        <div
          className={type === "pw" ? "selected" : ""}
          onClick={() => {
            setType("pw");
          }}
        >
          <FontAwesomeIcon icon={faUnlockKeyhole} className="imgicon" />
          <span>비밀번호 찾기</span>
        </div>
      </div>
      <div className="content-container">
        <StoreContextRes1.Provider value={{ res1, setRes1 }}>
          <StoreContextRes2.Provider value={{ res2, setRes2 }}>
            <div className="content-box">
              {type === "id" ? <IdFind></IdFind> : <PwFind></PwFind>}
            </div>
          </StoreContextRes2.Provider>
        </StoreContextRes1.Provider>
      </div>
    </div>
  );
}

export default UserFind;
