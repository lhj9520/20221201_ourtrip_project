import React from "react";
import "./Howtouse.css";
import Menubar from "../component/menubar";
import mymatevideo from "../video/mymate.mp4";
import mytripvideo from "../video/mytrip.mp4";
import tripvideo1 from "../video/createtrip.mp4";
import tripvideo2 from "../video/modifytrip.mp4";

function Howtouse() {
  return (
    <>
      <Menubar />
      <div className="contents-container">
        <section className="use">
          <div className="explainbox">
            <h1>1. 메이트 신청</h1>
            <span>함께 여행 계획을 세우려면 여행 메이트가 필요하겠죠!</span>
            <br />
            <span>아이디를 입력하여 메이트 신청을 해보세요.</span>
          </div>
          <div className="videobox">
            <video autoPlay loop muted playsInline width="450px" height="250px">
              <source src={mymatevideo} type="video/mp4" />
            </video>
          </div>
        </section>
        <section className="use">
          <div className="videobox">
            <video autoPlay loop muted playsInline width="450px" height="250px">
              <source src={mytripvideo} type="video/mp4" />
            </video>
          </div>
          <div className="explainbox">
            <h1>2. 여행 만들기</h1>
            <span>함께 여행 할 메이트를 선택하여 여행을 만들어보세요.</span>
            <br />
            <span>혼자만의 여행도 가능하답니다.</span>
          </div>
        </section>
        <section className="use">
          <div className="explainbox">
            <h1>3. 타임라인 작성하기</h1>
            <span>여행을 계획하고 나만의 타임라인을 작성해보세요.</span>
            <br />
            <span>
              일정 선택, 장소 추가 및 삭제, 날짜별 목록을 확인하실 수 있습니다.
            </span>
          </div>
          <div className="videobox">
            <video autoPlay loop muted playsInline width="450px" height="250px">
              <source src={tripvideo1} type="video/mp4" />
            </video>
          </div>
        </section>
        <section className="use">
          <div className="videobox">
            <video autoPlay loop muted playsInline width="450px" height="250px">
              <source src={tripvideo2} type="video/mp4" />
            </video>
          </div>
          <div className="explainbox">
            <h1>4. 타임라인 수정하기</h1>
            <span>자신이 작성한 타임라인은 수정이 가능합니다.</span>
            <br />
            <span>함께 여행 할 메이트와 타임라인을 공유할 수 있습니다.</span>
          </div>
        </section>
      </div>
    </>
  );
}

export default Howtouse;
