import React, { useContext, useState, useEffect, createContext } from "react";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
//import css
import "./Mytrip.css";
import "./MytripModal.css";
// import component
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";
import Loading from "../../component/Loading";
// import api
import { getUserInfo } from "../../api/My";
import { getMyMateList } from "../../api/Mymate";
import {
  getMyTripList,
  getMyTripAdd,
  getMyTripDelete,
  getMyTripExit,
  getMyTripUpdate,
} from "../../api/Mytrip";
// import context
import { SessionContext } from "../../App";

function TripAddModal() {
  const { loginUser } = useContext(userInfoContext);
  const { mytrip, fetchTripList } = useContext(TripContext);

  const [adddata, setAdddata] = useState({
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

    const { code, message } = await getMyTripAdd(trip_data);

    if (code === "success") {
      // 여행 목록 요청
      fetchTripList();

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
    }
  };

  //추가할 메이트 목록에 해당 메이트 추가
  const mateplusHandler = () => {
    const mateidx = mytrip.mate[adddata.isSelectedname].mem_idx;
    const nickname = mytrip.mate[adddata.isSelectedname].mem_nickname;
    const mate = [mateidx, nickname];

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

  //추가할 메이트 목록에 해당 메이트 제외
  const mateminusHandler = () => {
    const mateidx = mytrip.mate[adddata.isSelectedname].mem_idx;

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
          <ul>
            {mytrip.mate.length === 0 ? (
              <li></li>
            ) : (
              mytrip.mate.map((data, index) => (
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
                    const mateidx = mytrip.mate[index].mem_idx;
                    const nickname = mytrip.mate[index].mem_nickname;
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
function TripUpdateModal() {
  const { loginUser } = useContext(userInfoContext);
  const { mytrip, fetchTripList } = useContext(TripContext);
  const [modstate, setModstate] = useState({ code: false, data: {} });

  // 여행 삭제
  const TripDeleteHandler = async (seq) => {
    const { code, message } = await getMyTripDelete(seq);
    if (code === "success") fetchTripList();
  };

  // 여행 나가기
  const TripExitHandler = async (seq) => {
    const { code, message } = await getMyTripExit(seq, loginUser.mem_idx);
    if (code === "success") fetchTripList();
  };

  // 여행 수정 mode 핸들러
  const TripModopenHandler = (props) => {
    setModstate((prevState) => {
      return { ...prevState, code: true, data: { ...props.data } };
    });
  };

  // 여행 수정 컴포넌트
  const TripModModal = (props) => {
    const [adddata, setAdddata] = useState({
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

      const { code, message } = await getMyTripUpdate(trip_data);

      if (code === "success") {
        fetchTripList();
        //폼 초기화
        setModstate((prevState) => {
          return { ...prevState, code: false, data: {} };
        });
      }
    };

    //추가할 메이트 목록에 해당 메이트 추가
    const mateplusHandler = () => {
      const mateidx = mytrip.mate[adddata.isSelectedname].mem_idx;
      const nickname = mytrip.mate[adddata.isSelectedname].mem_nickname;
      const mate = [mateidx, nickname];

      if (adddata.isSelectedname !== "" && adddata.selectlist.length === 0) {
        setAdddata((prevState) => {
          return {
            ...prevState,
            selectlist: [...adddata.selectlist, mate],
          };
        });
      } else if (
        adddata.isSelectedname !== "" &&
        adddata.selectlist.length > 0
      ) {
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

    //추가할 메이트 목록에 해당 메이트 제외
    const mateminusHandler = () => {
      const mateidx = mytrip.mate[adddata.isSelectedname].mem_idx;

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
            <ul>
              {mytrip.mate.length === 0 ? (
                <li></li>
              ) : (
                mytrip.mate.map((data, index) => (
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
                      const mateidx = mytrip.mate[index].mem_idx;
                      const nickname = mytrip.mate[index].mem_nickname;
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
  };

  return (
    <div>
      {modstate.code ? (
        <div>
          <TripModModal data={modstate.data}></TripModModal>
        </div>
      ) : (
        <ul className="tripsetlist">
          {mytrip.trip.length === 0 ? (
            <span>작성된 여행이 없습니다.</span>
          ) : (
            mytrip.trip.map((data) =>
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
                        TripDeleteHandler(data.seq);
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
                        TripExitHandler(data.seq);
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
  );
}
function Modalcontainer() {
  const [modalOpen1, setModalOpen1] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);

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
function Contents() {
  const navigation = useNavigate();
  const { mytrip, fetchTripList } = useContext(TripContext);
  // pagenation 변수
  const cnt = 5;
  const [viewlist, setViewlist] = useState([]);
  const [curpage, setCurpage] = useState(1);
  const [pagelist, setPagelist] = useState({
    index: 0,
    list: [],
  });

  useEffect(() => {
    if (mytrip.trip.length > 0) {
      //총 페이지 계산
      const totalpage = Math.ceil(mytrip.trip.length / cnt);
      const array = PageListMakeHandler(totalpage);
      //현재 페이지가 총 페이지보다 뒤에 있으면 마지막 페이지로 set
      if (totalpage < curpage) {
        setCurpage(totalpage);
      }
      //인덱스가 삭제되고 -1 해주기
      if (pagelist.list.length > 0 && !pagelist.list[pagelist.index]) {
        setPagelist((prevState) => {
          return {
            ...prevState,
            index: pagelist.list.length - 1,
          };
        });
      }
      // 페이지 리스트 저장
      setPagelist((prevState) => {
        return {
          ...prevState,
          list: array,
        };
      });
    }
  }, [mytrip.trip]);

  let PageListMakeHandler = (totalpage) => {
    let array = [];
    let tmp = [];
    //페이지 리스트 만들기
    for (let i = 1; i <= totalpage; i++) {
      tmp.push(i);
      if (i % 5 === 0) {
        array.push(tmp);
        tmp = [];
      } else if (i === totalpage && tmp.length < 5) {
        array.push(tmp);
        tmp = [];
      }
    }
    return array;
  };

  useEffect(() => {
    //현재 페이지에 따라 보여줄 데이터 필터
    if (mytrip.trip.length > 0) {
      const start = curpage * cnt - cnt;
      const end = curpage * cnt - 1;
      const array = mytrip.trip.filter(
        (data, index) => index >= start && index <= end
      );
      setViewlist(array);
    }
  }, [curpage, mytrip.trip]);

  const FirstPageHandler = () => {
    //처음 페이지가 아닌 경우
    if (pagelist.index > 0) {
      setPagelist((prevState) => {
        return {
          ...prevState,
          index: 0,
        };
      });
    }
  };

  const LastPageHandler = () => {
    //마지막 페이지가 아닌 경우
    if (pagelist.index !== pagelist.list.length - 1) {
      setPagelist((prevState) => {
        return {
          ...prevState,
          index: pagelist.list.length - 1,
        };
      });
    }
  };

  const PrevPageHandler = () => {
    //처음 페이지가 아닌 경우
    if (pagelist.index > 0) {
      setPagelist((prevState) => {
        return {
          ...prevState,
          index: pagelist.index - 1,
        };
      });
    }
  };

  const NextPageHandler = () => {
    //마지막 페이지가 아닌 경우
    if (pagelist.index !== pagelist.list.length - 1) {
      setPagelist((prevState) => {
        return {
          ...prevState,
          index: pagelist.index + 1,
        };
      });
    }
  };

  return (
    <div className="content-mytrip">
      {mytrip.trip.length === 0 ? (
        <span>아직 작성된 여행이 없습니다! 여행 계획을 세워보세요!</span>
      ) : (
        <>
          <div className="mytriptitlebar">
            <span className="number">번호</span>
            <span className="triptitle">타이틀</span>
            <span className="host">방장</span>
            <span className="matecnt">참여</span>
            <span className="time1">생성 날짜</span>
            <span className="time2">수정 날짜</span>
          </div>
          <div className="triplistbox">
            <ul>
              {viewlist.map((data, index) => (
                <li
                  key={index}
                  className="item mytrip"
                  onClick={() => navigation(`/mytrip/${data.seq}`)}
                >
                  <span className="number">
                    {index + cnt * (curpage - 1) + 1}
                  </span>
                  <span className="triptitle">{data.title}</span>
                  <span className="host">{data.host_nickname}</span>
                  <span className="matecnt">
                    {Object.keys(JSON.parse(data.mate_idx)).length}명
                  </span>
                  <span className="time1">
                    {moment.tz(data.reg_time, "Asia/Seoul").format("YY-MM-DD")}
                  </span>
                  {!data.update_time ? (
                    <span className="time2"></span>
                  ) : (
                    <span className="time2">
                      {moment
                        .tz(data.update_time, "Asia/Seoul")
                        .format("YY-MM-DD")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="pagelistbox">
            <span className="tofirst" onClick={FirstPageHandler}>
              {"<<"}
            </span>
            <span className="toprev" onClick={PrevPageHandler}>
              {"<"}
            </span>
            <ul className="pagelist">
              {pagelist.list.length > 0 && (
                <>
                  {pagelist.list[pagelist.index] ? (
                    <>
                      {pagelist.list[pagelist.index].map((data, index) => (
                        <li
                          key={index}
                          className={data === curpage ? "item select" : "item"}
                          onClick={() => setCurpage(data)}
                        >
                          {data}
                        </li>
                      ))}
                    </>
                  ) : (
                    <>
                      {pagelist.list[pagelist.index - 1].map((data, index) => (
                        <li
                          key={index}
                          className={data === curpage ? "item select" : "item"}
                          onClick={() => setCurpage(data)}
                        >
                          {data}
                        </li>
                      ))}
                    </>
                  )}
                </>
              )}
            </ul>
            <span className="tonext" onClick={NextPageHandler}>
              {">"}
            </span>
            <span className="tolast" onClick={LastPageHandler}>
              {">>"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

const userInfoContext = createContext(null);
const TripContext = createContext(null);

function Mytrip() {
  const [loading, setLoading] = useState(null);
  //App에서 SessionContext 받아온 후 로그인세션 사용
  const { loginSession, setLoginSession } = useContext(SessionContext);
  const [loginUser, setLoginUser] = useState(null);
  const [mytrip, setMytrip] = useState({
    trip: null,
    mate: null,
  });

  // 로그인 세션에 따른 사용자 정보 저장
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoginUser(await getUserInfo());
    };

    if (loginSession) fetchUserInfo();
  }, [loginSession]);

  // 로그인 정보에 따른 여행 목록 요청
  useEffect(() => {
    if (loginUser) fetchTripList();
  }, [loginUser]);

  // 메이트 목록 요청 > 여행 목록 요청
  const fetchTripList = async () => {
    setLoading(true);

    const { code, mate } = await getMyMateList(loginUser.mem_idx);

    if (code === "success") {
      setMytrip((prevState) => {
        return {
          ...prevState,
          mate: mate,
        };
      });

      const { code, trip } = await getMyTripList(loginUser.mem_idx);

      if (code === "success") {
        setMytrip((prevState) => {
          return {
            ...prevState,
            trip: trip,
          };
        });
      }
    }

    setLoading(false);
  };

  return (
    <>
      {loading ? <Loading /> : null}
      {loginSession && loginUser && (
        <>
          <Menubar />
          <userInfoContext.Provider value={{ loginUser }}>
            <TripContext.Provider value={{ mytrip, fetchTripList }}>
              {mytrip.trip && mytrip.mate && (
                <div className="contents-container mytripcon">
                  <div className="title mytrip">
                    <span>나의 여행 계획</span>
                    <Modalcontainer></Modalcontainer>
                  </div>
                  <Contents></Contents>
                </div>
              )}
            </TripContext.Provider>
          </userInfoContext.Provider>
        </>
      )}
    </>
  );
}

export default Mytrip;
