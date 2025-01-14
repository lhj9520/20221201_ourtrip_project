import axios from "axios";
import { BASE_URL } from "../config";

axios.defaults.withCredentials = true;

/**
 * 나의 여행 페이지
 */

// 여행 목록 리스트 조회
export const getMyTripList = async (useridx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/triplist`,
      method: "POST",
      data: { idx: useridx },
    });

    console.log("여행 목록 조회 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("여행 목록 조회 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 여행 추가
export const getMyTripAdd = async (trip_data) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/tripadd`,
      method: "POST",
      data: trip_data,
    });

    console.log("여행 추가 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("여행 추가 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 여행 삭제
export const getMyTripDelete = async (trip_seq) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/tripdelete`,
      method: "POST",
      data: {
        seq: trip_seq,
      },
    });

    console.log("여행 삭제 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("여행 삭제 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 여행 나가기
export const getMyTripExit = async (trip_seq, useridx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/tripexcept`,
      method: "POST",
      data: {
        seq: trip_seq,
        idx: useridx,
      },
    });

    console.log("여행 나가기 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("여행 나가기 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 여행 수정
export const getMyTripUpdate = async (trip_data) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/tripupdate`,
      method: "POST",
      data: trip_data,
    });

    console.log("여행 수정 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("여행 수정 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

/**
 * 나의 여행 상세 페이지
 */
