import React, { useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import "./Plan.css";
import logoimg from "../../img/logo_oco.png";

import { StoreContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function Htitle() {
  const navigation = useNavigate();

  const { tripdata } = React.useContext(StoreContextTrip);
  const { setDispatchType } = React.useContext(StoreContextDis);

  const [title, setTitle] = React.useState({
    value: "",
    state: false,
  });

  React.useEffect(() => {
    if (tripdata) {
      setTitle((prevState) => {
        return {
          ...prevState,
          value: tripdata.title,
        };
      });
    }
  }, [tripdata]);

  const titlemodHandler = async () => {
    if (tripdata.title === title.value) {
      titlemodcloseHandler();
      return;
    }

    await axios({
      url: "http://localhost:5000/triptitlechange",
      method: "POST",
      data: { seq: tripdata.seq, title: title.value },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType((prevState) => {
            return {
              ...prevState,
              code: "triprefresh",
            };
          });
        }

        titlemodcloseHandler();
      })
      .catch((e) => {
        console.log("타이틀 업데이트 오류!", e);
      });
  };

  const titlemodcloseHandler = () => {
    setTitle((prevState) => {
      return {
        ...prevState,
        state: false,
      };
    });
  };

  const titlemodopenHandler = () => {
    setTitle((prevState) => {
      return {
        ...prevState,
        state: true,
      };
    });
  };

  const valuechange = (event) => {
    const data = event.target.value;
    if (data.length <= 20) {
      setTitle((prevState) => {
        return { ...prevState, value: data };
      });
    }
  };

  return (
    <div className="headercon flex">
      <div className="widthfix flex flexcolmun">
        <FontAwesomeIcon
          icon={faHouse}
          className="imgicon point"
          onClick={() => navigation("/", { replace: true })}
        />
        <span>홈</span>
      </div>
      <div className="widthfix flex flexcolmun">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="imgicon point"
          onClick={() => navigation("/mytrip", { replace: true })}
        />
        <span>뒤로가기</span>
      </div>
      <div className="title flex">
        {title.state ? (
          <input
            type="text"
            name="id"
            maxLength={20}
            value={title.value}
            onChange={valuechange}
          ></input>
        ) : (
          <span>{tripdata.title}</span>
        )}
        <div className="flex center">
          {title.state ? (
            <div>
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="imgicon small gray point"
                onClick={titlemodHandler}
              />
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="imgicon small gray point"
                onClick={titlemodcloseHandler}
              />
            </div>
          ) : (
            <FontAwesomeIcon
              icon={faPen}
              className="imgicon small gray point"
              onClick={titlemodopenHandler}
            />
          )}
        </div>
      </div>
    </div>
  );
}
function Matebar() {
  const { tripdata, setTripdata } = React.useContext(StoreContextTrip);
  const [participants, setParticipants] = React.useState([]);

  React.useEffect(() => {
    if (tripdata.mate_idx) {
      // console.log(Object.entries(JSON.parse(tripdata.mate_idx)));
      setParticipants(Object.entries(JSON.parse(tripdata.mate_idx)));
    }
  }, [tripdata]);

  return (
    <div className="listcon">
      {/* 친구목록입니다. */}
      <span>
        메이트
        <FontAwesomeIcon icon={faPlus} className="imgicon small gray point" />
      </span>
      <ul>
        {participants.map((data, index) => (
          <li key={index} className="item">
            {data[0] == tripdata.host_idx && (
              <FontAwesomeIcon icon={faStar} className="imgicon small gray" />
            )}
            {data[1]}
          </li>
        ))}
      </ul>
    </div>
  );
}
function Timelinebar() {
  return (
    <div className="listcon">
      <span>
        타임 라인
        <FontAwesomeIcon icon={faPlus} className="imgicon small gray point" />
      </span>
      <ul>
        <li className="item">타임라인1</li>
        <li className="item">타임라인2</li>
        <li className="item">타임라인3</li>
      </ul>
    </div>
  );
}

function Content() {
  const { tripdata, setTripdata } = React.useContext(StoreContextTrip);
  const { loginUser } = React.useContext(StoreContext);
  return (
    <div className="timelinecon">
      타임라인지도표시될예정
      <div>
        {tripdata.host_idx === loginUser.mem_idx && (
          <span>로그인한사람이 방장</span>
        )}
      </div>
    </div>
  );
}

const StoreContextTrip = React.createContext({});
const StoreContextDis = React.createContext({});

function Plan() {
  // const navigation = useNavigate();

  let { seq } = useParams();

  const { loginUser } = React.useContext(StoreContext);

  const [dispatch, setDispatchType] = React.useState({
    code: null,
    params: null,
  });

  /**
   * 전역 변수
   * 1. 여행 게시글 데이터 tripdata
   * 2. 여행 게시글에 속한 타임라인 데이터 timeline
   */
  const [tripdata, setTripdata] = React.useState({});
  const [timeline, setTimeline] = React.useState([]);

  //로그인 세션 상태 새로고침 하면 실행
  React.useEffect(() => {
    if (loginUser) {
      triplist();
    }
  }, [loginUser]);

  React.useEffect(() => {
    if (dispatch.code === "triprefresh") {
      triplist();
    }
  }, [dispatch]);

  //여행 목록 데이터 받아오기
  const triplist = async () => {
    await axios({
      url: "http://localhost:5000/tripview",
      method: "POST",
      data: { seq: seq },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          console.log(seq, "번 데이터", data);
          // const tmp = [...data];
          setTripdata({ ...data });
        }
      })
      .catch((e) => {
        console.log("여행 목록 업데이트 오류!", e);
      });
  };

  return (
    <StoreContextDis.Provider value={{ setDispatchType }}>
      <StoreContextTrip.Provider value={{ tripdata }}>
        <div className="plancontainer">
          {/* {seq}번째 모임생성페이지입니다. */}
          <Htitle></Htitle>
          <div className="flex">
            <Matebar></Matebar>
            <Timelinebar></Timelinebar>
            <Content></Content>
          </div>
        </div>
      </StoreContextTrip.Provider>
    </StoreContextDis.Provider>
  );
}

export default Plan;
