import axios from "axios";
import qs from "qs";
import React from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";

function KakaoLogin() {
  const code = new URL(window.location.href).searchParams.get("code");

  const navigatioin = useNavigate();

  const getKAKAO = async () => {
    const data = qs.stringify({
      grant_type: "authorization_code",
      client_id: process.env.REACT_APP_KAKAO_RESTAPI_KEY,
      redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
      code: code,
    });
    console.log(data);

    // const result = await axios({
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    //   },
    //   url: "https://kauth.kakao.com/oauth/token",
    //   data: data,
    //   code: code,
    // }).then((res) => {
    //   console.log(res);
    // });

    $.ajax({
      async: false,
      type: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      data: {
        grant_type: "authorization_code",
        client_id: process.env.REACT_APP_KAKAO_RESTAPI_KEY,
        redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
        code: code,
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded;charset=utf-8"
        );
      },
      success: function (res) {
        console.log("jquery");
        console.log(res);

        // kakao Javascript SDK 초기화
        window.Kakao.init(process.env.REACT_APP_KAKAO_RESTAPI_KEY);
        window.Kakao.Auth.setAccessToken(res.access_token);
      },
    });

    const kakaoData = await window.Kakao.API.request({
      url: "/v2/user/me",
    });
    console.log("정보불러오기", kakaoData);
    /**
     * 1.
     *  - 우리 Node.js 호출 !
     *  - kakaData 넣어주기~
     * 2.
     *  - LocalStorage 사용
     * 3.
     *  - 전역변수 설정 LoginUser !
     */

    // navigatioin("/");
  };

  React.useEffect(() => {
    getKAKAO();
  }, []);

  return <div>카카오데이터받는곳</div>;
}

export default KakaoLogin;
