import axios from "axios";
import { BASE_URL } from "../config";

axios.defaults.withCredentials = true;

// 유저 정보 요청
export const getUserInfo = async () => {
  try {
    const response = await axios(`${BASE_URL}/auth/userinfo`);

    console.log("유저 정보 세션 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("사용자 정보 오류 :", error);
    return null;
  }
};

// 유저 닉네임 변경
export const getUpdateNickname = async (user_idx, user_nextnickname) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/updateuser/nickname`,
      method: "POST",
      data: { idx: user_idx, nickname: user_nextnickname },
    });

    console.log("닉네임 변경 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("닉네임 변경 오류 :", error);
    return null;
  }
};

// 유저 이메일 변경
export const getUpdateEmail = async (user_idx, user_nextemail) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/updateuser/email`,
      method: "POST",
      data: { idx: user_idx, email: user_nextemail },
    });

    console.log("이메일 변경 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("이메일 변경 오류 :", error);
    return null;
  }
};

// 유저 이름 변경
export const getUpdateName = async (user_idx, user_nextname) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/updateuser/name`,
      method: "POST",
      data: { idx: user_idx, username: user_nextname },
    });

    console.log("이름 변경 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("이름 변경 오류 :", error);
    return null;
  }
};

// 유저 핸드폰 번호 변경
export const getUpdatePhone = async (user_idx, user_nextphone) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/updateuser/phone`,
      method: "POST",
      data: { idx: user_idx, phone: user_nextphone },
    });

    console.log("전화번호 변경 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("전화번호 변경 오류 :", error);
    return null;
  }
};

// 유저 비밀번호 확인
export const getCheckPassword = async (user_idx, user_currentpw) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/updateuser/pwdcheck`,
      method: "POST",
      data: { idx: user_idx, curpwd: user_currentpw },
    });

    console.log("비밀번호 변경 확인 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("비밀번호 변경 확인 오류 :", error);
    return null;
  }
};

// 유저 비밀번호 변경
export const getUpdatePassword = async (user_idx, user_nextpw) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/auth/pwdchange`,
      method: "POST",
      data: { idx: user_idx, modpwd: user_nextpw },
    });

    console.log("비밀번호 변경 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("비밀번호 변경 오류 :", error);
    return null;
  }
};
