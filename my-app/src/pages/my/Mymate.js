import React from "react";
import axios from "axios";
import "./Mymate.css";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";

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

  const [modalOpen1, setModalOpen1] = React.useState(false);
  const [modalOpen2, setModalOpen2] = React.useState(false);
  const [modalOpen3, setModalOpen3] = React.useState(false);

  //로그인 세션 상태 새로고침 하면 친구 목록 불러오기
  React.useEffect(() => {
    // console.log("loginUser 바뀜", loginUser);
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

  const openModalReq = () => {
    setModalOpen1(true);
    matereqlist();
  };
  const closeModalReq = () => {
    setModalOpen1(false);
  };

  const openModalAdd = () => {
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
      <Menubar session={State.session} />
      <div className="contents-container">
        {/* <div>나의메이트페이지입니다.</div> */}
        <div className="title">
          <span>나의 여행 메이트</span>
          <div>
            <span onClick={openModalReq}>메이트 요청</span>
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
            <Modal open={modalOpen2} close={closeModalAdd} header="메이트 검색">
              메이트추가 모달
            </Modal>
            <span onClick={openModalSetting}>메이트 관리</span>
            <Modal
              open={modalOpen3}
              close={closeModalSetting}
              header="메이트 관리"
            >
              메이트관리 모달
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
