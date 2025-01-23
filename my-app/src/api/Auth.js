import axios from "axios";
import { BASE_URL } from "../config";

axios.defaults.withCredentials = true;

/**
 * 로그인/로그인세션/회원탈퇴
 */

// 로그인 요청
export const getLogin = async (user_id, user_pw) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/auth/login`,
      method: "POST",
      data: {
        id: user_id,
        pw: user_pw,
      },
    });

    console.log("로그인 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 로그인 세션 확인
export const getLoginSession = async () => {
  try {
    const response = await axios(`${BASE_URL}/auth/authcheck`);
    console.log("로그인 세션 : ", response.data.isLogin);

    return response.data.isLogin;
  } catch (error) {
    console.error("로그인 세션 가져오기 실패:", error);
    return false;
  }
};

// 로그아웃 요청
export const getLogout = async () => {
  try {
    const response = await axios(`${BASE_URL}/auth/logout`);
    console.log("로그아웃 세션 : ", response.data.isLogin);
    return response.data.isLogin;
  } catch (error) {
    console.error("로그아웃 실패 :", error);
    return false;
  }
};

// 회원 탈퇴 요청
export const getWithdrawal = async (user_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/auth/withdrawalreq`,
      method: "POST",
      data: { idx: user_idx },
    });
    console.log("회원 탈퇴 세션 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("회원 탈퇴 실패 :", error);
    return null;
  }
};

/**
 * 회원가입
 */

// 유저 이메일 인증코드 전송
export const getEmailcode = async (params) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/auth/mail`,
      method: "POST",
      data: params,
    });

    console.log("이메일 인증코드 전송 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("이메일 인증코드 전송 오류 :", error);
    return null;
  }
};

// 유저 아이디 중복검사
export const getDuplicateID = async (join_id) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/dupcheck/id`,
      method: "POST",
      data: { id: join_id },
    });

    console.log("아이디 중복검사 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("아이디 중복검사 오류 :", error);
    return null;
  }
};

// 유저 닉네임 중복검사
export const getDuplicateNickname = async (join_nickname) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/dupcheck/nickname`,
      method: "POST",
      data: { nickname: join_nickname },
    });

    console.log("닉네임 중복검사 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("닉네임 중복체크 오류 :", error);
    return null;
  }
};

// 유저 이메일 중복검사
export const getDuplicateEmail = async (join_email) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/dupcheck/email`,
      method: "POST",
      data: { email: join_email },
    });

    console.log("이메일 중복검사 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("이메일 중복검사 오류 :", error);
    return null;
  }
};

// 회원가입 요청
export const getJoin = async (params) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/auth/join`,
      method: "POST",
      data: params,
    });

    console.log("회원가입 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("회원가입 오류 :", error);
    return null;
  }
};

/**
 * 유저 아이디, 비밀번호 찾기
 */

// 아이디 찾기
export const getFindID = async (params) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/auth/findid`,
      method: "POST",
      data: params,
    });

    console.log("유저 아이디 찾기 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("유저 아이디 찾기 오류 :", error);
    return null;
  }
};

// 비밀번호 찾기
export const getFindPW = async (params) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/auth/findpw`,
      method: "POST",
      data: params,
    });

    console.log("유저 비밀번호 찾기 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("유저 비밀번호 찾기 오류 :", error);
    return null;
  }
};

// 비밀번호 변경
export const getChangePW = async (params) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/auth/pwdchange`,
      method: "POST",
      data: params,
    });

    console.log("유저 비밀번호 찾기 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("유저 비밀번호 찾기 오류 :", error);
    return null;
  }
};
