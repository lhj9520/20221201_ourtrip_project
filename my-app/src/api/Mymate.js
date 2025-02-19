import axios from "axios";
import { BASE_URL } from "../config";

axios.defaults.withCredentials = true;

// 메이트 목록 조회
export const getMyMateList = async (user_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/list`,
      method: "POST",
      data: { idx: user_idx },
    });

    return response.data;
  } catch (error) {
    console.error("메이트 목록 조회 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 목록 조회(요청 정보 포함)
export const getMyMateReqList = async (user_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/reqlist`,
      method: "POST",
      data: { idx: user_idx },
    });

    return response.data;
  } catch (error) {
    console.error("메이트 목록 조회 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 아이디 조회
export const getMateID = async (user_idx, mate_id) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/idfind`,
      method: "POST",
      data: {
        idx: user_idx,
        mateid: mate_id,
      },
    });

    return response.data;
  } catch (error) {
    console.error("메이트 아이디 조회 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 신청
export const getMateRequest = async (user_idx, mate_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/req`,
      method: "POST",
      data: {
        idx: user_idx,
        mateidx: mate_idx,
      },
    });

    return response.data;
  } catch (error) {
    console.error("메이트 신청 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 수락
export const getMateAccept = async (user_idx, mate_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/accept`,
      method: "POST",
      data: {
        idx: user_idx,
        mateidx: mate_idx,
      },
    });

    return response.data;
  } catch (error) {
    console.error("메이트 수락 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 거절
export const getMateDecline = async (user_idx, mate_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/decline`,
      method: "POST",
      data: {
        idx: user_idx,
        mateidx: mate_idx,
      },
    });

    return response.data;
  } catch (error) {
    console.error("메이트 거절 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 삭제
export const getMateDelete = async (user_idx, mate_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/delete`,
      method: "POST",
      data: {
        idx: user_idx,
        mateidx: mate_idx,
      },
    });

    return response.data;
  } catch (error) {
    console.error("메이트 삭제 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};
