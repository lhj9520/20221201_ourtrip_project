import React from "react";
import "./Howtouse.css";
import Menubar from "../component/menubar";

import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";

function Howtouse() {
  const navigation = useNavigate();

  return (
    <>
      <Menubar />
      <div className="contents-container">
        <section className="use">
          <span>나의 여행 메이트가 되어줘!</span>
        </section>
        <section className="use">
          <span>같이 여행 갈 사람~?</span>
        </section>
        <section className="use">
          <span>그래서 우리 어디로 여행갈까?</span>
        </section>
      </div>
    </>
  );
}

export default Howtouse;
