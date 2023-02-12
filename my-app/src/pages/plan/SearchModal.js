import React from "react";
import "./SearchModal.css";
import { StoreContextT } from "./Plan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import marking from "../../img/map_mark.png";

const { kakao } = window;

function SearchModal({ setModalOpen, day }) {
  const { tmptimeline, setTmptimeline } = React.useContext(StoreContextT);
  // const { idx, setIdx } = React.useContext(StoreContextC);
  const [keyword, setKeyword] = React.useState("");
  const [resultlist, setResultlist] = React.useState([]);
  const ps = new kakao.maps.services.Places();

  // Modal 창을 useRef로 취득
  const modalRef = React.useRef(null);

  // 모달 외부 클릭시 끄기 처리
  React.useEffect(() => {
    // 이벤트 핸들러 함수
    const handler = (event) => {
      // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen({ code: false, day: "" });
      }
    };

    // 이벤트 핸들러 등록
    document.addEventListener("mousedown", handler);
    // document.addEventListener('touchstart', handler); // 모바일 대응

    return () => {
      // 이벤트 핸들러 해제
      document.removeEventListener("mousedown", handler);
      // document.removeEventListener('touchstart', handler); // 모바일 대응
    };
  });

  const valuechange = (event) => {
    const data = event.target.value;
    setKeyword(data);
  };

  // 모달 끄기 (X버튼 onClick 이벤트 핸들러)
  const closeModal = () => {
    setModalOpen({ code: false, day: "" });
  };

  const addHanlder = (props) => {
    //모달을 열고
    // console.log(day, "번째날", idx + 1, "번째 데이터 추가");
    const tmp = [...tmptimeline.daylist];
    // let idx;
    let curdata;

    //마커 생성
    const imageSize = new kakao.maps.Size(24, 35);
    const markerImage = new kakao.maps.MarkerImage(marking, imageSize);
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(Number(props.y), Number(props.x)),
      title: props.place_name,
      image: markerImage,
    });

    tmp.map((data, index) => {
      if (data.day === day) {
        // idx = data.list.length;
        curdata = {
          day: day,
          idx: tmptimeline.curidx + 1,
          place_name: props.place_name,
          x: props.x,
          y: props.y,
          marker: marker,
        };
        data.list.push({
          idx: tmptimeline.curidx + 1,
          place_name: props.place_name,
          x: props.x,
          y: props.y,
        });
      }
    });

    // console.log(tmp);
    setTmptimeline((prevState) => {
      return {
        ...prevState,
        code: "add",
        curday: day,
        curidx: tmptimeline.curidx + 1,
        curdata: curdata,
        daylist: tmp,
      };
    });

    // setIdx((idx) => idx + 1);
  };

  const searchHanlder = () => {
    searchPlaces(keyword);
  };

  // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
  const placesSearchCB = (data, status, pagination) => {
    if (status === kakao.maps.services.Status.OK) {
      // console.log("검색결과", data);
      setResultlist([...data]);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      return;
    }
  };

  // 키워드 검색을 요청하는 함수입니다
  const searchPlaces = (keyword) => {
    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCB);
  };

  const onSubmitSearch = (e) => {
    if (e.key === "Enter") {
      //키를 눌렀을 때 동작할 코드
      searchHanlder();
    }
  };

  return (
    <div className="modalbackground">
      <div ref={modalRef} className="modalcontainer">
        <button className="close" onClick={closeModal}>
          <FontAwesomeIcon icon={faX} className="imgicon" />
        </button>
        <div className="contentbox">
          <div className="inputbox">
            <input
              placeholder="장소 검색"
              value={keyword}
              onChange={valuechange}
              onKeyPress={onSubmitSearch}
            />
            <div className="iconbox">
              <FontAwesomeIcon
                icon={faX}
                className="imgicon delete"
                onClick={() => {
                  setKeyword("");
                  setResultlist([]);
                }}
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="imgicon search"
                onClick={searchHanlder}
              />
            </div>
          </div>
          <ul className="reslistbox">
            {resultlist.map((data, index) => (
              <li key={index} className="item">
                <div className="first">
                  <span id="place">{data.place_name}</span>
                  <span id="address">{data.address_name}</span>
                </div>
                <div className="second">
                  <button onClick={() => addHanlder(data)}>추가</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default SearchModal;
