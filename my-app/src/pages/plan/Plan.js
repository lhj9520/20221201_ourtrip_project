import React from "react";
import axios from "axios";
import moment from "moment-timezone";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import "./Plan.css";
import useDidMountEffect from "../../utils/useDidMountEffect";
import SearchModal from "./SearchModal";
import marking from "../../img/map_mark.png";
import Loading from "../../component/Loading";
import { SessionContext } from "../../App";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { BASE_URL } from "../../config";

const { kakao } = window;

let MarkerAddDAYALLHandler = (day, markers) => {};
let MarkerDELALLHandler = (allmarkers) => {};
let LineAddDAYALLHandler = (day, polylines) => {};
let LineDELALLHandler = (allmarkers) => {};
let CustomMarkerAddDAYALLHandler = (day, markers) => {};
let MoveToCenter = () => {};

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
    if (tripdata.trip) {
      setTitle((prevState) => {
        return {
          ...prevState,
          value: tripdata.trip.title,
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
      url: `${BASE_URL}/mytrip/triptitlechange`,
      method: "POST",
      data: { seq: tripdata.trip.seq, title: title.value },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType((prevState) => {
            return {
              ...prevState,
              code: "refresh",
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
        <FontAwesomeIcon icon={faHouse} className="imgicon" onClick={() => navigation("/", { replace: true })} />
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
            <input type="text" name="title" maxLength={20} value={title.value} onChange={valuechange} />
            <FontAwesomeIcon icon={faCircleCheck} className="imgicon" onClick={titlemodHandler} />
            <FontAwesomeIcon icon={faCircleXmark} className="imgicon" onClick={titlemodcloseHandler} />
          </div>
        ) : (
          <div className="viewmode">
            <span>{tripdata.trip && tripdata.trip.title}</span>
            <FontAwesomeIcon icon={faPen} className="imgicon" onClick={titlemodopenHandler} />
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
    if (tripdata.trip) {
      setParticipants(Object.entries(JSON.parse(tripdata.trip.mate_idx)));
    }
  }, [tripdata]);

  return (
    <div className="listbox">
      {/* 친구목록입니다. */}
      <span className="listtitle">메이트</span>
      <ul className="scrollnone">
        {participants.map((data, index) => (
          <li key={index} className="item">
            {data[0] == tripdata.trip.host_idx && <FontAwesomeIcon icon={faStar} />}
            {data[1]}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 여행에 등록된 타임라인 리스트
function Timelinebar() {
  const { mode, setMode } = React.useContext(StoreContextM);
  const { tripdata } = React.useContext(StoreContextTrip);
  const [timelinelist, setTimelinelist] = React.useState([]);
  const [cursel, Setcursel] = React.useState(0);
  const [status, setStatus] = React.useState(true);

  React.useEffect(() => {
    if (tripdata.timeline) {
      setTimelinelist(tripdata.timeline);
    }
  }, [tripdata]);

  React.useEffect(() => {
    if (mode.code === "write") {
      setStatus(false);
    } else {
      setStatus(true);
      Setcursel(mode.index);
    }
  }, [mode]);

  const FormOpenHanlder = () => {
    // setStatus(false);
    Setcursel(-1);
    setMode((prevState) => {
      return { ...prevState, code: "write" };
    });
  };

  const ViewOpenHanlder = (data, index) => {
    MoveToCenter();
    Setcursel(index);
    setMode((prevState) => {
      return { ...prevState, code: "view", index: index };
    });
  };

  return (
    <div className="listbox timelinelist">
      <span className="listtitle">
        타임 라인
        {status && <FontAwesomeIcon icon={faPlus} className="imgicon" onClick={FormOpenHanlder} />}
      </span>
      <ul className="type scrollnone">
        {timelinelist.map((data, index) => (
          <li
            key={index}
            className={cursel === index ? "item select" : "item"}
            onClick={() => ViewOpenHanlder(data, index)}
          >
            {data.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 리액트 캘린더
function ReactCalender(props) {
  const { setTmptimeline } = React.useContext(StoreContextT);
  let { start, end } = props;
  const [reset, setReset] = React.useState(false);

  const [selectday, setSelectday] = React.useState({
    start: "",
    end: "",
  });

  const [value, onChange] = React.useState([new Date(), new Date(new Date().setDate(new Date().getDate() + 1))]);

  const [cstatus, setCstatus] = React.useState(false);

  const datechange = (e) => {
    if (window.confirm("데이터가 초기화 됩니다. 변경하시겠습니까?")) {
      onChange(e);
      setCstatus(!cstatus);
    }
  };

  const calcday = () => {
    //일수 계산
    const day = moment(value[1]).diff(moment(value[0]), "days");
    //시작 종료 날짜 포맷 변경
    const startDate = moment.tz(value[0], "Asia/Seoul").format("YYYY-MM-DD");
    const endDate = moment.tz(value[1], "Asia/Seoul").format("YYYY-MM-DD");

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
  };

  useDidMountEffect(() => {
    if ((reset && ((start && end) || (!start && !end))) || (!reset && !start && !end)) {
      calcday();
    } else if (!reset && start && end) {
      //일수 계산
      const day = moment(value[1]).diff(moment(value[0]), "days");
      //시작 종료 날짜 포맷 변경
      const startDate = moment.tz(value[0], "Asia/Seoul").format("YYYY-MM-DD");
      const endDate = moment.tz(value[1], "Asia/Seoul").format("YYYY-MM-DD");

      setSelectday((prevState) => {
        return {
          ...prevState,
          start: startDate,
          end: endDate,
        };
      });

      setReset(true);
    }
  }, [value]);

  React.useEffect(() => {
    if (start && end) {
      const [syear, smonth, sday] = start.split("-");
      const [eyear, emonth, eday] = end.split("-");
      //날짜 설정
      onChange([
        new Date(Number(syear), Number(smonth) - 1, Number(sday)),
        new Date(Number(eyear), Number(emonth) - 1, Number(eday)),
      ]);
    } else {
      calcday();
    }
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
        <FontAwesomeIcon icon={faCalendarDay} className="imgicon" onClick={CalendarHandler} />
      </p>
      {cstatus && (
        <Calendar
          onChange={datechange}
          formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })} //요일 숫자로
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
  const [map, setMap] = React.useState(null);
  const [boundslist, setBoundslist] = React.useState({});

  React.useEffect(() => {
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

  //해당 날짜에 해당하는 마커 그리기
  MarkerAddDAYALLHandler = (day, markerlist) => {
    let bounds = new kakao.maps.LatLngBounds();
    markerlist[day - 1].map((data, index) => {
      data.setMap(map);
      bounds.extend(data.getPosition());
    });
    setBoundslist(bounds);
  };

  //해당 날짜에 해당하는 커스텀 오버레이 마커 그리기
  CustomMarkerAddDAYALLHandler = (day, markerlist) => {
    markerlist[day - 1].map((data, index) => {
      const content = `<div class ="label"><span class="left"></span><span class="center">${
        index + 1
      }</span><span class="right"></span></div>`;
      data.setContent(content);
      data.setMap(map);
    });
  };

  //마커 전체 지우기
  MarkerDELALLHandler = (markerlist) => {
    markerlist.map((data) => {
      data.map((it) => it.setMap(null));
    });
  };

  //해당 날짜에 해당하는 라인 그리기
  LineAddDAYALLHandler = (day, linelist) => {
    linelist[day - 1].setMap(map);
  };

  //라인 전체 지우기
  LineDELALLHandler = (linelist) => {
    linelist.map((data) => data.setMap(null));
  };

  MoveToCenter = () => {
    if (map) {
      //지도 중심 이동
      panTo(37.566828708166284, 126.97865508730158);
      //지도 레벨 변경
      map.setLevel(3);
    }
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

  return <div id="map" className="kakomap"></div>;
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

  const delHanlder = (propsidx) => {
    let tmp = [...tmptimeline.daylist];
    let newPlaceList = [];

    tmp.map((data, index) => {
      if (data.day === value.day) {
        newPlaceList = data.list.filter((it, idx) => idx !== propsidx);
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
          <div className="itemindex">{index < 9 ? <>&nbsp;{index + 1}&nbsp;</> : <>{index + 1}</>}</div>
          <div className="itemtext">
            <span>{data.place_name}</span>
          </div>
          <FontAwesomeIcon icon={faTrashCan} className="imgicon" onClick={() => delHanlder(index)} />
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
  const { loginUser } = React.useContext(SessionContext);
  const { setMode } = React.useContext(StoreContextM);
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { tripdata } = React.useContext(StoreContextTrip);
  const { tmptimeline } = React.useContext(StoreContextT);
  const [modalOpen, setModalOpen] = React.useState({ code: false, day: "" });
  const [title, setTitle] = React.useState("");
  const [markerstore, setMarkerstore] = React.useState([]);
  const [polylinestore, setPolylinestore] = React.useState([]);
  const [overlaystore, setOverlaystore] = React.useState([]);
  const horizontalScrollRef = React.useRef();

  React.useEffect(() => {
    MoveToCenter();
    if (tmptimeline.daylist.length > 0) {
      //이전에 생성된 마커 삭제
      MarkerDELALLHandler(markerstore);
      //이전에 생성된 라인 삭제
      LineDELALLHandler(polylinestore);
      //이전에 생성된 커스텀 오버레이 삭제
      MarkerDELALLHandler(overlaystore);

      //전체 마커 생성
      const markers = [];
      const polylines = [];
      const overlays = [];

      let markerstmp = [];
      let linePath = [];
      let overlaystmp = [];

      tmptimeline.daylist.map((item, index) => {
        item.list.map((d, i) => {
          //마커 저장
          const imageSize = new kakao.maps.Size(24, 35);
          const markerImage = new kakao.maps.MarkerImage(marking, imageSize);
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(Number(d.y), Number(d.x)),
            title: d.place_name,
            image: markerImage,
          });
          markerstmp.push(marker);
          //커스텀오버레이 저장
          const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(Number(d.y), Number(d.x)),
          });
          overlaystmp.push(customOverlay);
          //선을 이을 좌표 저장
          linePath.push(new kakao.maps.LatLng(Number(d.y), Number(d.x)));
        });
        markers.push(markerstmp);
        markerstmp = [];
        overlays.push(overlaystmp);
        overlaystmp = [];
        //선 생성
        const polyline = new kakao.maps.Polyline({
          path: linePath, // 선을 구성하는 좌표배열 입니다
          strokeWeight: 3, // 선의 두께 입니다
          strokeColor: "#4a8522", // 선의 색깔입니다
          strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: "solid", // 선의 스타일입니다
        });
        polylines.push(polyline);
        linePath = [];
      });

      if (tmptimeline.code === "add" || tmptimeline.code === "del") {
        //마커 그리기
        MarkerAddDAYALLHandler(tmptimeline.curday, markers);
        setMarkerstore(markers);
        //라인 그리기
        LineAddDAYALLHandler(tmptimeline.curday, polylines);
        setPolylinestore(polylines);
        //커스텀 오버레이 그리기
        CustomMarkerAddDAYALLHandler(tmptimeline.curday, overlays);
        setOverlaystore(overlays);
      } else if (tmptimeline.code === "reset") {
        MoveToCenter();
      }
    }
  }, [tmptimeline]);

  const onMarkerHandler = (day) => {
    //이전에 생성된 마커 삭제
    MarkerDELALLHandler(markerstore);
    //이전에 생성된 라인 삭제
    LineDELALLHandler(polylinestore);
    //이전에 생성된 커스텀오버레이 삭제
    MarkerDELALLHandler(overlaystore);
    //특정 날짜 마커 그리기
    MarkerAddDAYALLHandler(day, markerstore);
    //특정 날짜 커스텀오버레이 그리기
    CustomMarkerAddDAYALLHandler(day, overlaystore);
    //특정 날짜 라인 그리기
    LineAddDAYALLHandler(day, polylinestore);
  };

  const TimelineAddHandler = async () => {
    let tmp = title;
    if (!tmp) {
      tmp = moment.tz(new Date(), "Asia/Seoul").format("YY-MM-DD HH:mm 작성");
    }

    await axios({
      url: `${BASE_URL}/mytrip/timelineadd`,
      method: "POST",
      data: {
        tripseq: tripdata.trip.seq,
        title: tmp,
        start: tmptimeline.start,
        end: tmptimeline.end,
        day: tmptimeline.day,
        writer: loginUser.mem_idx,
        daylist: tmptimeline.daylist,
        curidx: tmptimeline.curidx,
      },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          setDispatchType((prevState) => {
            return {
              ...prevState,
              code: "refresh",
            };
          });
        }
      })
      .catch((e) => {
        console.log("타임라인 작성 오류!", e);
      });
  };

  const FormColseHanlder = () => {
    if (tripdata.timeline.length !== 0) {
      setMode((prevState) => {
        return { ...prevState, code: "view" };
      });
    }
  };

  const valuechange = (e) => {
    const data = e.target.value;
    if (data.length <= 20) {
      setTitle(data);
    }
  };

  const MoveToLeftHandler = () => {
    if (!horizontalScrollRef.current) return;
    horizontalScrollRef.current.scrollTo({
      left: horizontalScrollRef.current.scrollLeft - horizontalScrollRef.current.offsetWidth / 5,
      behavior: "smooth",
    });
  };

  const MoveToRightHandler = () => {
    if (!horizontalScrollRef.current) return;
    horizontalScrollRef.current.scrollTo({
      left: horizontalScrollRef.current.scrollLeft + horizontalScrollRef.current.offsetWidth / 5,
      behavior: "smooth",
    });
  };

  return (
    <StoreContextModal.Provider value={{ modalOpen, setModalOpen }}>
      <div className="form">
        {modalOpen.code && <SearchModal setModalOpen={setModalOpen} day={modalOpen.day} />}
        <p className="titletext">
          <input maxLength={20} value={title} placeholder="제목 입력" onChange={valuechange} />
          <button onClick={TimelineAddHandler}>작성</button>
          <button onClick={FormColseHanlder}>취소</button>
        </p>
        <ReactCalender />
        <div className="mapdaybox">
          <div className="kakaomapbox">
            <KakaoMap />
          </div>
          <div className="daybox">
            <button className="lbtn" onClick={MoveToLeftHandler}>
              <FontAwesomeIcon icon={faArrowLeft} className="imgicon" />
            </button>
            <ul ref={horizontalScrollRef}>
              {tmptimeline.daylist.map((data, index) => (
                <li key={index} className="item scrollnone">
                  <div className="lidaytext" onClick={() => onMarkerHandler(data.day)}>
                    Day{data.day}
                  </div>
                  <DayListInput data={data} />
                </li>
              ))}
            </ul>
            <button className="rbtn" onClick={MoveToRightHandler}>
              <FontAwesomeIcon icon={faArrowRight} className="imgicon" />
            </button>
          </div>
        </div>
      </div>
    </StoreContextModal.Provider>
  );
}

// 타임라인 수정 폼
function TimelineUpdateForm() {
  const { loginUser } = React.useContext(SessionContext);
  const { mode, setMode } = React.useContext(StoreContextM);
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { tripdata } = React.useContext(StoreContextTrip);
  const { tmptimeline, setTmptimeline } = React.useContext(StoreContextT);
  const [modalOpen, setModalOpen] = React.useState({ code: false, day: "" });
  const [title, setTitle] = React.useState("");
  const [markerstore, setMarkerstore] = React.useState([]);
  const [polylinestore, setPolylinestore] = React.useState([]);
  const [overlaystore, setOverlaystore] = React.useState([]);
  const horizontalScrollRef = React.useRef();

  React.useEffect(() => {
    //제목
    setTitle(tripdata.timeline[mode.index].title);
    //tmptimeline에 데이터 저장
    setTmptimeline((prevState) => {
      return {
        ...prevState,
        start: tripdata.timeline[mode.index].start,
        end: tripdata.timeline[mode.index].end,
        day: tripdata.timeline[mode.index].day,
        daylist: JSON.parse(tripdata.timeline[mode.index].daylist),
        curidx: tripdata.timeline[mode.index].curidx,
      };
    });
  }, [mode.index]);

  React.useEffect(() => {
    if (tmptimeline.daylist.length > 0) {
      //이전에 생성된 마커 삭제
      MarkerDELALLHandler(markerstore);
      //이전에 생성된 라인 삭제
      LineDELALLHandler(polylinestore);
      //이전에 커스텀 오버레이 삭제
      MarkerDELALLHandler(overlaystore);

      //전체 마커 생성
      const markers = [];
      const polylines = [];
      const overlays = [];

      let markerstmp = [];
      let linePath = [];
      let overlaystmp = [];

      tmptimeline.daylist.map((item, index) => {
        item.list.map((d, i) => {
          //마커 저장
          const imageSize = new kakao.maps.Size(24, 35);
          const markerImage = new kakao.maps.MarkerImage(marking, imageSize);
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(Number(d.y), Number(d.x)),
            title: d.place_name,
            image: markerImage,
          });
          markerstmp.push(marker);
          //커스텀오버레이 저장
          const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(Number(d.y), Number(d.x)),
          });
          overlaystmp.push(customOverlay);
          //선을 이을 좌표 저장
          linePath.push(new kakao.maps.LatLng(Number(d.y), Number(d.x)));
        });
        markers.push(markerstmp);
        markerstmp = [];
        overlays.push(overlaystmp);
        overlaystmp = [];
        //선 생성
        const polyline = new kakao.maps.Polyline({
          path: linePath, // 선을 구성하는 좌표배열 입니다
          strokeWeight: 3, // 선의 두께 입니다
          strokeColor: "#4a8522", // 선의 색깔입니다
          strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: "solid", // 선의 스타일입니다
        });
        polylines.push(polyline);
        linePath = [];
      });

      //마커 저장
      setMarkerstore(markers);
      //라인 저장
      setPolylinestore(polylines);
      //커스텀오버레이 저장
      setOverlaystore(overlays);

      if (tmptimeline.code === "add" || tmptimeline.code === "del") {
        //마커 그리기
        MarkerAddDAYALLHandler(tmptimeline.curday, markers);
        //마커 저장
        setMarkerstore(markers);
        //라인 그리기
        LineAddDAYALLHandler(tmptimeline.curday, polylines);
        //라인 저장
        setPolylinestore(polylines);
        //순서 그리기
        CustomMarkerAddDAYALLHandler(tmptimeline.curday, overlays);
        //커스텀오버레이 저장
        setOverlaystore(overlays);
      } else if (tmptimeline.code === "reset") {
        MoveToCenter();
      }
    }
  }, [tmptimeline]);

  const onMarkerHandler = (day) => {
    //이전에 생성된 마커 삭제
    MarkerDELALLHandler(markerstore);
    //이전에 생성된 라인 삭제
    LineDELALLHandler(polylinestore);
    //이전에 생성된 커스텀오버레이 삭제
    MarkerDELALLHandler(overlaystore);
    //특정 날짜 마커 그리기
    MarkerAddDAYALLHandler(day, markerstore);
    //특정 날짜 커스텀오버레이 그리기
    CustomMarkerAddDAYALLHandler(day, overlaystore);
    //특정 날짜 라인 그리기
    LineAddDAYALLHandler(day, polylinestore);
  };

  const TimelineUpdateHandler = async () => {
    let tmp = title;
    if (!tmp) {
      tmp = moment.tz(new Date(), "Asia/Seoul").format("YY-MM-DD HH:mm 작성");
    }

    await axios({
      url: `${BASE_URL}/mytrip/timelineupdate`,
      method: "POST",
      data: {
        seq: tripdata.timeline[mode.index].seq,
        tripseq: tripdata.trip.seq,
        title: tmp,
        start: tmptimeline.start,
        end: tmptimeline.end,
        day: tmptimeline.day,
        writer: loginUser.mem_idx,
        daylist: tmptimeline.daylist,
        curidx: tmptimeline.curidx,
      },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          setDispatchType((prevState) => {
            return {
              ...prevState,
              code: "refresh",
            };
          });
        }
      })
      .catch((e) => {
        console.log("타임라인 작성 오류!", e);
      });
  };

  const FormColseHanlder = () => {
    if (tripdata.timeline.length !== 0) {
      setMode((prevState) => {
        return { ...prevState, code: "view" };
      });
    }
  };

  const valuechange = (e) => {
    const data = e.target.value;
    if (data.length <= 20) {
      setTitle(data);
    }
  };

  const MoveToLeftHandler = () => {
    if (!horizontalScrollRef.current) return;
    horizontalScrollRef.current.scrollTo({
      left: horizontalScrollRef.current.scrollLeft - horizontalScrollRef.current.offsetWidth / 5,
      behavior: "smooth",
    });
  };

  const MoveToRightHandler = () => {
    if (!horizontalScrollRef.current) return;
    horizontalScrollRef.current.scrollTo({
      left: horizontalScrollRef.current.scrollLeft + horizontalScrollRef.current.offsetWidth / 5,
      behavior: "smooth",
    });
  };

  return (
    <StoreContextModal.Provider value={{ modalOpen, setModalOpen }}>
      <div className="form">
        {modalOpen.code && <SearchModal setModalOpen={setModalOpen} day={modalOpen.day} />}
        <p className="titletext">
          <input maxLength={20} value={title} placeholder="제목 입력" onChange={valuechange} />
          <button onClick={TimelineUpdateHandler}>완료</button>
          <button onClick={FormColseHanlder}>취소</button>
        </p>
        <ReactCalender start={tripdata.timeline[mode.index].start} end={tripdata.timeline[mode.index].end} />
        <div className="mapdaybox">
          <div className="kakaomapbox">
            <KakaoMap />
          </div>
          <div className="daybox">
            <button className="lbtn" onClick={MoveToLeftHandler}>
              <FontAwesomeIcon icon={faArrowLeft} className="imgicon" />
            </button>
            <ul ref={horizontalScrollRef}>
              {tmptimeline.daylist.map((data, index) => (
                <li key={index} className="item scrollnone">
                  <div className="lidaytext" onClick={() => onMarkerHandler(data.day)}>
                    Day{data.day}
                  </div>
                  <DayListInput data={data} />
                </li>
              ))}
            </ul>
            <button className="rbtn" onClick={MoveToRightHandler}>
              <FontAwesomeIcon icon={faArrowRight} className="imgicon" />
            </button>
          </div>
        </div>
      </div>
    </StoreContextModal.Provider>
  );
}

// Day안에 장소 리스트
function DayListView(props) {
  const value = props.data;

  return (
    <ul>
      {value.list.map((data, index) => (
        <li key={index} className="item">
          <div className="itemindex">{index < 9 ? <>&nbsp;{index + 1}&nbsp;</> : <>{index + 1}</>}</div>
          <div className="itemtext">
            <span>{data.place_name}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

// 타임라인 뷰 폼
function TimelineViewForm() {
  const { loginUser } = React.useContext(SessionContext);
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { mode, setMode } = React.useContext(StoreContextM);
  const { tripdata } = React.useContext(StoreContextTrip);
  const [data, setData] = React.useState([]);
  const [markerstore, setMarkerstore] = React.useState([]);
  const [polylinestore, setPolylinestore] = React.useState([]);
  const [overlaystore, setOverlaystore] = React.useState([]);
  const horizontalScrollRef = React.useRef();

  React.useEffect(() => {
    setData(JSON.parse(tripdata.timeline[mode.index].daylist));
  }, [mode.index]);

  React.useEffect(() => {
    if (data.length > 0) {
      //이전에 생성된 마커 제거
      MarkerDELALLHandler(markerstore);
      //이전에 생성된 라인 삭제
      LineDELALLHandler(polylinestore);
      //첫째날 순서 그리기
      MarkerDELALLHandler(overlaystore);

      //전체 마커 생성
      const markers = [];
      const polylines = [];
      const overlays = [];

      let markerstmp = [];
      let linePath = [];
      let overlaystmp = [];

      data.map((item, index) => {
        item.list.map((d, i) => {
          //마커 저장
          const imageSize = new kakao.maps.Size(24, 35);
          const markerImage = new kakao.maps.MarkerImage(marking, imageSize);
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(Number(d.y), Number(d.x)),
            title: d.place_name,
            image: markerImage,
          });
          markerstmp.push(marker);
          //커스텀오버레이 저장
          const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(Number(d.y), Number(d.x)),
          });
          overlaystmp.push(customOverlay);
          //선을 이을 좌표 저장
          linePath.push(new kakao.maps.LatLng(Number(d.y), Number(d.x)));
        });
        markers.push(markerstmp);
        markerstmp = [];
        overlays.push(overlaystmp);
        overlaystmp = [];
        //선 생성
        const polyline = new kakao.maps.Polyline({
          path: linePath, // 선을 구성하는 좌표배열 입니다
          strokeWeight: 3, // 선의 두께 입니다
          strokeColor: "#4a8522", // 선의 색깔입니다
          strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: "solid", // 선의 스타일입니다
        });
        polylines.push(polyline);
        linePath = [];
      });

      //첫째날 마커 그리기
      MarkerAddDAYALLHandler(1, markers);
      setMarkerstore(markers);
      //첫째날 라인 그리기
      LineAddDAYALLHandler(1, polylines);
      setPolylinestore(polylines);
      //첫째날 순서 그리기
      CustomMarkerAddDAYALLHandler(1, overlays);
      setOverlaystore(overlays);
    }
  }, [data]);

  const onMarkerHandler = (day) => {
    //이전에 생성된 마커 삭제
    MarkerDELALLHandler(markerstore);
    //이전에 생성된 라인 삭제
    LineDELALLHandler(polylinestore);
    //이전에 생성된 커스텀마커 삭제
    MarkerDELALLHandler(overlaystore);
    //특정 날짜 마커 그리기
    MarkerAddDAYALLHandler(day, markerstore);
    //특정 날짜 커스텀 마커 그리기
    CustomMarkerAddDAYALLHandler(day, overlaystore);
    //특정 날짜 라인 그리기
    LineAddDAYALLHandler(day, polylinestore);
  };

  const FormOpenHanlder = () => {
    if (tripdata.timeline.length !== 0) {
      setMode((prevState) => {
        return { ...prevState, code: "modify" };
      });
    }
  };

  const TimelineDelHandler = async () => {
    await axios({
      url: `${BASE_URL}/mytrip/timelinedelete`,
      method: "POST",
      data: {
        seq: tripdata.timeline[mode.index].seq,
      },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          setDispatchType((prevState) => {
            return {
              ...prevState,
              code: "refresh",
            };
          });
        }
      })
      .catch((e) => {
        console.log("타임라인 작성 오류!", e);
      });

    setMode((prevState) => {
      return {
        ...prevState,
        code: "",
        index: 0,
      };
    });
  };

  const MoveToLeftHandler = () => {
    if (!horizontalScrollRef.current) return;
    horizontalScrollRef.current.scrollTo({
      left: horizontalScrollRef.current.scrollLeft - horizontalScrollRef.current.offsetWidth / 5,
      behavior: "smooth",
    });
  };

  const MoveToRightHandler = () => {
    if (!horizontalScrollRef.current) return;
    horizontalScrollRef.current.scrollTo({
      left: horizontalScrollRef.current.scrollLeft + horizontalScrollRef.current.offsetWidth / 5,
      behavior: "smooth",
    });
  };

  return (
    <div className="form">
      <p className="titletext">
        <span></span>
      </p>
      <div className="calenderbox">
        <p className="daytext">
          <span className="text">{tripdata.timeline[mode.index].title}</span>
          <span>
            {tripdata.timeline[mode.index].start} ~ {tripdata.timeline[mode.index].end}
          </span>
          <span className="line">{tripdata.timeline[mode.index].writer_nickname} 작성</span>
          {tripdata.timeline[mode.index].writer === loginUser.mem_idx && (
            <span className="line">
              {" "}
              <button onClick={FormOpenHanlder}>수정</button>
              <button onClick={TimelineDelHandler}>삭제</button>
            </span>
          )}
        </p>
      </div>
      <div className="mapdaybox">
        <div className="kakaomapbox">
          <KakaoMap />
        </div>
        <div className="daybox">
          <button className="lbtn" onClick={MoveToLeftHandler}>
            <FontAwesomeIcon icon={faArrowLeft} className="imgicon" />
          </button>
          <ul ref={horizontalScrollRef}>
            {data.map((data, index) => (
              <li key={index} className="item scrollnone">
                <div className="lidaytext" onClick={() => onMarkerHandler(data.day)}>
                  Day{data.day}
                </div>
                <DayListView data={data} />
              </li>
            ))}
          </ul>
          <button className="rbtn" onClick={MoveToRightHandler}>
            <FontAwesomeIcon icon={faArrowRight} className="imgicon" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 타임라인+작성/뷰폼
function Content() {
  const { tripdata } = React.useContext(StoreContextTrip);
  const [timelinelist, setTimelinelist] = React.useState([]);
  const [mode, setMode] = React.useState({
    code: "",
    index: 0,
  });

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

  React.useEffect(() => {
    setTimelinelist(tripdata.timeline);
    if (tripdata.timeline && timelinelist) {
      //타임라인이 추가
      if (tripdata.timeline.length > 1 && tripdata.timeline.length > timelinelist.length && timelinelist.length !== 0) {
        setMode((prevState) => {
          return {
            ...prevState,
            code: "",
            index: tripdata.timeline.length - 1,
          };
        });
      }
    }
  }, [tripdata]);

  React.useEffect(() => {
    if (timelinelist) {
      if (timelinelist.length === 0) {
        setMode((prevState) => {
          return { ...prevState, code: "write" };
        });
      } else {
        setMode((prevState) => {
          return { ...prevState, code: "view" };
        });
      }
    }
  }, [timelinelist]);

  /**
   * 전역 변수
   * 1. 작성중인 타임라인 데이터 timeline
   */

  return (
    <StoreContextM.Provider value={{ mode, setMode }}>
      <StoreContextT.Provider value={{ tmptimeline, setTmptimeline }}>
        <Timelinebar />
        {mode.code === "view" && <TimelineViewForm />}
        {mode.code === "write" && <TimelineInputForm />}
        {mode.code === "modify" && <TimelineUpdateForm />}
      </StoreContextT.Provider>
    </StoreContextM.Provider>
  );
}

export const StoreContextT = React.createContext({});
const StoreContextM = React.createContext({});
const StoreContextTrip = React.createContext({});
const StoreContextDis = React.createContext({});

function Plan() {
  const navigation = useNavigate();

  let { seq } = useParams();
  const { loginUser } = React.useContext(SessionContext);
  const [dispatch, setDispatchType] = React.useState({
    code: null,
    params: null,
  });
  const [loading, setLoading] = React.useState(null);
  const [tripdata, setTripdata] = React.useState({});

  React.useEffect(() => {
    if (loginUser.session === "none") {
      navigation("/login", { replace: true });
    } else if (Object.keys(loginUser).length > 1) {
      TripLoadHandler();
    }
  }, [loginUser]);

  useDidMountEffect(() => {
    if (dispatch.code === "refresh") {
      TripLoadHandler();
    }
  }, [dispatch]);

  //seq에 해당하는 여행 데이터 가져오기
  const TripLoadHandler = async () => {
    setLoading(true);
    await axios({
      url: `${BASE_URL}/mytrip/planlist`,
      method: "POST",
      data: { seq: seq, idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, trip, timeline } = res.data;
        setTripdata({ trip, timeline });
        setLoading(false);
      })
      .catch((e) => {
        console.log("여행 계획 업데이트 오류!", e);
      });
  };

  return (
    <>
      {loading ? <Loading /> : null}
      {Object.keys(loginUser).length > 1 && (
        <>
          {Object.keys(tripdata).length > 0 && tripdata.trip !== "none" && Object.keys(tripdata.trip).length > 1 ? (
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
          ) : (
            <>
              {Object.keys(tripdata).length !== 0 && tripdata.trip === "none" && (
                <div>해당 여행계획 게시글에 권한이 없습니다.</div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Plan;
