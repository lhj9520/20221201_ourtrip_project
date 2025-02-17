import React, { useState, useRef, useEffect } from "react";
// import css
import "./Main.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../component/SimpleSlider.css";
// import src
import geojson_ctp from "../assets/geojsondata/ctp_rvn.json";
import geojson_sig from "../assets/geojsondata/sig.json";
import SimpleSlider from "../component/SimpleSlider";
import APILoading from "../component/APILoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
// import component
import Menubar from "../component/menubar";
// import api
import { getTourResourceAPI } from "../api/Main";

const { kakao } = window;

const AreaCode = [
  { title: "서울", code: "11" },
  { title: "부산", code: "26" },
  { title: "대구", code: "27" },
  { title: "인천", code: "28" },
  { title: "광주", code: "29" },
  { title: "대전", code: "30" },
  { title: "울산", code: "31" },
  { title: "세종", code: "36" },
  { title: "경기도", code: "41" },
  { title: "강원도", code: "42" },
  { title: "충청북도", code: "43" },
  { title: "충청남도", code: "44" },
  { title: "전라북도", code: "45" },
  { title: "전라남도", code: "46" },
  { title: "경상북도", code: "47" },
  { title: "경상남도", code: "48" },
  { title: "제주도", code: "50" },
];

function Main() {
  const data_ctp = geojson_ctp.features;
  const data_sig = geojson_sig.features;
  const [map, setMap] = useState(null);
  const [code, setCode] = useState(0);
  const [geojson, setGeojson] = useState({
    ctp_name: "",
    polygon_ctp: [],
    sig: [],
  });
  const [tourlist, setTourlist] = useState([]);
  const horizontalScrollRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(36.13247338124637, 127.8312630711475),
      level: 13, // 지도의 확대 레벨
    };

    //지도 생성 및 객체 리턴
    const map = new kakao.maps.Map(container, options);
    setMap(map);
  }, []);

  useEffect(() => {
    if (code !== 0) {
      DisplayAreaHandler(code);
    }
  }, [code]);

  const getTourResource = async (sido, gungu) => {
    //로딩 시작
    setLoading(true);
    // 데이터 변수에 저장
    setTourlist(await getTourResourceAPI(sido, gungu));
    //로딩 종료
    setLoading(false);
  };

  const DisplayAreaHandler = (code) => {
    //시도 Polygon 전부 삭제
    geojson.polygon_ctp.map((it) => it.setMap(null));
    //시군구 Polygon 전부 삭제
    geojson.sig.map((data, index) =>
      data.polygonarr.map((it) => it.setMap(null))
    );

    //시도 데이터
    const arr_ctp = data_ctp.filter((it) => it.properties.CTPRVN_CD === code);

    //polygons 만들기
    let polygons_ctp = [];
    var bounds = new kakao.maps.LatLngBounds();
    arr_ctp[0].geometry.coordinates.map((data, index) => {
      let path = [];
      data.map((it, index) => {
        path.push(new kakao.maps.LatLng(it[1], it[0]));
        bounds.extend(new kakao.maps.LatLng(it[1], it[0]));
      });

      const polygon = new kakao.maps.Polygon({
        path: path, // 그려질 다각형의 좌표 배열입니다
        strokeWeight: 2, // 선의 두께입니다
        strokeColor: "#4a8522", // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: "solid", // 선의 스타일입니다
        fillColor: "#fff", // 채우기 색깔입니다
        fillOpacity: 0.2, // 채우기 불투명도 입니다
      });
      polygons_ctp.push(polygon);
    });

    //지도 범위 재설정
    map.setBounds(bounds);
    map.setLevel(11);
    //Polygon 전부 그리기
    polygons_ctp.map((it) => it.setMap(map));

    //시군구 데이터(자치구)
    const arr_sig = data_sig.filter((it) =>
      it.properties.SIG_CD.startsWith(code)
    );

    let sigarr = [];
    //자치구별 객체 만들기{name:"",polygonarr:[]}
    arr_sig.map((data, index) => {
      let sig = {};
      sig.name = data.properties.SIG_KOR_NM;
      //polygons 만들기
      let polygons = [];
      data.geometry.coordinates.map((data, index) => {
        let path = [];
        data.map((it, index) => {
          path.push(new kakao.maps.LatLng(it[1], it[0]));
        });
        const polygon = new kakao.maps.Polygon({
          path: path, // 그려질 다각형의 좌표 배열입니다
          strokeWeight: 2, // 선의 두께입니다
          strokeColor: "#4a8522", // 선의 색깔입니다
          strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: "solid", // 선의 스타일입니다
          fillColor: "#fff", // 채우기 색깔입니다
          fillOpacity: 0.5, // 채우기 불투명도 입니다
        });
        polygons.push(polygon);
      });
      sig.polygonarr = [...polygons];
      sigarr.push(sig);
    });

    const customOverlay = new kakao.maps.CustomOverlay({});
    //Polygon 전부 그리기
    sigarr.map((data, index) =>
      data.polygonarr.map((it) => {
        it.setMap(map);

        // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
        // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
        kakao.maps.event.addListener(it, "mouseover", function (mouseEvent) {
          it.setOptions({ fillColor: "#09f" });
          customOverlay.setContent('<div class="area">' + data.name + "</div>");
          customOverlay.setPosition(mouseEvent.latLng);
          customOverlay.setMap(map);
        });

        // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
        kakao.maps.event.addListener(it, "mousemove", function (mouseEvent) {
          customOverlay.setPosition(mouseEvent.latLng);
        });

        // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
        // 커스텀 오버레이를 지도에서 제거합니다
        kakao.maps.event.addListener(it, "mouseout", function () {
          it.setOptions({ fillColor: "#fff" });
          customOverlay.setMap(null);
        });

        // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
        kakao.maps.event.addListener(it, "click", function (mouseEvent) {
          getTourResource(arr_ctp[0].properties.CTP_KOR_NM, data.name);
        });
      })
    );

    setGeojson({
      ctp_name: arr_ctp[0].properties.CTP_KOR_NM,
      polygon_ctp: polygons_ctp,
      sig: sigarr,
    });
  };

  const MoveToLeftHandler = () => {
    if (!horizontalScrollRef.current) return;

    horizontalScrollRef.current.scrollTo({
      left:
        horizontalScrollRef.current.scrollLeft -
        horizontalScrollRef.current.offsetWidth / 2,
      behavior: "smooth",
    });
  };

  const MoveToRightHandler = () => {
    if (!horizontalScrollRef.current) return;

    horizontalScrollRef.current.scrollTo({
      left:
        horizontalScrollRef.current.scrollLeft +
        horizontalScrollRef.current.offsetWidth / 2,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Menubar />
      <div className="contents-container maincon">
        <div className="maintitle">
          <SimpleSlider />
        </div>
        <div className="tourboxbackground">
          <div className="tourbox">
            <span>전국의 관광지를 확인해보세요</span>
            <div className="sidosliderbox">
              <FontAwesomeIcon
                icon={faCaretLeft}
                className="imgicon"
                onClick={MoveToLeftHandler}
              />
              <div ref={horizontalScrollRef} className="selbox">
                <ul className="citybox">
                  {AreaCode.map((data, idx) => (
                    <li
                      key={idx}
                      className={code === data.code ? "select" : ""}
                      onClick={() => {
                        if (!loading) setCode(data.code);
                      }}
                    >
                      {data.title}
                    </li>
                  ))}
                </ul>
              </div>
              <FontAwesomeIcon
                icon={faCaretRight}
                className="imgicon"
                onClick={MoveToRightHandler}
              />
            </div>
            <div className="loadingbox">
              {loading ? <APILoading /> : null}
              <div id="map" className="mainkakomap"></div>
              <div className="tourlistbox">
                {loading ? <APILoading /> : null}
                <span>장소 검색 결과</span>
                <ul className="listbox">
                  {tourlist.map((data, index) => (
                    <li key={index}>
                      <div>
                        <span>{data.name}</span>
                        <span>{data.category}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
