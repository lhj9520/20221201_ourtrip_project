import React from "react";
import axios from "axios";
import moment from "moment-timezone";
import "./Mytrip.css";
import "./MytripModal.css";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";

import { StoreContext, StoreContextM } from "../../App";
import { useNavigate } from "react-router-dom";

function Contents() {
  const navigation = useNavigate();
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
                    navigation(`/mytrip/plan/${data.seq}`);
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
  const { Mate } = React.useContext(StoreContextM);

  const [adddata, setAdddata] = React.useState({
    title: "",
    inputcnt: "0",
    isSelectedname: "",
    selectlist: [], //메이트 인덱스 저장
  });

  const valuechange = (event) => {
    const data = event.target.value;
    if (data.length <= 20) {
      setAdddata((prevState) => {
        return { ...prevState, title: data, inputcnt: data.length };
      });
    }
  };

  const TripAddHandler = async () => {
    console.log("모달데이터", adddata);

    let trip_data = {};
    let mate = {};

    //host_idx
    const idx = loginUser.mem_idx;
    const nickname = loginUser.mem_nickname;
    //메이트 데이터 만들기
    mate[idx] = nickname;
    adddata.selectlist.map((data, index) => {
      mate[data[0]] = data[1];
    });

    //여행 데이터 만들기
    if (adddata.title === "") {
      const newDate = moment
        .tz(new Date(), "Asia/Seoul")
        .format("YY-MM-DD HH:mm 작성");
      trip_data.title = newDate;
    } else {
      trip_data.title = adddata.title;
    }
    trip_data.host_idx = idx;
    trip_data.mate_idx = mate;

    console.log("여행데이터", trip_data);

    await axios({
      url: "http://localhost:5000/tripadd",
      method: "POST",
      data: trip_data,
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType({ code: "triplist" });
        }
        //폼 초기화
        setAdddata((prevState) => {
          return {
            ...prevState,
            title: "",
            inputcnt: "0",
            isSelectedname: "",
            selectlist: [],
          };
        });
      })
      .catch((e) => {
        console.log("여행 생성 오류!", e);
      });
  };

  const mateplusHandler = () => {
    //추가할 메이트 목록에 해당 메이트 추가
    const mateidx = Mate[adddata.isSelectedname].mem_idx2;
    const nickname = Mate[adddata.isSelectedname].mem_nickname;
    const mate = [mateidx, nickname];
    // mate[mateidx] = nickname;
    console.log(mate);

    if (adddata.isSelectedname !== "" && adddata.selectlist.length === 0) {
      setAdddata((prevState) => {
        return {
          ...prevState,
          selectlist: [...adddata.selectlist, mate],
        };
      });
    } else if (adddata.isSelectedname !== "" && adddata.selectlist.length > 0) {
      const result = adddata.selectlist.filter((data, index) => {
        return data[0] === mateidx;
      });
      if (result.length === 0) {
        setAdddata((prevState) => {
          return {
            ...prevState,
            selectlist: [...adddata.selectlist, mate],
          };
        });
      }
    }
  };
  const mateminusHandler = () => {
    //추가할 메이트 목록에 해당 메이트 제외
    const mateidx = Mate[adddata.isSelectedname].mem_idx2;

    if (adddata.isSelectedname !== "" && adddata.selectlist.length > 0) {
      const result = adddata.selectlist.filter((data, index) => {
        return data[0] !== mateidx;
      });
      setAdddata((prevState) => {
        return { ...prevState, selectlist: result };
      });
    }
  };

  return (
    <div className="tripadd">
      <div className="triptitle">
        <input
          type="text"
          placeholder="여행 타이틀"
          maxLength={20}
          value={adddata.title}
          onChange={valuechange}
        />
        <span>({adddata.inputcnt}/20자)</span>
      </div>
      <span>여행 메이트 선택</span>
      <div className="tripmate-container">
        <div className="matelistbox">
          {Mate && (
            <ul>
              {Mate.length === 0 ? (
                <li></li>
              ) : (
                Mate.map((data, index) => (
                  <li
                    key={index}
                    className={`item ${
                      adddata.isSelectedname === index ? "true" : "false"
                    }`}
                    onClick={(e) => {
                      setAdddata((prevState) => {
                        return { ...prevState, isSelectedname: index };
                      });
                      if (
                        adddata.isSelectedname === index &&
                        e.currentTarget.className === "item true"
                      ) {
                        setAdddata((prevState) => {
                          return { ...prevState, isSelectedname: "" };
                        });
                      }
                    }}
                    onDoubleClick={() => {
                      // const tmp = { ...Mate[index] };
                      const mateidx = Mate[index].mem_idx2;
                      const nickname = Mate[index].mem_nickname;
                      const mate = [mateidx, nickname];

                      if (adddata.selectlist.length === 0) {
                        setAdddata((prevState) => {
                          return {
                            ...prevState,
                            selectlist: [...adddata.selectlist, mate],
                          };
                        });
                      } else if (adddata.selectlist.length > 0) {
                        const result = adddata.selectlist.filter(
                          (data, index) => {
                            return data[0] === mateidx;
                          }
                        );
                        if (result.length === 0) {
                          //목록 추가
                          setAdddata((prevState) => {
                            return {
                              ...prevState,
                              selectlist: [...adddata.selectlist, mate],
                            };
                          });
                        } else {
                          //목록 삭제
                          const result = adddata.selectlist.filter(
                            (data, index) => {
                              return data[0] !== mateidx;
                            }
                          );
                          setAdddata((prevState) => {
                            return { ...prevState, selectlist: result };
                          });
                        }
                      }
                    }}
                  >
                    <span className="nickname">{data.mem_nickname}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <div className="listarrow">
          <button className="mateselectbox" onClick={mateplusHandler}>
            {"+"}
          </button>
          <button className="matedelbox" onClick={mateminusHandler}>
            {"-"}
          </button>
        </div>
        <div className="mateaddbox">
          <ul>
            {adddata.selectlist.length === 0 ? (
              <li></li>
            ) : (
              adddata.selectlist.map((data, index) => (
                <li key={index} className="item">
                  <span className="nickname">{data[1]}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <div className="tripadd_btn">
        <button onClick={TripAddHandler}>여행 추가</button>
      </div>
    </div>
  );
}

function TripModModal(props) {
  const { setModstate } = React.useContext(StoreContextMod);
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { loginUser } = React.useContext(StoreContext);
  const { Mate } = React.useContext(StoreContextM);

  const [adddata, setAdddata] = React.useState({
    title: props.data.title,
    inputcnt: props.data.title.length,
    isSelectedname: "",
    selectlist: Object.entries(JSON.parse(props.data.mate_idx)),
  });

  const valuechange = (event) => {
    const data = event.target.value;
    if (data.length <= 20) {
      setAdddata((prevState) => {
        return { ...prevState, title: data, inputcnt: data.length };
      });
    }
  };

  const TripModcloseHandler = () => {
    setModstate((prevState) => {
      return { ...prevState, code: false, data: {} };
    });
  };

  const TripModHandler = async () => {
    console.log("모달데이터", adddata);

    let trip_data = {};
    let mate = {};

    //trip seq
    trip_data.seq = props.data.seq;
    //host_idx
    const idx = loginUser.mem_idx;
    const nickname = loginUser.mem_nickname;
    //메이트 데이터 만들기
    mate[idx] = nickname;
    adddata.selectlist.map((data, index) => {
      mate[data[0]] = data[1];
    });

    //여행 데이터 만들기
    if (adddata.title === "") {
      const newDate = moment
        .tz(new Date(), "Asia/Seoul")
        .format("YY-MM-DD HH:mm 작성");
      trip_data.title = newDate;
    } else {
      trip_data.title = adddata.title;
    }
    trip_data.host_idx = idx;
    trip_data.mate_idx = mate;

    console.log("여행데이터", trip_data);

    setModstate((prevState) => {
      return { ...prevState, code: false, data: {} };
    });

    await axios({
      url: "http://localhost:5000/tripupdate",
      method: "POST",
      data: trip_data,
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType({ code: "triplist" });
        }
        //폼 초기화
        setModstate((prevState) => {
          return { ...prevState, code: false, data: {} };
        });
      })
      .catch((e) => {
        console.log("여행 생성 오류!", e);
      });
  };
  const mateplusHandler = () => {
    //추가할 메이트 목록에 해당 메이트 추가
    const mateidx = Mate[adddata.isSelectedname].mem_idx2;
    const nickname = Mate[adddata.isSelectedname].mem_nickname;
    const mate = [mateidx, nickname];
    // mate[mateidx] = nickname;
    console.log(mate);

    if (adddata.isSelectedname !== "" && adddata.selectlist.length === 0) {
      setAdddata((prevState) => {
        return {
          ...prevState,
          selectlist: [...adddata.selectlist, mate],
        };
      });
    } else if (adddata.isSelectedname !== "" && adddata.selectlist.length > 0) {
      const result = adddata.selectlist.filter((data, index) => {
        return data[0] == mateidx;
      });
      if (result.length === 0) {
        setAdddata((prevState) => {
          return {
            ...prevState,
            selectlist: [...adddata.selectlist, mate],
          };
        });
      }
    }
  };
  const mateminusHandler = () => {
    //추가할 메이트 목록에 해당 메이트 제외
    const mateidx = Mate[adddata.isSelectedname].mem_idx2;

    if (adddata.isSelectedname !== "" && adddata.selectlist.length > 0) {
      const result = adddata.selectlist.filter((data, index) => {
        return data[0] != mateidx;
      });
      setAdddata((prevState) => {
        return { ...prevState, selectlist: result };
      });
    }
  };

  return (
    <div className="tripadd">
      <div className="triptitle">
        <input
          type="text"
          placeholder="여행 타이틀"
          maxLength={20}
          value={adddata.title}
          onChange={valuechange}
        />
        <span>({adddata.inputcnt}/20자)</span>
      </div>
      <span>여행 메이트 선택</span>
      <div className="tripmate-container">
        <div className="matelistbox">
          {Mate && (
            <ul>
              {Mate.length === 0 ? (
                <li></li>
              ) : (
                Mate.map((data, index) => (
                  <li
                    key={index}
                    className={`item ${
                      adddata.isSelectedname === index ? "true" : "false"
                    }`}
                    onClick={(e) => {
                      setAdddata((prevState) => {
                        return { ...prevState, isSelectedname: index };
                      });
                      if (
                        adddata.isSelectedname === index &&
                        e.currentTarget.className === "item true"
                      ) {
                        setAdddata((prevState) => {
                          return { ...prevState, isSelectedname: "" };
                        });
                      }
                    }}
                    onDoubleClick={() => {
                      // const tmp = { ...Mate[index] };
                      const mateidx = Mate[index].mem_idx2;
                      const nickname = Mate[index].mem_nickname;
                      const mate = [mateidx, nickname];

                      if (adddata.selectlist.length === 0) {
                        setAdddata((prevState) => {
                          return {
                            ...prevState,
                            selectlist: [...adddata.selectlist, mate],
                          };
                        });
                      } else if (adddata.selectlist.length > 0) {
                        const result = adddata.selectlist.filter(
                          (data, index) => {
                            return data[0] == mateidx;
                          }
                        );
                        if (result.length === 0) {
                          //목록 추가
                          setAdddata((prevState) => {
                            return {
                              ...prevState,
                              selectlist: [...adddata.selectlist, mate],
                            };
                          });
                        } else {
                          //목록 삭제
                          const result = adddata.selectlist.filter(
                            (data, index) => {
                              return data[0] != mateidx;
                            }
                          );
                          setAdddata((prevState) => {
                            return { ...prevState, selectlist: result };
                          });
                        }
                      }
                    }}
                  >
                    <span className="nickname">{data.mem_nickname}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <div className="listarrow">
          <button className="mateselectbox" onClick={mateplusHandler}>
            {"+"}
          </button>
          <button className="matedelbox" onClick={mateminusHandler}>
            {"-"}
          </button>
        </div>
        <div className="mateaddbox">
          <ul>
            {adddata.selectlist.length === 0 ? (
              <li></li>
            ) : (
              adddata.selectlist.map((data, index) => (
                <li key={index} className="item">
                  <span className="nickname">
                    {data[1] !== loginUser.mem_nickname && data[1]}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <div className="tripadd_btn">
        <button onClick={TripModHandler} className="small first">
          확인
        </button>
        <button onClick={TripModcloseHandler} className="small">
          취소
        </button>
      </div>
    </div>
  );
}
function TripUpdateModal() {
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { loginUser } = React.useContext(StoreContext);
  const { tripdata } = React.useContext(StoreContextTrip);

  const [modstate, setModstate] = React.useState({ code: false, data: {} });

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

  const TripModopenHandler = (props) => {
    console.log(props.data.seq, "번째글수정");
    setModstate((prevState) => {
      return { ...prevState, code: true, data: { ...props.data } };
    });
  };

  return (
    <StoreContextMod.Provider value={{ setModstate }}>
      <div>
        {modstate.code ? (
          <div>
            <TripModModal data={modstate.data}></TripModModal>
          </div>
        ) : (
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
                          className="updatebtn"
                          onClick={() => TripModopenHandler({ data: data })}
                        >
                          수정
                        </button>
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
        )}
      </div>
    </StoreContextMod.Provider>
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
        <TripUpdateModal></TripUpdateModal>
      </Modal>
    </div>
  );
}

const StoreContextDis = React.createContext({});
const StoreContextTrip = React.createContext({});
const StoreContextMod = React.createContext({});

function Mytrip() {
  const navigation = useNavigate();

  //App에서 StoreContext 받아온 후 로그인세션 사용
  const { loginUser } = React.useContext(StoreContext);
  // const { Mate } = React.useContext(StoreContextM);

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
  const [tripdata, setTripdata] = React.useState([]);

  //로그인 세션 상태 새로고침 하면 실행
  React.useEffect(() => {
    if (loginUser) {
      setState({ session: "마이페이지" });
      triplist();
    }
  }, [loginUser]);

  React.useEffect(() => {
    if (dispatch.code === "triplist") {
      triplist();
    }
  }, [dispatch]);

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
    </StoreContextDis.Provider>
  );
}

export default Mytrip;
