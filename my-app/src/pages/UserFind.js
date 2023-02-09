import React from "react";
import axios from "axios";
import classnames from "classnames";
import "./UserFind.css";
import logoimg from "../img/logo_oco.png";

import { importsession } from "../App";
import { useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { faSistrix } from "@fortawesome/free-brands-svg-icons";

function Inputbox(props) {
  const { seltype } = props;
  const type = seltype === "이메일 주소" ? "email" : "phone";

  const [sdata, setSdata] = React.useState({
    type: type,
    name: "",
    ind: "",
  });

  const valuechange1 = (event) => {
    // const data = event.target.value;
    setSdata((prevState) => {
      return { ...prevState, name: event.target.value };
    });
  };

  const valuechange2 = (event) => {
    // const data = event.target.value;
    setSdata((prevState) => {
      return { ...prevState, ind: event.target.value };
    });
  };

  const findreq = async () => {
    await axios({
      url: "http://localhost:5000/findid",
      method: "POST",
      data: sdata,
    })
      .then((res) => {
        const { code, message, id } = res.data;
        if (code === "success") {
          console.log(id + " " + message);
        } else {
          console.log(message);
        }
      })
      .catch((e) => {
        console.log("회원 찾기 오류!", e);
      });
  };

  return (
    <div>
      <span>
        회원정보에 등록한 {seltype + "와"} 입력한 {seltype + "가"} 같아야
        아이디를 찾을 수 있습니다.
      </span>
      <div>
        <span>이름</span>
        <input type="text" onChange={valuechange1} />
      </div>
      <div>
        <span>{seltype}</span>
        <input type="text" onChange={valuechange2} />
      </div>
      <button onClick={findreq}>찾기</button>
    </div>
  );
}

function Inputbox2() {
  const [sdata, setSdata] = React.useState({
    id: "",
  });

  const valuechange = (event) => {
    // const data = event.target.value;
    setSdata((prevState) => {
      return { ...prevState, id: event.target.value };
    });
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
          console.log(message);
          //비밀번호 변경
        } else {
          console.log(message);
        }
      })
      .catch((e) => {
        console.log("아이디 찾기 오류!", e);
      });
  };

  return (
    <div>
      <div>
        <span>비밀번호를 찾고자하는 아이디를 입력해주세요.</span>
        <span>아이디</span>
        <input type="text" onChange={valuechange} />
      </div>
      <button onClick={findreq}>다음</button>
    </div>
  );
}

function Choicebox() {
  const [findtype, setFindtype] = React.useState(true);

  return (
    <div>
      <div>
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
      <div>
        <input
          type="radio"
          value="phone"
          checked={!findtype}
          onChange={() => {
            setFindtype(false);
          }}
        />
        <label>회원정보에 등록한 휴대전화로 찾기</label>
        {!findtype && <Inputbox seltype="휴대전화 번호"></Inputbox>}
      </div>
    </div>
  );
}
function Result() {
  const [res, setRes] = React.useState(false);

  return <div>{res && <div className="result">아이디 찾기 결과요</div>}</div>;
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
      <Inputbox2></Inputbox2>
    </div>
  );
}

function UserFind() {
  const navigation = useNavigate();
  const { state } = useLocation();
  const [type, setType] = React.useState(state);

  React.useEffect(() => {
    // console.log(state);
  }, []);

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
        <div className="content-box">
          {type === "id" ? <IdFind></IdFind> : <PwFind></PwFind>}
        </div>
      </div>
    </div>
  );
}

export default UserFind;
