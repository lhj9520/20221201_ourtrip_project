import React from "react";
import axios from "axios";
import classnames from "classnames";
import "./UserFind.css";
import logoimg from "../../img/logo_oco.png";

import { importsession } from "../../App";
import { useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { faSistrix } from "@fortawesome/free-brands-svg-icons";

function Inputbox(props) {
  const navigation = useNavigate();
  const { seltype, idcert } = props;
  const type = seltype === "이메일 주소" ? "email" : "phone";
  const { res1, setRes1 } = React.useContext(StoreContextRes1);
  const { res2, setRes2 } = React.useContext(StoreContextRes2);

  const [disable, setDisable] = React.useState(true);

  const [code, setCode] = React.useState({
    inputcode: "",
    servercode: "",
  });

  const [idata, setIdata] = React.useState({
    name: "",
    ind: "",
  });

  const [sdata, setSdata] = React.useState({
    type: type,
    name: "",
    ind: "",
  });

  const valuechange1 = (event) => {
    const data = event.target.value;
    if (data.length <= 5) {
      setIdata((prevState) => {
        return { ...prevState, name: data };
      });
    }
  };

  const valuechange2 = (event) => {
    const data = event.target.value;
    if (data.length <= 320) {
      setIdata((prevState) => {
        return { ...prevState, ind: data };
      });
    }
  };

  const valuechange3 = (event) => {
    const codeRegex = /^[0-9]{0,6}$/;

    const data = event.target.value;
    if (data.length <= 6 && codeRegex.test(data)) {
      setCode((prevState) => {
        return { ...prevState, inputcode: data };
      });
    }
  };

  const emailcodeHandler = async () => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (idata.name === "") {
      alert("이름을 입력해주세요.");
      return;
    }
    if (idata.ind === "") {
      alert("이메일 주소를 입력해주세요.");
      return;
    }
    if (!emailRegex.test(idata.ind)) {
      alert("이메일 주소 형식이 아닙니다.");
      return;
    }

    if (idcert && res2.email !== idata.ind) {
      alert("본인확인 이메일을 입력하세요.");
      return;
    }

    alert(
      "인증번호를 발송했습니다.\n인증번호가 오지 않으면 입력하신 정보가 회원정보와 일치하는지 확인해 주세요."
    );
    setDisable(false);

    await axios({
      url: "http://localhost:5000/auth/mail",
      method: "POST",
      data: {
        yourname: idata.name,
        youremail: idata.ind,
      },
    })
      .then((res) => {
        const { code, username, useremail, vericode } = res.data;
        if (code === 200) {
          setSdata((prevState) => {
            return { ...prevState, name: username, ind: useremail };
          });
          setCode((prevState) => {
            return { ...prevState, servercode: vericode };
          });
        }
      })
      .catch((e) => {
        console.log("이메일 인증 코드 발송 오류!", e);
      });
  };

  const IdFindHandler = async () => {
    if (idata.name === "") {
      alert("이름을 입력해주세요.");
      return;
    }
    if (idata.ind === "") {
      alert("이메일 주소를 입력해주세요.");
      return;
    }

    if (disable && code.inputcode === "") {
      alert("인증번호 받기를 눌러주세요.");
      return;
    }

    if (!disable && code.inputcode === "") {
      alert("인증번호를 입력하세요.");
      return;
    }

    if (code.inputcode != code.servercode) {
      alert("인증번호가 틀렸습니다.");
      return;
    }

    if (idcert) {
      setRes2((prevState) => {
        return { ...prevState, open: true, mod: true };
      });
    } else {
      await axios({
        url: "http://localhost:5000/auth/findid",
        method: "POST",
        data: sdata,
      })
        .then((res) => {
          const { code, id } = res.data;
          if (code === "success") {
            setRes1((prevState) => {
              return { ...prevState, open: true, id: id };
            });
          } else {
            setRes1((prevState) => {
              return { ...prevState, open: true, id: null };
            });
          }
          //입력칸 데이터 다 초기화
          setIdata((prevState) => {
            return { ...prevState, name: "", ind: "" };
          });
          setSdata((prevState) => {
            return { ...prevState, name: "", ind: "" };
          });
          setCode((prevState) => {
            return { ...prevState, inputcode: "", servercode: "" };
          });
          setDisable(true);
        })
        .catch((e) => {
          console.log("회원 찾기 오류!", e);
        });
    }
  };

  return (
    <div className="findtextbox">
      {idcert && (
        <span className="large">본인확인 이메일로 인증({res2.email})</span>
      )}
      <span>
        회원정보에 등록한 {seltype + "와"} 입력한 {seltype + "가"} 같아야
        인증번호를 받을 수 있습니다.
      </span>
      <div>
        <span>이름</span>
        <input
          type="text"
          maxLength={5}
          value={idata.name}
          onChange={valuechange1}
        />
      </div>
      <div>
        <span>{seltype}</span>
        <input type="text" value={idata.ind} onChange={valuechange2} />
        <button
          onClick={() => {
            if (type === "email") emailcodeHandler();
          }}
        >
          인증번호 받기
        </button>
      </div>
      <div>
        <span>인증 번호</span>
        <input
          type="text"
          value={code.inputcode}
          onChange={valuechange3}
          placeholder="인증번호 6자리 숫자 입력"
          disabled={disable}
        />
        <button onClick={IdFindHandler}>확인</button>
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

  const IdcheckHandler = async () => {
    if (sdata.id === "") {
      alert("아이디를 입력하세요.");
      return;
    }

    await axios({
      url: "http://localhost:5000/auth/findpw",
      method: "POST",
      data: sdata,
    })
      .then((res) => {
        const { code, id, email } = res.data;
        if (code === "success") {
          setRes2((prevState) => {
            return {
              ...prevState,
              open: true,
              code: code,
              id: id,
              email: email,
              mod: false,
              modres: false,
            };
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
          <button onClick={IdcheckHandler}>다음</button>
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
          {res1.id === null ? (
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
        <div className="pwcertcon">
          {res2.code === "error" ? (
            <span>해당 아이디의 회원이 존재하지 않습니다.</span>
          ) : (
            <div>
              {res2.mod ? (
                <PwModify></PwModify>
              ) : (
                <div className="pwcertpadding">
                  <Inputbox
                    className="pwcertpadding"
                    seltype="이메일 주소"
                    idcert={true}
                  ></Inputbox>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PwModify() {
  const { res2, setRes2 } = React.useContext(StoreContextRes2);

  const [password, setPassword] = React.useState({
    pwd: "",
    repwd: "",
  });

  const valuechange1 = (event) => {
    const data = event.target.value;
    //비밀번호 예외처리
    if (data.length <= 20) {
      setPassword((prevState) => {
        return { ...prevState, pwd: data };
      });
    }
  };

  const valuechange2 = (event) => {
    const data = event.target.value;
    //비밀번호 예외처리
    if (data.length <= 20) {
      setPassword((prevState) => {
        return { ...prevState, repwd: data };
      });
    }
  };

  const pwmodHandler = async () => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

    if (password.pwd === "" || password.repwd === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!passwordRegex.test(password.pwd)) {
      alert("비밀번호를 다시 입력해주세요.");
      return;
    }

    if (password.repwd !== password.pwd) {
      alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      return;
    }

    await axios({
      url: "http://localhost:5000/auth/pwdchange",
      method: "POST",
      data: { id: res2.id, modpwd: password.pwd },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          setRes2((prevState) => {
            return { ...prevState, open: true, modres: true };
          });
        }
      })
      .catch((e) => {
        console.log("비밀번호 변경 오류!", e);
      });
  };

  return (
    <div className="pwdmodcon">
      {res2.modres ? (
        <div>
          <span>비밀번호가 변경되었습니다.</span>
        </div>
      ) : (
        <div>
          <div>
            <span>비밀번호를 변경하세요.</span>
            <span>숫자+영문자+특수문자 조합으로 8~20자리 입력해주세요.</span>
          </div>
          <div>
            <input
              type="password"
              maxLength={20}
              placeholder="새로운 비밀번호 입력"
              value={password.pwd}
              onChange={valuechange1}
            />
          </div>
          <div>
            <input
              type="password"
              maxLength={20}
              placeholder="새로운 비밀번호 확인"
              value={password.repwd}
              onChange={valuechange2}
            />
          </div>
          <button onClick={pwmodHandler}>변경</button>
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
  const [type, setType] = React.useState(state === null ? "id" : state);
  const [res1, setRes1] = React.useState({
    open: false,
    id: "",
  });

  const [res2, setRes2] = React.useState({
    open: false,
    code: "",
    id: "",
    mod: false,
    modres: false,
  });

  React.useEffect(() => {
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
            importsession();
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
