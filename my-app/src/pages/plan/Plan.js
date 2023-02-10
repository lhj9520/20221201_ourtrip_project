import React from "react";
import axios from "axios";
import moment from "moment-timezone";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import "./Plan.css";
import logoimg from "../../img/logo_oco.png";
import useDidMountEffect from "../useDidMountEffect.js";

import { StoreContext, StoreContextM } from "../../App";
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
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const { kakao } = window;

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
      <span>메이트</span>
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

function ReactCalender() {
  const { setTimeline } = React.useContext(StoreContextT);
  const { datareset, setDataReset } = React.useContext(StoreContextR);

  const [selectday, setSelectday] = React.useState({
    start: "",
    end: "",
    day: "",
  });

  const [value, onChange] = React.useState([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 1)),
  ]);

  const [cstatus, setCstatus] = React.useState(false);

  const datechange = (e) => {
    onChange(e);
    calcday();
    setCstatus(!cstatus);
  };

  const calcday = () => {
    //일수 계산
    const day = moment(value[1]).diff(moment(value[0]), "days");
    //시작 종료 날짜 포맷 변경
    const startDate = moment.tz(value[0], "Asia/Seoul").format("YY-MM-DD");
    const endDate = moment.tz(value[1], "Asia/Seoul").format("YY-MM-DD");
    setSelectday((prevState) => {
      return {
        ...prevState,
        start: startDate,
        end: endDate,
        day: day + 1,
      };
    });

    let arr = [];
    for (let i = 0; i < day + 1; i++) {
      let tmp = {};
      tmp.day = i + 1;
      tmp.list = [];
      arr.push(tmp);
    }
    setTimeline(arr);
    setDataReset(!datareset);
  };

  useDidMountEffect(() => {
    calcday();
  }, [value]);

  React.useEffect(() => {
    calcday();
  }, []);

  const CalendarHandler = () => {
    setCstatus(!cstatus);
  };

  return (
    <div>
      <p className="text-center">
        <span className="bold"></span> {selectday.start}
        &nbsp;|&nbsp;
        <span className="bold"></span> {selectday.end}
        <FontAwesomeIcon
          icon={faCalendarDay}
          className="imgicon small gray"
          onClick={CalendarHandler}
        />
      </p>
      {cstatus && (
        <div>
          <Calendar
            onChange={datechange}
            formatDay={(locale, date) =>
              date.toLocaleString("en", { day: "numeric" })
            } //요일 숫자로
            next2Label={null} //다음 연도
            prev2Label={null} //이전 연도
            minDetail="decade" //선택할수있는 최소 항목
            showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
            selectRange={true} //범위지정
            value={value}
          />
        </div>
      )}
    </div>
  );
}
function KakaoMap() {
  React.useEffect(() => {
    var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    var options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
  }, []);

  return (
    <div id="map" className="mapcontainer">
      카카오지도
    </div>
  );
}

function DayList(props) {
  const { timeline, setTimeline } = React.useContext(StoreContextT);
  const { datareset } = React.useContext(StoreContextR);
  const value = props.data;
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    setIdx(0);
  }, [datareset]);

  const addHanlder = () => {
    //모달을 열고
    setIdx((idx) => idx + 1);
    const tmp = [...timeline];

    tmp.map((data, index) => {
      if (data.day === value.day) {
        // data.list.push({ idx: idx, place: `place${idx}` });
        data.list.push({ idx: data.list.length, place: "place" });
      }
    });

    // console.log(tmp);
    setTimeline(tmp);
  };

  const delHanlder = (props) => {
    let tmp = [...timeline];
    let PlaceList = [];

    tmp.map((data, index) => {
      if (data.day === value.day) {
        const newPlaceList = data.list.filter((it) => it.idx !== props);

        newPlaceList.map((d, i) => {
          let place = { ...d };
          place.idx = i;
          PlaceList.push(place);
        });

        data.list = [...PlaceList];
      }
    });

    // console.log(tmp);
    setTimeline(tmp);
  };

  return (
    <ul>
      {value.list.map((data, index) => (
        <li key={index} className="item">
          {index}번째 {data.place}
          {data.idx}
          <FontAwesomeIcon
            icon={faTrashCan}
            className="imgicon small gray"
            onClick={() => delHanlder(data.idx)}
          />
        </li>
      ))}
      <button onClick={addHanlder}>장소 추가</button>
    </ul>
  );
}

function TimelineWriting() {
  const { timeline, setTimeline } = React.useContext(StoreContextT);
  const { setDispatchType } = React.useContext(StoreContextDis);

  // React.useEffect(() => {
  //   console.log(timeline);
  // }, [timeline]);

  return (
    <div className="timelinecontainer">
      {/* <span>타임라인{timeline.length}개 생성</span> */}
      <ul>
        {timeline.map((data, index) => (
          <li key={index} className="item">
            Day{data.day}
            <DayList data={data} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Content() {
  const [timeline, setTimeline] = React.useState([]);
  const [datareset, setDataReset] = React.useState(false);

  return (
    <StoreContextT.Provider value={{ timeline, setTimeline }}>
      <StoreContextR.Provider value={{ datareset, setDataReset }}>
        <div className="contentarea">
          {/* {tripdata.host_idx === loginUser.mem_idx && (
          <span>로그인한사람이 방장</span>
        )} */}
          <div className="calenderarea">
            <ReactCalender></ReactCalender>
          </div>
          <div className="maptime flex">
            <div className="kakomaparea">
              <KakaoMap></KakaoMap>
            </div>
            <div className="timelinearea">
              {/* 작성폼 */}
              <TimelineWriting></TimelineWriting>
              <button>작성</button>
              <button>취소</button>
              {/* 뷰폼 */}
            </div>
          </div>
        </div>
      </StoreContextR.Provider>
    </StoreContextT.Provider>
  );
}

const StoreContextT = React.createContext([]);
const StoreContextR = React.createContext({});
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
  const [timelinelist, setTimeline] = React.useState([]);

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
