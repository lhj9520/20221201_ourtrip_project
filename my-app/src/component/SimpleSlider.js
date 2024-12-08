import React, { Component } from "react";
import Slider from "react-slick";
import img1 from "../img/tour_set_2.jpg";
import img2 from "../img/tr_vi_8.jpg";
import TypingText from "./TypingText";

export default class CustomArrows extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div className="sliderbox">
        <Slider {...settings}>
          <div className="imgitem first">
            <img src={img1} alt="기본이미지" />
            <TypingText text="우리의 여행은 우리가 함께" fontSize="3.8rem" color="#db6d86" />
          </div>
          <div className="imgitem second">
            <img src={img2} alt="기본이미지" />
          </div>
        </Slider>
      </div>
    );
  }
}
