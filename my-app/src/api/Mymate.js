import axios from "axios";
import { BASE_URL } from "../config";

axios.defaults.withCredentials = true;

// 메이트 목록 조회
export const getMyMateList = async (useridx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/reqlist`,
      method: "POST",
      data: { idx: useridx },
    });

    console.log("메이트 목록 조회 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("메이트 목록 조회 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 아이디 조회
export const getMateID = async (useridx, mateid) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/idfind`,
      method: "POST",
      data: {
        idx: useridx,
        mateid: mateid,
      },
    });

    console.log("메이트 아이디 조회 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("메이트 아이디 조회 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 신청
export const getMateRequest = async (useridx, mateidx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/req`,
      method: "POST",
      data: {
        idx: useridx,
        mateidx: mateidx,
      },
    });

    console.log("메이트 신청 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("메이트 신청 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 수락
export const getMateAccept = async (useridx, mateidx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/accept`,
      method: "POST",
      data: {
        idx: useridx,
        mateidx: mateidx,
      },
    });

    console.log("메이트 수락 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("메이트 수락 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 거절
export const getMateDecline = async (useridx, mateidx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/decline`,
      method: "POST",
      data: {
        idx: useridx,
        mateidx: mateidx,
      },
    });

    console.log("메이트 거절 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("메이트 거절 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 메이트 삭제
export const getMateDelete = async (useridx, mateidx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mymate/delete`,
      method: "POST",
      data: {
        idx: useridx,
        mateidx: mateidx,
      },
    });

    console.log("메이트 삭제 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("메이트 삭제 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};
