import React from "react";
import "./Create.css";
import logoimg from "../../img/logo_oco.png";

import { StoreContext } from "../../App";
import { useNavigate } from "react-router-dom";

function Create() {
  const navigation = useNavigate();

  const { loginUser } = React.useContext(StoreContext);

  return <div>모임생성페이지입니다.</div>;
}

export default Create;
