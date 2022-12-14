import React from "react";
import axios from "axios";
import "./Mymate.css";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";
// import bimg from "../../img/pexels-trace-hudson-2770933.jpg";

import { StoreContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

function Mymate() {
  const navigation = useNavigate();

  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);

  const [State, setState] = React.useState({
    session: "로그인",
  });

  const [matedata, setMatedata] = React.useState([]);
  const [matereqdata, setMatereqdata] = React.useState([]);
  const [matereqres, setMatereqres] = React.useState("");
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

  const [modalOpen1, setModalOpen1] = React.useState(false);
  const [modalOpen2, setModalOpen2] = React.useState(false);
  const [modalOpen3, setModalOpen3] = React.useState(false);

  //로그인 세션 상태 새로고침 하면 친구 목록 불러오기
  React.useEffect(() => {
    if (loginUser.mem_userid !== undefined) {
      setState({ session: "마이페이지" });
      matelist();
      matereqlist();
    }
  }, [loginUser, matereqres]);

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
          setMatereqres(message);
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
          setMatereqres(message);
        }
      })
      .catch((e) => {
        console.log("메이트 거절 오류!", e);
      });
  };

  const valuechange = (event) => {
    const data = event.target.value;
    // console.log(data);
    setSearchdata(data);
    setSearchmsg({ code: "", msg: "" });
  };

  const findid = () => {
    console.log(searchdata);
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
          console.log(message);
          setMatereqres(message);
        }
      })
      .catch((e) => {
        console.log("메이트 수락 오류!", e);
      });
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
        console.log("메이트 신청 오류!", e);
      });
  };

  const openModalReq = () => {
    setModalOpen1(true);
    matereqlist();
  };
  const closeModalReq = () => {
    setModalOpen1(false);
  };

  const openModalAdd = () => {
    setSearchmsg({ code: "", msg: "" });
    setModalOpen2(true);
  };
  const closeModalAdd = () => {
    setModalOpen2(false);
  };

  const openModalSetting = () => {
    setModalOpen3(true);
  };
  const closeModalSetting = () => {
    setModalOpen3(false);
  };

  return (
    <div className="container">
      <Menubar />
      <div className="contents-container">
        <div className="title">
          {/* <img src={bimg} alt="" /> */}
          <span>나의 여행 메이트</span>
          <div>
            <span onClick={openModalReq}>
              메이트 요청({matereqdata.length})
            </span>
            <Modal open={modalOpen1} close={closeModalReq} header="메이트 요청">
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
            </Modal>
            <span onClick={openModalAdd}>메이트 추가</span>
            <Modal open={modalOpen2} close={closeModalAdd} header="메이트 추가">
              <div className="mateadd">
                <div className="findcontainer">
                  <input
                    type="text"
                    placeholder="아이디 입력"
                    onChange={valuechange}
                  />
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
            </Modal>
            <span onClick={openModalSetting}>메이트 관리</span>
            <Modal
              open={modalOpen3}
              close={closeModalSetting}
              header="메이트 관리"
            >
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
            </Modal>
          </div>
        </div>
        <div className="content">
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
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Mymate;
