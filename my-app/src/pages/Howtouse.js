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
        <div>이용방법페이지입니다.</div>
      </div>
    </>
  );
}

export default Howtouse;
