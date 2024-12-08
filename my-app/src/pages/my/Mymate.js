import React, { useContext, useState, useEffect, createContext } from "react";
// import component
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";
import Loading from "../../component/Loading";
// import src
import greenpostit from "../../img/greenpostit.png";
import userprofile from "../../img/userprofile.png";
import { SessionContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretUp } from "@fortawesome/free-regular-svg-icons";
// import css
import "./Mymate.css";
import "./MymateModal.css";
// import api
import { getUserInfo } from "../../api/My";
import {
  getMyMateList,
  getMateID,
  getMateRequest,
  getMateAccept,
  getMateDecline,
  getMateDelete,
} from "../../api/Mymate";

function MateReq() {
  const { loginUser, setLoginUser } = useContext(userInfoContext);
  const { mymate, fetchMateList } = useContext(MateContext);

  const MateAcceptHanlder = async (idx) => {
    const { code, message } = await getMateAccept(loginUser.mem_idx, idx);
    if (code === "success") fetchMateList();
  };

  const MateDeclineHandler = async (idx) => {
    const { code, message } = await getMateDecline(loginUser.mem_idx, idx);
    if (code === "success") fetchMateList();
  };

  return (
    <>
      {mymate.req.length === 0 ? (
        <span>메이트 요청이 없습니다.</span>
      ) : (
        <ul className="matereq">
          {mymate.req.map((data, index) => (
            <li key={index} className="item">
              <span className="nickname">{data.mem_nickname}</span>
              <span className="id">(@{data.mem_userid})</span>
              <div>
                <button className="acceptbtn" onClick={() => MateAcceptHanlder(data.mem_idx)}>
                  수락
                </button>
                <button className="declinebtn" onClick={() => MateDeclineHandler(data.mem_idx)}>
                  거절
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
function MateAddModal() {
  const { loginUser, setLoginUser } = useContext(userInfoContext);

  const [searchdata, setSearchdata] = useState("");
  const [searchmsg, setSearchmsg] = useState({
    code: "",
    msg: "",
  });

  const [searchreq, setSearchreq] = useState({
    idx: "",
    id: "",
    nickname: "",
  });

  const valuechange = (event) => {
    const data = event.target.value;
    if (data.length <= 12) {
      setSearchdata(data);
    }
  };

  const MateFindHandler = async (event) => {
    event.preventDefault();

    const { code, message, data } = await getMateID(loginUser.mem_idx, searchdata);
    setSearchmsg({ code: code, msg: message });
    if (code === "success") setSearchreq(data);
  };

  const MateReqHandler = async () => {
    const { code, message } = await getMateRequest(loginUser.mem_idx, searchreq.idx);
    setSearchmsg({ code: code, msg: message });
  };

  return (
    <div className="mateadd">
      <form className="findcontainer" onSubmit={MateFindHandler}>
        <input type="text" maxLength={12} value={searchdata} placeholder="아이디 입력" onChange={valuechange} />
        <button onClick={MateFindHandler} type="submit">
          조회
        </button>
      </form>
      {searchmsg.code === "success" ? (
        <div className="result">
          <span id="id">{searchreq.id}</span>
          <span id="nickname">({searchreq.nickname})</span>
          {searchmsg.msg === "mate" && <></>}
          {searchmsg.msg === "requested" && <button>요청됨</button>}
          {searchmsg.msg === "true" && (
            <button className="req" onClick={MateReqHandler} type="button">
              요청
            </button>
          )}
        </div>
      ) : (
        <span>{searchmsg.msg}</span>
      )}
    </div>
  );
}
function MateDelModal() {
  const { loginUser, setLoginUser } = useContext(userInfoContext);
  const { mymate, fetchMateList } = useContext(MateContext);

  const MateDeleteHandler = async (idx) => {
    const { code, message } = await getMateDelete(loginUser.mem_idx, idx);
    if (code === "success") fetchMateList();
  };

  return (
    <>
      {mymate.mate.length === 0 ? (
        <span>메이트가 없습니다.</span>
      ) : (
        <ul className="matereq">
          {mymate.mate.map((data, index) => (
            <li key={index} className="item">
              <span className="nickname">{data.mem_nickname}</span>
              <span className="id">(@{data.mem_userid})</span>
              <div>
                <button className="declinebtn" onClick={() => MateDeleteHandler(data.idx)}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
function Modalcontainer() {
  const { mymate, setDispatchType } = useContext(MateContext);
  const [modalList, setModalList] = useState([false, false, false]);

  const modalHandler = (idx) => {
    let newArr = [false, false, false];
    newArr[idx] = !modalList[idx];
    setModalList(newArr);
  };

  return (
    <div>
      <span onClick={() => modalHandler(0)}>메이트 요청({mymate.req.length})</span>
      <Modal open={modalList[0]} close={() => modalHandler(0)} header="메이트 요청">
        <MateReq />
      </Modal>
      <span onClick={() => modalHandler(1)}>메이트 추가</span>
      <Modal open={modalList[1]} close={() => modalHandler(1)} header="메이트 추가">
        <MateAddModal />
      </Modal>
      <span onClick={() => modalHandler(2)}>메이트 관리</span>
      <Modal open={modalList[2]} close={() => modalHandler(2)} header="메이트 관리">
        <MateDelModal />
      </Modal>
    </div>
  );
}
function Contents() {
  const { mymate, setDispatchType } = useContext(MateContext);

  return (
    <div className="content-mymate">
      {mymate.mate.length === 0 ? (
        <span>아직 메이트가 없습니다! 메이트를 추가해보세요!</span>
      ) : (
        <ul>
          {mymate.mate.map((data, index) => (
            <li key={index} className="item">
              <img src={greenpostit} alt="matelist" className="postit" />
              <div className="userinfo">
                <div className="imgbox">
                  <img src={userprofile} alt="userprofile" className="userprofile" />
                </div>
                <div className="infobox">
                  <span className="nickname">{data.mem_nickname}</span>
                  <span className="id">{data.mem_userid}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
const MateContext = createContext(null);
const userInfoContext = createContext(null);

function Mymate() {
  //App에서 SessionContext 받아온 후 로그인세션 사용
  const { loginSession, setLoginSession } = useContext(SessionContext);

  const [loading, setLoading] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  const [mymate, setMymate] = useState({
    mate: null,
    req: null,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoginUser(await getUserInfo());
    };

    if (loginSession) fetchUserInfo();
  }, [loginSession]);

  useEffect(() => {
    if (loginUser) fetchMateList();
  }, [loginUser]);

  const fetchMateList = async () => {
    setLoading(true);

    const { code, mate, req } = await getMyMateList(loginUser.mem_idx);

    if (code === "success") {
      setMymate((prevState) => {
        return {
          ...prevState,
          mate: mate,
          req: req,
        };
      });
    }

    setLoading(false);
  };

  const ScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {loading ? <Loading /> : null}
      {loginSession && loginUser && (
        <>
          <Menubar />
          <userInfoContext.Provider value={{ loginUser, setLoginUser }}>
            <MateContext.Provider value={{ mymate, fetchMateList }}>
              {mymate.mate && mymate.req && (
                <div className="contents-container mymatecon">
                  <div className="title mymate">
                    <span>나의 여행 메이트</span>
                    <Modalcontainer />
                  </div>
                  <Contents />
                  <FontAwesomeIcon icon={faSquareCaretUp} className="imgicon topbtn" onClick={ScrollTop} />
                </div>
              )}
            </MateContext.Provider>
          </userInfoContext.Provider>
        </>
      )}
    </>
  );
}

export default Mymate;
