import React from "react";
import axios from "axios";
import "./Mytrip.css";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";

import { StoreContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

function Mytrip() {
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
    if (loginUser.mem_userid !== undefined) {
      setState({ session: "마이페이지" });
    }
  }, [loginUser, matereqres]);

  const openModalReq = () => {
    setModalOpen1(true);
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
      <Menubar />
      <div className="contents-container">
        <div className="title">
          <span>나의 여행 계획</span>
          <div>
            <span onClick={openModalReq}>여행 만들기</span>
            <Modal open={modalOpen1} close={closeModalReq} header="여행 만들기">
              여행 만들기 모달
            </Modal>
            <span onClick={openModalAdd}>여행 관리</span>
            <Modal open={modalOpen2} close={closeModalAdd} header="여행 관리">
              여행 관리 모달
            </Modal>
          </div>
        </div>
        <div className="content">
          <ul>
            {matedata.length === 0 ? (
              <span>아직 작성된 여행이 없습니다! 여행 계획을 세워보세요!</span>
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

export default Mytrip;
