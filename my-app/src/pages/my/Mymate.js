import React from "react";
import axios from "axios";
import "./Mymate.css";
import "./MymateModal.css";
import useDidMountEffect from "../useDidMountEffect";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";
import Loading from "../../component/Loading";
import greenpostit from "../../img/greenpostit.png";
import userprofile from "../../img/userprofile.png";
import { StoreContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretUp } from "@fortawesome/free-regular-svg-icons";

function MateReq() {
  const { loginUser } = React.useContext(StoreContext);
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { mymate } = React.useContext(StoreContextM);

  const MateAcceptHanlder = async (idx) => {
    await axios({
      url: "http://localhost:5000/mymate/accept",
      method: "POST",
      data: {
        idx: loginUser.mem_idx,
        mateidx: idx,
      },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          setDispatchType({ code: "refresh" });
        }
      })
      .catch((e) => {
        console.log("메이트 수락 오류!", e);
      });
  };

  const MateDeclineHandler = async (idx) => {
    await axios({
      url: "http://localhost:5000/mymate/decline",
      method: "POST",
      data: {
        idx: loginUser.mem_idx,
        mateidx: idx,
      },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          setDispatchType({ code: "refresh" });
        }
      })
      .catch((e) => {
        console.log("메이트 거절 오류!", e);
      });
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
                <button
                  className="acceptbtn"
                  onClick={() => MateAcceptHanlder(data.mem_idx)}
                >
                  수락
                </button>
                <button
                  className="declinebtn"
                  onClick={() => MateDeclineHandler(data.mem_idx)}
                >
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
  const { loginUser } = React.useContext(StoreContext);

  const [searchdata, setSearchdata] = React.useState("");
  const [searchmsg, setSearchmsg] = React.useState({
    code: "",
    msg: "",
  });

  const [searchreq, setSearchreq] = React.useState({
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

  const MateFindHandler = async () => {
    await axios({
      url: "http://localhost:5000/mymate/idfind",
      method: "POST",
      data: {
        idx: loginUser.mem_idx,
        mateid: searchdata,
      },
    })
      .then((res) => {
        const { code, message, data } = res.data;
        const tmp = { code: code, msg: message };
        setSearchmsg(tmp);
        if (code === "success") {
          setSearchreq(data);
        }
      })
      .catch((e) => {
        console.log("메이트 조회 오류!", e);
      });
  };

  const MateReqHandler = async () => {
    await axios({
      url: "http://localhost:5000/mymate/req",
      method: "POST",
      data: {
        idx: loginUser.mem_idx,
        mateidx: searchreq.idx,
      },
    })
      .then((res) => {
        const { code, message } = res.data;
        const tmp = { code: code, msg: message };
        setSearchmsg(tmp);
      })
      .catch((e) => {
        console.log("메이트 신청 오류!", e);
      });
  };

  return (
    <div className="mateadd">
      <div className="findcontainer">
        <input
          type="text"
          maxLength={12}
          value={searchdata}
          placeholder="아이디 입력"
          onChange={valuechange}
        />
        <button onClick={MateFindHandler}>조회</button>
      </div>
      {searchmsg.code === "success" ? (
        <div className="result">
          <span id="id">{searchreq.id}</span>
          <span id="nickname">({searchreq.nickname})</span>
          {searchmsg.msg === "mate" && <></>}
          {searchmsg.msg === "requested" && <button>요청됨</button>}
          {searchmsg.msg === "true" && (
            <button className="req" onClick={MateReqHandler}>
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
  const { loginUser } = React.useContext(StoreContext);
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { mymate } = React.useContext(StoreContextM);

  const MateDeleteHandler = async (idx) => {
    console.log(idx, "회원 삭제");
    await axios({
      url: "http://localhost:5000/mymate/delete",
      method: "POST",
      data: {
        idx: loginUser.mem_idx,
        mateidx: idx,
      },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          setDispatchType({ code: "refresh" });
        }
      })
      .catch((e) => {
        console.log("메이트 삭제 오류!", e);
      });
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
                <button
                  className="declinebtn"
                  onClick={() => MateDeleteHandler(data.idx)}
                >
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
  const { mymate } = React.useContext(StoreContextM);

  const [modalOpen1, setModalOpen1] = React.useState(false);
  const [modalOpen2, setModalOpen2] = React.useState(false);
  const [modalOpen3, setModalOpen3] = React.useState(false);

  return (
    <div>
      <span onClick={() => setModalOpen1(true)}>
        메이트 요청({mymate.req.length})
      </span>
      <Modal
        open={modalOpen1}
        close={() => setModalOpen1(false)}
        header="메이트 요청"
      >
        <MateReq />
      </Modal>
      <span onClick={() => setModalOpen2(true)}>메이트 추가</span>
      <Modal
        open={modalOpen2}
        close={() => setModalOpen2(false)}
        header="메이트 추가"
      >
        <MateAddModal />
      </Modal>
      <span onClick={() => setModalOpen3(true)}>메이트 관리</span>
      <Modal
        open={modalOpen3}
        close={() => setModalOpen3(false)}
        header="메이트 관리"
      >
        <MateDelModal />
      </Modal>
    </div>
  );
}
function Contents() {
  const { mymate } = React.useContext(StoreContextM);

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
                  <img
                    src={userprofile}
                    alt="userprofile"
                    className="userprofile"
                  />
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
const StoreContextDis = React.createContext({});
const StoreContextM = React.createContext({});

function Mymate() {
  const navigation = useNavigate();

  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);

  const [dispatch, setDispatchType] = React.useState({
    code: null,
    params: null,
  });

  const [mymate, setMymate] = React.useState({
    mate: null,
    req: null,
  });

  const [loading, setLoading] = React.useState(null);

  React.useEffect(() => {
    if (loginUser.session === "none") {
      navigation("/login", { replace: true });
    } else if (Object.keys(loginUser).length > 1) {
      MyMateListHandler();
    }
  }, [loginUser]);

  useDidMountEffect(() => {
    if (dispatch.code === "refresh") {
      MyMateListHandler();
    }
  }, [dispatch]);

  const MyMateListHandler = async () => {
    setLoading(true);
    await axios({
      url: "http://localhost:5000/mymate/reqlist",
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, mate, req } = res.data;
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
      })
      .catch((e) => {
        console.log("메이트 목록 업데이트 오류!", e);
      });
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
      {Object.keys(loginUser).length > 1 && (
        <StoreContextDis.Provider value={{ setDispatchType }}>
          <StoreContextM.Provider value={{ mymate }}>
            <Menubar />
            {mymate.mate && mymate.req && (
              <div className="contents-container mymatecon">
                <div className="title mymate">
                  <span>나의 여행 메이트</span>
                  <Modalcontainer />
                </div>
                <Contents />
                <FontAwesomeIcon
                  icon={faSquareCaretUp}
                  className="imgicon topbtn"
                  onClick={ScrollTop}
                />
              </div>
            )}
          </StoreContextM.Provider>
        </StoreContextDis.Provider>
      )}
    </>
  );
}

export default Mymate;
