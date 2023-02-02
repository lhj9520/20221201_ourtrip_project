import React from "react";
import axios from "axios";
import "./Mytrip.css";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";

import { StoreContext, 세션정보가져오기 } from "../../App";
import { useNavigate } from "react-router-dom";

function Contents() {
  const navigation = useNavigate();
  // const { loginUser } = React.useContext(StoreContext);
  const { tripdata } = React.useContext(StoreContextTrip);

  return (
    <div className="content-mytrip">
      <ul>
        {tripdata.length === 0 ? (
          <span>아직 작성된 여행이 없습니다! 여행 계획을 세워보세요!</span>
        ) : (
          tripdata.map((data, index) => (
            <li key={index} className="item mytrip">
              <div className="tripinfo">
                <section
                  className="triptitle"
                  onClick={() => {
                    // navigation("/");
                  }}
                >
                  {data.title}
                </section>
                {Object.keys(JSON.parse(data.mate_idx)).length === 1 ? (
                  <section>방장 {data.host_nickname}</section>
                ) : (
                  <section>
                    방장 {data.host_nickname} 외{" "}
                    {Object.keys(JSON.parse(data.mate_idx)).length - 1}명
                  </section>
                )}
                {/* <section>
                  방장 {data.host_nickname} 외{" "}
                  {Object.keys(JSON.parse(data.mate_idx)).length - 1}명
                </section> */}
                <section>
                  모임 생성 날짜 {data.reg_time.replace("T", " ").slice(0, 16)}
                </section>
                {data.update_time === null ? (
                  <section>최근 수정 날짜 </section>
                ) : (
                  <section>
                    최근 수정 날짜{" "}
                    {data.update_time.replace("T", " ").slice(0, 16)}
                  </section>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function TripAddModal() {
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { loginUser } = React.useContext(StoreContext);
  const { matedata } = React.useContext(StoreContextMate);
  const [isSelectedname, SetisSelectedname] = React.useState("");
  const [selectlist, Setselectlist] = React.useState([]);

  const [title, setTitle] = React.useState("");
  const [inputcnt, setInputcnt] = React.useState("0");

  const valuechange = (event) => {
    const data = event.target.value;
    // console.log(data, data.length);
    if (data.length !== 21) {
      setInputcnt(data.length);
      setTitle(data);
    }
  };

  //친구 목록 데이터 받아오기
  const tripadd = async (props) => {
    // console.log(props.data);
    await axios({
      url: "http://localhost:5000/tripadd",
      method: "POST",
      data: props.data,
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          //폼 초기화
          setInputcnt("0");
          setTitle("");
          Setselectlist([]);
          setDispatchType({ code: "triplist" });
        }
      })
      .catch((e) => {
        console.log("여행 생성 오류!", e);
      });
  };

  return (
    <div className="tripadd">
      <div className="triptitle">
        <input
          type="text"
          placeholder="여행 타이틀"
          maxLength={20}
          value={title}
          onChange={valuechange}
        />
        <span>({inputcnt}/20자)</span>
      </div>
      <span>여행 메이트 선택</span>
      <div className="tripmate-container">
        <div className="matelistbox">
          <ul>
            {matedata.length === 0 ? (
              <li></li>
            ) : (
              matedata.map((data, index) => (
                <li
                  key={index}
                  className={`item ${
                    isSelectedname === index ? "true" : "false"
                  }`}
                  onClick={(e) => {
                    SetisSelectedname(index);
                    if (
                      isSelectedname === index &&
                      e.currentTarget.className === "item true"
                    ) {
                      SetisSelectedname("");
                    }
                  }}
                  onDoubleClick={() => {
                    // console.log("더블클릭댐", index, e.currentTarget);
                    const tmp = { ...matedata[index] };
                    if (selectlist.length === 0) {
                      Setselectlist((isSelectedname) => [
                        ...isSelectedname,
                        tmp,
                      ]);
                    } else if (selectlist.length > 0) {
                      const result = selectlist.filter((data, index) => {
                        return data.mem_idx2 === tmp.mem_idx2;
                      });
                      // console.log(result);
                      if (result.length === 0) {
                        //목록 추가
                        Setselectlist((isSelectedname) => [
                          ...isSelectedname,
                          tmp,
                        ]);
                      } else {
                        //목록 삭제
                        const result = selectlist.filter((data, index) => {
                          return data.mem_idx2 !== tmp.mem_idx2;
                        });
                        // console.log(result);
                        Setselectlist(result);
                      }
                    }
                  }}
                >
                  <span className="nickname">{data.mem_nickname}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="listarrow">
          <button
            className="mateselectbox"
            onClick={() => {
              //추가할 메이트 목록에 해당 메이트 추가
              // console.log(isSelectedname);
              const tmp = { ...matedata[isSelectedname] };
              if (isSelectedname !== "" && selectlist.length === 0) {
                Setselectlist((isSelectedname) => [...isSelectedname, tmp]);
              } else if (isSelectedname !== "" && selectlist.length > 0) {
                const result = selectlist.filter((data, index) => {
                  return data.mem_idx2 === tmp.mem_idx2;
                });
                if (result.length === 0) {
                  Setselectlist((isSelectedname) => [...isSelectedname, tmp]);
                }
              }
            }}
          >
            {"+"}
          </button>
          <button
            className="matedelbox"
            onClick={() => {
              //추가할 메이트 목록에 해당 메이트 제외
              // console.log(isSelectedname);
              const tmp = { ...matedata[isSelectedname] };
              if (isSelectedname !== "" && selectlist.length > 0) {
                const result = selectlist.filter((data, index) => {
                  return data.mem_idx2 !== tmp.mem_idx2;
                });
                // console.log(result);
                Setselectlist(result);
              }
            }}
          >
            {"-"}
          </button>
        </div>
        <div className="mateaddbox">
          <ul>
            {selectlist.length === 0 ? (
              <li></li>
            ) : (
              selectlist.map((data, index) => (
                <li key={index} className="item">
                  <span className="nickname">{data.mem_nickname}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <div className="tripadd_btn">
        <button
          onClick={() => {
            const now = new Date();
            const day =
              now.getFullYear() +
              "." +
              (now.getMonth() + 1) +
              "." +
              now.getDate() +
              " " +
              now.getHours() +
              ":" +
              now.getMinutes() +
              " 작성";

            let trip_data = {};
            let mate = {};
            const idx = loginUser.mem_idx;
            const nickname = loginUser.mem_nickname;
            //메이트 데이터 만들기
            mate[idx] = nickname;
            selectlist.map((data, index) => {
              mate[data.mem_idx2] = data.mem_nickname;
            });

            //여행 데이터 만들기
            if (title === "") {
              trip_data.title = day;
            } else {
              trip_data.title = title;
            }
            trip_data.host_idx = idx;
            trip_data.host_nickname = nickname;
            trip_data.mate_idx = mate;

            tripadd({ data: trip_data });
          }}
        >
          여행 추가
        </button>
      </div>
    </div>
  );
}

function TripDelModal() {
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { loginUser } = React.useContext(StoreContext);
  const { tripdata } = React.useContext(StoreContextTrip);

  const tripdelete = async (seq) => {
    await axios({
      url: "http://localhost:5000/tripdelete",
      method: "POST",
      data: {
        seq: seq,
      },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType({ code: "triplist" });
        }
      })
      .catch((e) => {
        console.log("여행 삭제 오류!", e);
      });
  };

  const tripexcept = async (seq) => {
    await axios({
      url: "http://localhost:5000/tripexcept",
      method: "POST",
      data: {
        seq: seq,
        idx: loginUser.mem_idx,
      },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType({ code: "triplist" });
        }
      })
      .catch((e) => {
        console.log("여행 삭제 오류!", e);
      });
  };

  return (
    <ul className="tripsetlist">
      {tripdata.length === 0 ? (
        <span>작성된 여행이 없습니다.</span>
      ) : (
        tripdata
          // .filter((data) => data.host_idx === loginUser.mem_idx)
          .map((data) =>
            data.host_idx === loginUser.mem_idx ? (
              <li key={data.seq} className="item">
                <span className="triptitle">{data.title}</span>
                <div>
                  <button
                    className="declinebtn"
                    onClick={() => {
                      tripdelete(data.seq);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ) : (
              <li key={data.seq} className="item">
                <span className="triptitle">{data.title}</span>
                <div>
                  <button
                    className="declinebtn"
                    onClick={() => {
                      tripexcept(data.seq);
                    }}
                  >
                    나가기
                  </button>
                </div>
              </li>
            )
          )
      )}
    </ul>
  );
}

function Modalcontainer() {
  const [modalOpen1, setModalOpen1] = React.useState(false);
  const [modalOpen2, setModalOpen2] = React.useState(false);

  return (
    <div>
      <span
        onClick={() => {
          setModalOpen1(true);
        }}
      >
        여행 만들기
      </span>
      <Modal
        open={modalOpen1}
        close={() => {
          setModalOpen1(false);
        }}
        header="여행 만들기"
      >
        <TripAddModal></TripAddModal>
      </Modal>
      <span
        onClick={() => {
          setModalOpen2(true);
        }}
      >
        여행 관리
      </span>
      <Modal
        open={modalOpen2}
        close={() => {
          setModalOpen2(false);
        }}
        header="여행 관리"
      >
        <TripDelModal></TripDelModal>
      </Modal>
    </div>
  );
}

const StoreContextDis = React.createContext({});
const StoreContextTrip = React.createContext({});
const StoreContextMate = React.createContext({});

function Mytrip() {
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
  /**
   * 전역 변수
   * 1. 로그인한 사용자의 친구 목록 matedata
   * 2. 로그인한 사용자의 여행 목록 tripdata
   */
  const [matedata, setMatedata] = React.useState([]);
  const [tripdata, setTripdata] = React.useState([]);

  React.useEffect(() => {
    세션정보가져오기();
  }, []);
  //로그인 세션 상태 새로고침 하면 실행
  React.useEffect(() => {
    if (loginUser.mem_userid !== undefined) {
      setState({ session: "마이페이지" });
      matelist();
      triplist();
    }
  }, [loginUser]);

  React.useEffect(() => {
    // console.log("Mymate dispatch 이펙트 실행");
    if (dispatch.code === "triplist") {
      triplist();
    }
  }, [dispatch]);

  //친구 목록 데이터 받아오기
  const matelist = async () => {
    await axios({
      url: "http://localhost:5000/matelist",
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          const tmp = [...data];
          console.log("친구 목록은?", tmp);
          setMatedata(tmp);
        }
      })
      .catch((e) => {
        console.log("메이트 목록 업데이트 오류!", e);
      });
  };

  //여행 목록 데이터 받아오기
  const triplist = async () => {
    await axios({
      url: "http://localhost:5000/triplist",
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === "success") {
          const tmp = [...data];
          console.log("여행 목록은?", tmp);
          setTripdata(tmp);
        }
      })
      .catch((e) => {
        console.log("여행 목록 업데이트 오류!", e);
      });
  };

  return (
    <StoreContextDis.Provider value={{ setDispatchType }}>
      <StoreContextMate.Provider value={{ matedata }}>
        <StoreContextTrip.Provider value={{ tripdata }}>
          <div className="container">
            <Menubar />
            <div className="contents-container">
              <div className="title">
                <span>나의 여행 계획</span>
                <Modalcontainer></Modalcontainer>
              </div>
              <Contents></Contents>
            </div>
          </div>
        </StoreContextTrip.Provider>
      </StoreContextMate.Provider>
    </StoreContextDis.Provider>
  );
}

export default Mytrip;
