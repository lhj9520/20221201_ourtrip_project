import React from "react";
import axios from "axios";
import moment from "moment-timezone";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import "./Plan.css";
import useDidMountEffect from "../useDidMountEffect";
import SearchModal from "./SearchModal";
import markimg from "../../img/map_mark.png";

import { StoreContext, StoreContextM } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const { kakao } = window;

// 타이틀 바
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
    <div className="headerbox">
      <div className="pagemovebox">
        <FontAwesomeIcon
          icon={faHouse}
          className="imgicon"
          onClick={() => navigation("/", { replace: true })}
        />
        <span className="icontext">홈</span>
      </div>
      <div className="pagemovebox">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="imgicon"
          onClick={() => navigation("/mytrip", { replace: true })}
        />
        <span className="icontext">뒤로가기</span>
      </div>
      <div className="titlebox">
        {title.state ? (
          <div className="editmode">
            <input
              type="text"
              name="title"
              maxLength={20}
              value={title.value}
              onChange={valuechange}
            />
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="imgicon"
              onClick={titlemodHandler}
            />
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="imgicon"
              onClick={titlemodcloseHandler}
            />
          </div>
        ) : (
          <div className="viewmode">
            <span>{tripdata.title}</span>
            <FontAwesomeIcon
              icon={faPen}
              className="imgicon"
              onClick={titlemodopenHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 여행에 참여한 메이트 리스트
function Matebar() {
  const { tripdata } = React.useContext(StoreContextTrip);
  const [participants, setParticipants] = React.useState([]);

  React.useEffect(() => {
    if (tripdata.mate_idx) {
      // console.log(Object.entries(JSON.parse(tripdata.mate_idx)));
      setParticipants(Object.entries(JSON.parse(tripdata.mate_idx)));
    }
  }, [tripdata]);

  return (
    <div className="listbox">
      {/* 친구목록입니다. */}
      <span className="listtitle">메이트</span>
      <ul>
        {participants.map((data, index) => (
          <li key={index} className="item">
            {data[0] == tripdata.host_idx && (
              <FontAwesomeIcon icon={faStar} className="imgicon" />
            )}
            {data[1]}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 여행에 등록된 타임라인 리스트
function Timelinebar() {
  return (
    <div className="listbox timelinelist">
      <span className="listtitle">
        타임 라인
        <FontAwesomeIcon
          icon={faPlus}
          className="imgicon"
          onClick={formopenHandler}
        />
      </span>
      <ul>
        <li className="item select">타임라인1</li>
        <li className="item">타임라인2</li>
        <li className="item">타임라인3</li>
      </ul>
    </div>
  );
}

// 리액트 캘린더
function ReactCalender() {
  const { setTmptimeline } = React.useContext(StoreContextT);
  // const { setIdx } = React.useContext(StoreContextC);

  const [selectday, setSelectday] = React.useState({
    start: "",
    end: "",
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
      };
    });

    let arr = [];
    for (let i = 0; i < day + 1; i++) {
      let tmp = {};
      tmp.day = i + 1;
      tmp.list = [];
      arr.push(tmp);
    }

    //변수 초기화!!!
    setTmptimeline((prevState) => {
      return {
        ...prevState,
        start: startDate,
        end: endDate,
        day: day + 1,
        daylist: arr,
        curday: "",
        curdata: "",
        curidx: 0,
        code: "reset",
      };
    });
    // setIdx(0);
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
    <div className="calenderbox">
      <p className="daytext">
        <span className="text">일정 선택</span>
        <span>
          {selectday.start} ~ {selectday.end}
        </span>
        <FontAwesomeIcon
          icon={faCalendarDay}
          className="imgicon"
          onClick={CalendarHandler}
        />
      </p>
      {cstatus && (
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
          className="react-calendar"
        />
      )}
    </div>
  );
}

//카카오 지도
function KakaoMap() {
  const { tmptimeline, setTmptimeline } = React.useContext(StoreContextT);
  const [map, setMap] = React.useState(null);

  // let bounds = new kakao.maps.LatLngBounds();
  const [boundslist, setBoundslist] = React.useState({});
  const [markers, SetMarkers] = React.useState([]);

  React.useEffect(() => {
    if (tmptimeline.code === "add") {
      MarkerAddHandler(tmptimeline.curday, tmptimeline.curdata);
    } else if (tmptimeline.code === "del") {
      MarkerDelHandler(tmptimeline.curday, tmptimeline.delidx);
    } else if (tmptimeline.code === "reset") {
      //지도 마커 전부 삭제
      markers.map((data, index) => {
        data.marker.setMap(null);
      });
      SetMarkers([]);
      setBoundslist({});
      //지도 중심 이동
      panTo(37.566828708166284, 126.97865508730158);
    }
  }, [tmptimeline]);

  useDidMountEffect(() => {
    // console.log("범위 좌표", boundslist);
    if (Object.keys(boundslist).length !== 0) {
      //등록된 마커를 기준으로 지도 레벨 변경
      setBounds(boundslist);
    }
  }, [boundslist]);

  React.useEffect(() => {
    const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스

    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(37.566828708166284, 126.97865508730158), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    //지도 생성 및 객체 리턴
    const map = new kakao.maps.Map(container, options);
    setMap(map);
  }, []);

  const MarkerDelHandler = (day, idx) => {
    //마커 삭제
    const tmp = [...markers];
    const removemark = tmp.filter((it) => it.day === day && it.idx === idx);
    removemark[0].marker.setMap(null);

    const ress = tmp.filter((it) => it.idx !== idx);
    SetMarkers(ress);

    // 범위 좌표 리스트만큼 저장
    let bounds = new kakao.maps.LatLngBounds();
    const tmp1 = [...tmptimeline.daylist];
    tmp1.map((data, index) => {
      if (data.day === day) {
        // console.log(data);
        data.list.map((d, i) => {
          bounds.extend(new kakao.maps.LatLng(Number(d.y), Number(d.x)));
        });
      }
    });
    setBoundslist(bounds);
  };

  const MarkerAddHandler = (day, curdata) => {
    //마커 저장
    curdata.marker.setMap(map);
    SetMarkers([...markers, curdata]);

    // 범위 좌표 리스트만큼 저장
    let bounds = new kakao.maps.LatLngBounds();
    const tmp = [...tmptimeline.daylist];
    tmp.map((data, index) => {
      if (data.day === day) {
        // console.log(data);
        data.list.map((d, i) => {
          bounds.extend(new kakao.maps.LatLng(Number(d.y), Number(d.x)));
        });
      }
    });
    setBoundslist(bounds);
  };

  const setBounds = (bounds) => {
    // LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정합니다
    // 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
    map.setBounds(bounds);
  };

  const setCenter = (y, x) => {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(y, x);

    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
  };

  const panTo = (y, x) => {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(y, x);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
  };

  return (
    <div
      id="map"
      className="kakomap"
      // style={{ width: "100%", height: "80%" }}
    ></div>
  );
}

// Day안에 장소 리스트
function DayListInput(props) {
  const { tmptimeline, setTmptimeline } = React.useContext(StoreContextT);
  const { setModalOpen } = React.useContext(StoreContextModal);

  const value = props.data;

  const opensearchModalHandler = () => {
    // setModalOpen(true);
    setModalOpen({ code: true, day: value.day });
  };

  const delHanlder = (props) => {
    let tmp = [...tmptimeline.daylist];
    let newPlaceList = [];

    tmp.map((data, index) => {
      if (data.day === value.day) {
        newPlaceList = data.list.filter((it) => it.idx !== props);
        data.list = [...newPlaceList];
      }
    });

    setTmptimeline((prevState) => {
      return {
        ...prevState,
        curday: value.day,
        code: "del",
        delidx: props,
        daylist: tmp,
      };
    });
  };

  return (
    <ul>
      {value.list.map((data, index) => (
        <li key={index} className="item">
          <div className="itemindex">
            {index < 9 ? <>&nbsp;{index + 1}&nbsp;</> : <>{index + 1}</>}
          </div>
          <div className="itemtext">
            <span>{data.place_name}</span>
          </div>
          <FontAwesomeIcon
            icon={faTrashCan}
            className="imgicon"
            onClick={() => delHanlder(data.idx)}
          />
        </li>
      ))}
      <button className="placeaddbtn" onClick={opensearchModalHandler}>
        장소 추가
      </button>
    </ul>
  );
}

const StoreContextModal = React.createContext([]);

// 타임라인 작성 폼
function TimelineInputForm() {
  const { loginUser } = React.useContext(StoreContext);
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { tripdata } = React.useContext(StoreContextTrip);
  const { tmptimeline, setTmptimeline } = React.useContext(StoreContextT);
  const [modalOpen, setModalOpen] = React.useState({ code: false, day: "" });
  const [title, setTitle] = React.useState("");

  // React.useEffect(() => {
  //   console.log(timeline);
  // }, [timeline]);

  const TimelineAddHandler = async () => {
    let tmp = title;
    if (!tmp) {
      tmp = moment.tz(new Date(), "Asia/Seoul").format("YY-MM-DD HH:mm 작성");
    }

    await axios({
      url: "http://localhost:5000/timelineadd",
      method: "POST",
      data: {
        tripseq: tripdata.seq,
        title: tmp,
        start: tmptimeline.start,
        end: tmptimeline.end,
        day: tmptimeline.day,
        writer: loginUser.mem_idx,
        daylist: tmptimeline.daylist,
      },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
        }
      })
      .catch((e) => {
        console.log("타임라인 작성 오류!", e);
      });
  };

  const valuechange = (e) => {
    const data = e.target.value;
    if (data.length <= 20) {
      setTitle(data);
    }
  };
  return (
    <StoreContextModal.Provider value={{ modalOpen, setModalOpen }}>
      <div className="form">
        {modalOpen.code && (
          <SearchModal setModalOpen={setModalOpen} day={modalOpen.day} />
        )}
        <p className="titletext">
          <input
            maxLength={20}
            value={title}
            placeholder="제목 입력"
            onChange={valuechange}
          />
          <button onClick={TimelineAddHandler}>작성</button>
          <button>취소</button>
        </p>
        <ReactCalender />
        <div className="mapdaybox">
          <div className="kakaomapbox">
            <KakaoMap />
          </div>
          <div className="daybox">
            <button className="lbtn">
              <FontAwesomeIcon icon={faArrowLeft} className="imgicon" />
            </button>
            <ul>
              {tmptimeline.daylist.map((data, index) => (
                <li key={index} className="item">
                  <div className="lidaytext">Day{data.day}</div>
                  <DayListInput data={data} />
                </li>
              ))}
            </ul>
            <button className="rbtn">
              <FontAwesomeIcon icon={faArrowRight} className="imgicon" />
            </button>
          </div>
        </div>
      </div>
    </StoreContextModal.Provider>
  );
}

// 타임라인 목록 + 타임라인 작성/뷰 폼
function Content() {
  const [tmptimeline, setTmptimeline] = React.useState({
    start: "",
    end: "",
    day: "",
    curday: "",
    curdata: "",
    curidx: 0,
    code: "",
    daylist: [],
  });

  /**
   * 전역 변수
   * 1. 작성중인 타임라인 데이터 timeline
   */

  return (
    <StoreContextT.Provider value={{ tmptimeline, setTmptimeline }}>
      <Timelinebar />
      <TimelineInputForm />
      {/* <TimelineViewtForm /> */}
    </StoreContextT.Provider>
  );
}

export const StoreContextT = React.createContext({});
// export const StoreContextC = React.createContext({});
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
   * 2. 여행 게시글에 속한 타임라인 목록 timelinelist
   * 3. 검색 모달 on/off modalOpen
   */
  const [tripdata, setTripdata] = React.useState({});
  const [timelinelist, setTimeline] = React.useState([]);
  // const [idx, setIdx] = React.useState(0);

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

  React.useEffect(() => {
    if (Object.keys(tripdata).length !== 0) {
      console.log(tripdata);
    }
  }, [tripdata]);

  //seq에 해당하는 여행 데이터 가져오기
  const triplist = async () => {
    await axios({
      url: "http://localhost:5000/tripview",
      method: "POST",
      data: { seq: seq },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          setTripdata(data);
        }
      })
      .catch((e) => {
        console.log("여행계획 업데이트 오류!", e);
      });
  };

  return (
    <StoreContextDis.Provider value={{ setDispatchType }}>
      <StoreContextTrip.Provider value={{ tripdata }}>
        <div className="plancontainer">
          <Htitle />
          <div className="contentbox">
            <Matebar />
            <Content />
          </div>
        </div>
      </StoreContextTrip.Provider>
    </StoreContextDis.Provider>
  );
}

export default Plan;
