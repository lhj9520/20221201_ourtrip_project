import axios from "axios";
import { BASE_URL } from "../config";

axios.defaults.withCredentials = true;

// 유저 정보 요청
export const getUserInfo = async () => {
  try {
    const response = await axios(`${BASE_URL}/auth/userinfo`);

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

    return response.data;
  } catch (error) {
    console.error("비밀번호 변경 오류 :", error);
    return null;
  }
};
