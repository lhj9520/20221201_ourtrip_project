import React from "react";
import axios from "axios";
import classnames from "classnames";
import "./UserFind.css";
import logoimg from "../../img/logo_oco.png";

import { 세션정보가져오기 } from "../../App";
import { useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { faSistrix } from "@fortawesome/free-brands-svg-icons";

function UserPwUpdate() {
  const navigation = useNavigate();
  const { state } = useLocation();
  console.log("비밀번호변경 아이디 : ", state);

  React.useEffect(() => {
    if (state === null) {
      navigation("/");
    }
  }, []);

  return (
    <div>비밀번호 변경 페이지</div>
    /**
     *             <div>
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
     */
    // <div className="userfind-container">
    //   <div className="type-header">
    //     <img
    //       src={logoimg}
    //       alt="logo이미지"
    //       className="item"
    //       onClick={() => {
    //         세션정보가져오기();
    //         navigation("/");
    //       }}
    //     />
    //     <div
    //       className={type === "id" ? "selected" : ""}
    //       onClick={() => {
    //         setType("id");
    //       }}
    //     >
    //       <FontAwesomeIcon icon={faSistrix} className="imgicon" />
    //       <span>아이디 찾기</span>
    //     </div>
    //     <div
    //       className={type === "pw" ? "selected" : ""}
    //       onClick={() => {
    //         setType("pw");
    //       }}
    //     >
    //       <FontAwesomeIcon icon={faUnlockKeyhole} className="imgicon" />
    //       <span>비밀번호 찾기</span>
    //     </div>
    //   </div>
    //   <div className="content-container">
    //     <StoreContextRes1.Provider value={{ res1, setRes1 }}>
    //       <StoreContextRes2.Provider value={{ res2, setRes2 }}>
    //         <div className="content-box">
    //           {type === "id" ? <IdFind></IdFind> : <PwFind></PwFind>}
    //         </div>
    //       </StoreContextRes2.Provider>
    //     </StoreContextRes1.Provider>
    //   </div>
    // </div>
  );
}

export default UserPwUpdate;
