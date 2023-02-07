import React from "react";
import axios from "axios";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";
import "./Mymate.css";
import "./MymateModal.css";
// import bimg from "../../img/pexels-trace-hudson-2770933.jpg";

import { StoreContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

function MateReq() {
  const { loginUser } = React.useContext(StoreContext);
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { setReqcnt } = React.useContext(StoreContextCnt);
  const [matereqdata, setMatereqdata] = React.useState([]);

  React.useEffect(() => {
    matereqlist();
  }, []);

  const matereqlist = async () => {
    await axios({
      url: "http://localhost:5000/matereqlist",
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          const tmp = [...data];
          setMatereqdata(tmp);
          setReqcnt(tmp.length);
        }
      })
      .catch((e) => {
        console.log("메이트 목록 업데이트 오류!", e);
      });
  };

  const mateaccept = async (idx) => {
    await axios({
      url: "http://localhost:5000/mateaccept",
      method: "POST",
      data: {
        idx: loginUser.mem_idx,
        mateidx: idx,
      },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          matereqlist();
          setDispatchType({ code: "matelist" });
        }
      })
      .catch((e) => {
        console.log("메이트 수락 오류!", e);
      });
  };

  const matedecline = async (idx) => {
    await axios({
      url: "http://localhost:5000/matedecline",
      method: "POST",
      data: {
        idx: loginUser.mem_idx,
        mateidx: idx,
      },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          matereqlist();
          setDispatchType({ code: "matelist" });
        }
      })
      .catch((e) => {
        console.log("메이트 거절 오류!", e);
      });
  };

  return (
    <ul className="matereq">
      {matereqdata.length === 0 ? (
        <span>메이트 요청이 없습니다.</span>
      ) : (
        matereqdata.map((data, index) => (
          <li key={index} className="item">
            <span className="nickname">{data.mem_nickname}</span>
            <span className="id">(@{data.mem_userid})</span>
            <div>
              <button
                className="acceptbtn"
                onClick={() => {
                  mateaccept(data.mem_idx);
                }}
              >
                수락
              </button>
              <button
                className="declinebtn"
                onClick={() => {
                  matedecline(data.mem_idx);
                }}
              >
                거절
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
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
    setSearchdata(data);
    setSearchmsg({ code: "", msg: "" });
  };

  const findid = () => {
    // console.log(searchdata);
    //아이디 예외처리
    if (searchdata.length < 4 || searchdata.length > 12) {
      setSearchmsg({
        code: "error",
        msg: "소문자+영어 조합 4~12자리로 입력해주세요.",
      });
    } else {
      findidreq(searchdata);
    }
  };

  const findidreq = async (id) => {
    await axios({
      url: "http://localhost:5000/findidreq",
      method: "POST",
      data: {
        idx: loginUser.mem_idx,
        mateid: id,
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

  const matereq = async () => {
    await axios({
      url: "http://localhost:5000/matereq",
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
        <input type="text" placeholder="아이디 입력" onChange={valuechange} />
        <button onClick={findid}>조회</button>
      </div>
      {searchmsg.code === "success" ? (
        <div className="result">
          <span id="id">{searchreq.id}</span>
          <span id="nickname">({searchreq.nickname})</span>
          {searchmsg.msg === "mate" && null}
          {searchmsg.msg === "requested" && <button>요청됨</button>}
          {searchmsg.msg === "true" && (
            <button className="req" onClick={matereq}>
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
  const { matedata } = React.useContext(StoreContextMate);

  const matedelete = async (idx) => {
    await axios({
      url: "http://localhost:5000/matedelete",
      method: "POST",
      data: {
        idx: loginUser.mem_idx,
        mateidx: idx,
      },
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          setDispatchType({ code: "matelist" });
        }
      })
      .catch((e) => {
        console.log("메이트 삭제 오류!", e);
      });
  };

  return (
    <ul className="matereq">
      {matedata.length === 0 ? (
        <span>메이트가 없습니다.</span>
      ) : (
        matedata.map((data, index) => (
          <li key={index} className="item">
            <span className="nickname">{data.mem_nickname}</span>
            <span className="id">(@{data.mem_userid})</span>
            <div>
              <button
                className="declinebtn"
                onClick={() => {
                  matedelete(data.mem_idx2);
                }}
              >
                삭제
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}
function Modalcontainer() {
  const { reqcnt } = React.useContext(StoreContextCnt);

  const [modalOpen1, setModalOpen1] = React.useState(false);
  const [modalOpen2, setModalOpen2] = React.useState(false);
  const [modalOpen3, setModalOpen3] = React.useState(false);

  return (
    <div>
      <span
        onClick={() => {
          setModalOpen1(true);
        }}
      >
        {/* 메이트 요청 */}
        메이트 요청({reqcnt})
      </span>
      <Modal
        open={modalOpen1}
        close={() => {
          setModalOpen1(false);
        }}
        header="메이트 요청"
      >
        <MateReq></MateReq>
      </Modal>
      <span
        onClick={() => {
          setModalOpen2(true);
        }}
      >
        메이트 추가
      </span>
      <Modal
        open={modalOpen2}
        close={() => {
          setModalOpen2(false);
        }}
        header="메이트 추가"
      >
        <MateAddModal></MateAddModal>
      </Modal>
      <span
        onClick={() => {
          setModalOpen3(true);
        }}
      >
        메이트 관리
      </span>
      <Modal
        open={modalOpen3}
        close={() => {
          setModalOpen3(false);
        }}
        header="메이트 관리"
      >
        <MateDelModal></MateDelModal>
      </Modal>
    </div>
  );
}
function Contents() {
  const { matedata } = React.useContext(StoreContextMate);

  return (
    <div className="content-mymate">
      <ul>
        {matedata.length === 0 ? (
          <span>아직 메이트가 없습니다! 메이트를 추가해보세요!</span>
        ) : (
          matedata.map((data, index) => (
            <li key={index} className="item">
              <div className="img">
                <FontAwesomeIcon icon={faCircleUser} className="imgicon" />
              </div>
              <div className="info">
                <span className="nickname">{data.mem_nickname}</span>
                <span className="id">{data.mem_userid}</span>
              </div>
            </li>
          ))
        )}
        <li className="item">
          <div className="img">
            <FontAwesomeIcon icon={faCircleUser} className="imgicon" />
          </div>
          <div className="info">
            <span className="nickname">어쩌고</span>
            <span className="id">저쩌고</span>
          </div>
        </li>
      </ul>
    </div>
  );
}
const StoreContextDis = React.createContext({});
const StoreContextMate = React.createContext({});
const StoreContextCnt = React.createContext({});

function Mymate() {
  const navigation = useNavigate();

  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);

  const [State, setState] = React.useState({
    session: "로그인",
  });

  const [dispatch, setDispatchType] = React.useState({
    code: null,
    params: null,
  });

  const [matedata, setMatedata] = React.useState([]);
  const [reqcnt, setReqcnt] = React.useState(0);

  //로그인 세션 상태 새로고침 하면 친구 목록 불러오기
  React.useEffect(() => {
    if (loginUser) {
      setState({ session: "마이페이지" });
      matereqlistcnt();
      matelist();
    }
  }, [loginUser]);

  React.useEffect(() => {
    if (dispatch.code === "matelist") {
      matelist();
    }
  }, [dispatch]);

  const matereqlistcnt = async () => {
    await axios({
      url: "http://localhost:5000/matereqlistcnt",
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          setReqcnt(data.cnt);
        }
      })
      .catch((e) => {
        console.log("메이트 목록 업데이트 오류!", e);
      });
  };

  const matelist = async () => {
    // console.log({ idx: loginUser.mem_idx, id: loginUser.mem_userid });
    await axios({
      url: "http://localhost:5000/matelist",
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          const tmp = [...data];
          setMatedata(tmp);
        }
      })
      .catch((e) => {
        console.log("메이트 목록 업데이트 오류!", e);
      });
  };

  return (
    <StoreContextDis.Provider value={{ setDispatchType }}>
      <StoreContextMate.Provider value={{ matedata }}>
        <div className="container">
          <Menubar />
          <div className="contents-container">
            <div className="title">
              {/* <img src={bimg} alt="" /> */}
              <span>나의 여행 메이트</span>
              <StoreContextCnt.Provider value={{ reqcnt, setReqcnt }}>
                <Modalcontainer></Modalcontainer>
              </StoreContextCnt.Provider>
            </div>
            <Contents></Contents>
          </div>
        </div>
      </StoreContextMate.Provider>
    </StoreContextDis.Provider>
  );
}

export default Mymate;
