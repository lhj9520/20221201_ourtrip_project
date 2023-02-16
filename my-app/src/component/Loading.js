import React from "react";
import { FadeLoader } from "react-spinners";
import "./Loading.css";

const override = {
  display: "flex",
  margin: "0 auto",
  borderColor: "#4a8522",
  textAlign: "center",
};

const Loading = ({ loading }) => {
  return (
    <div className="background">
      <FadeLoader
        color="#4a8522"
        loading={loading}
        cssOverride={override}
        size={150}
      />
    </div>
  );
};

export default Loading;
