import React from "react";
import axios from "axios";
import moment from "moment-timezone";
import "./Mytrip.css";
import "./MytripModal.css";
import Menubar from "../../component/menubar";
import Modal from "../../component/modal";
import useDidMountEffect from "../../utils/useDidMountEffect";
import Loading from "../../component/Loading";
import { SessionContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";

function TripAddModal() {
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { loginUser } = React.useContext(SessionContext);
  const { mytrip } = React.useContext(StoreContextTrip);

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
      const newDate = moment.tz(new Date(), "Asia/Seoul").format("YY-MM-DD HH:mm 작성");
      trip_data.title = newDate;
    } else {
      trip_data.title = adddata.title;
    }
    trip_data.host_idx = idx;
    trip_data.mate_idx = mate;

    await axios({
      url: `${BASE_URL}/mytrip/tripadd`,
      method: "POST",
      data: trip_data,
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType({ code: "refresh" });
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
  const mateminusHandler = () => {
    //추가할 메이트 목록에 해당 메이트 제외
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
        <input type="text" placeholder="여행 타이틀" maxLength={20} value={adddata.title} onChange={valuechange} />
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
                  className={`item ${adddata.isSelectedname === index ? "true" : "false"}`}
                  onClick={(e) => {
                    setAdddata((prevState) => {
                      return { ...prevState, isSelectedname: index };
                    });
                    if (adddata.isSelectedname === index && e.currentTarget.className === "item true") {
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
                      const result = adddata.selectlist.filter((data, index) => {
                        return data[0] === mateidx;
                      });
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
                        const result = adddata.selectlist.filter((data, index) => {
                          return data[0] !== mateidx;
                        });
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
function TripModModal(props) {
  const { setModstate } = React.useContext(StoreContextMod);
  const { setDispatchType } = React.useContext(StoreContextDis);
  const { loginUser } = React.useContext(SessionContext);
  const { mytrip } = React.useContext(StoreContextTrip);

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
      const newDate = moment.tz(new Date(), "Asia/Seoul").format("YY-MM-DD HH:mm 작성");
      trip_data.title = newDate;
    } else {
      trip_data.title = adddata.title;
    }
    trip_data.host_idx = idx;
    trip_data.mate_idx = mate;

    setModstate((prevState) => {
      return { ...prevState, code: false, data: {} };
    });

    await axios({
      url: `${BASE_URL}/mytrip/tripupdate`,
      method: "POST",
      data: trip_data,
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType({ code: "refresh" });
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
        <input type="text" placeholder="여행 타이틀" maxLength={20} value={adddata.title} onChange={valuechange} />
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
                  className={`item ${adddata.isSelectedname === index ? "true" : "false"}`}
                  onClick={(e) => {
                    setAdddata((prevState) => {
                      return { ...prevState, isSelectedname: index };
                    });
                    if (adddata.isSelectedname === index && e.currentTarget.className === "item true") {
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
                      const result = adddata.selectlist.filter((data, index) => {
                        return data[0] == mateidx;
                      });
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
                        const result = adddata.selectlist.filter((data, index) => {
                          return data[0] != mateidx;
                        });
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
                  <span className="nickname">{data[1] !== loginUser.mem_nickname && data[1]}</span>
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
  const { loginUser } = React.useContext(SessionContext);
  const { mytrip } = React.useContext(StoreContextTrip);
  const [modstate, setModstate] = React.useState({ code: false, data: {} });

  const tripdelete = async (seq) => {
    await axios({
      url: `${BASE_URL}/mytrip/tripdelete`,
      method: "POST",
      data: {
        seq: seq,
      },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType({ code: "refresh" });
        }
      })
      .catch((e) => {
        console.log("여행 삭제 오류!", e);
      });
  };

  const tripexcept = async (seq) => {
    await axios({
      url: `${BASE_URL}/mytrip/tripexcept`,
      method: "POST",
      data: {
        seq: seq,
        idx: loginUser.mem_idx,
      },
    })
      .then((res) => {
        const { code } = res.data;
        if (code === "success") {
          setDispatchType({ code: "refresh" });
        }
      })
      .catch((e) => {
        console.log("여행 삭제 오류!", e);
      });
  };

  const TripModopenHandler = (props) => {
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
            {mytrip.trip.length === 0 ? (
              <span>작성된 여행이 없습니다.</span>
            ) : (
              mytrip.trip.map((data) =>
                data.host_idx === loginUser.mem_idx ? (
                  <li key={data.seq} className="item">
                    <span className="triptitle">{data.title}</span>
                    <div>
                      <button className="updatebtn" onClick={() => TripModopenHandler({ data: data })}>
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
  const { mytrip } = React.useContext(StoreContextTrip);

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
        {mytrip.mate && <TripAddModal></TripAddModal>}
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
        {mytrip.mate && <TripUpdateModal></TripUpdateModal>}
      </Modal>
    </div>
  );
}
function Contents() {
  const navigation = useNavigate();
  const { mytrip } = React.useContext(StoreContextTrip);
  const cnt = 5;

  const [viewlist, setViewlist] = React.useState([]);
  const [curpage, setCurpage] = React.useState(1);
  const [pagelist, setPagelist] = React.useState({
    index: 0,
    list: [],
  });

  React.useEffect(() => {
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

  React.useEffect(() => {
    //현재 페이지에 따라 보여줄 데이터 필터
    if (mytrip.trip.length > 0) {
      const start = curpage * cnt - cnt;
      const end = curpage * cnt - 1;
      const array = mytrip.trip.filter((data, index) => index >= start && index <= end);
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
                <li key={index} className="item mytrip" onClick={() => navigation(`/mytrip/${data.seq}`)}>
                  <span className="number">{index + cnt * (curpage - 1) + 1}</span>
                  <span className="triptitle">{data.title}</span>
                  <span className="host">{data.host_nickname}</span>
                  {Object.keys(JSON.parse(data.mate_idx)).length === 1 ? (
                    <span className="matecnt">1명</span>
                  ) : (
                    <span className="matecnt">{Object.keys(JSON.parse(data.mate_idx)).length}명</span>
                  )}
                  <span className="time1">{moment.tz(data.reg_time, "Asia/Seoul").format("YY-MM-DD")}</span>
                  {!data.update_time ? (
                    <span className="time2"></span>
                  ) : (
                    <span className="time2">{moment.tz(data.update_time, "Asia/Seoul").format("YY-MM-DD")}</span>
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

const StoreContextDis = React.createContext({});
const StoreContextTrip = React.createContext({});
const StoreContextMod = React.createContext({});

function Mytrip() {
  const navigation = useNavigate();
  const { loginUser } = React.useContext(SessionContext);

  const [mytrip, setMytrip] = React.useState({
    trip: null,
    mate: null,
  });

  const [dispatch, setDispatchType] = React.useState({
    code: null,
    params: null,
  });

  const [loading, setLoading] = React.useState(null);

  React.useEffect(() => {
    if (loginUser.session === "none") {
      navigation("/login", { replace: true });
    } else if (Object.keys(loginUser).length > 1) {
      MyTripListHandler();
      MyMateListHandler();
    }
  }, [loginUser]);

  useDidMountEffect(() => {
    if (dispatch.code === "refresh") {
      MyTripListHandler();
      MyMateListHandler();
    }
  }, [dispatch]);

  //여행 목록 데이터 받아오기
  const MyTripListHandler = async () => {
    setLoading(true);
    await axios({
      url: `${BASE_URL}/mytrip/triplist`,
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, trip } = res.data;
        if (code === "success") {
          setMytrip((prevState) => {
            return {
              ...prevState,
              trip: trip,
            };
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log("여행 목록 업데이트 오류!", e);
      });
  };
  const MyMateListHandler = async () => {
    setLoading(true);
    await axios({
      url: `${BASE_URL}/mymate/list`,
      method: "POST",
      data: { idx: loginUser.mem_idx },
    })
      .then((res) => {
        const { code, mate } = res.data;
        if (code === "success") {
          setMytrip((prevState) => {
            return {
              ...prevState,
              mate: mate,
            };
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log("메이트 목록 업데이트 오류!", e);
      });
  };

  return (
    <>
      {loading ? <Loading /> : null}
      {Object.keys(loginUser).length > 1 && (
        <StoreContextDis.Provider value={{ setDispatchType }}>
          <StoreContextTrip.Provider value={{ mytrip }}>
            <Menubar />
            {mytrip.trip && mytrip.mate && (
              <div className="contents-container mytripcon">
                <div className="title mytrip">
                  <span>나의 여행 계획</span>
                  <Modalcontainer></Modalcontainer>
                </div>
                <Contents></Contents>
              </div>
            )}
          </StoreContextTrip.Provider>
        </StoreContextDis.Provider>
      )}
    </>
  );
}

export default Mytrip;
