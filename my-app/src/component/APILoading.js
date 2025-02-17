import React from "react";
import { FadeLoader } from "react-spinners";
// import css
import "./APILoading.css";

const override = {
  display: "flex",
  margin: "0 auto",
  borderColor: "#4a8522",
  textAlign: "center",
};

const APILoading = ({ loading }) => {
  return (
    <div className="sareabackground">
      <FadeLoader
        color="#4a8522"
        loading={loading}
        cssOverride={override}
        size={150}
      />
    </div>
  );
};

export default APILoading;
