import axios from "axios";
import { BASE_URL } from "../config";

axios.defaults.withCredentials = true;

/**
 * 나의 여행 페이지
 */

// 여행 목록 리스트 조회
export const getMyTripList = async (user_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/triplist`,
      method: "POST",
      data: { idx: user_idx },
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
export const getMyTripExit = async (trip_seq, user_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/tripexcept`,
      method: "POST",
      data: {
        seq: trip_seq,
        idx: user_idx,
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

// 여행 정보 조회
export const getMyTripInfo = async (trip_seq, user_idx) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/planlist`,
      method: "POST",
      data: { seq: trip_seq, idx: user_idx },
    });

    console.log("여행 상세 정보 조회 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("여행 상세 정보 조회 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 여행 제목 수정
export const getMyTripTitleUpdate = async (trip_seq, trip_title) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/triptitlechange`,
      method: "POST",
      data: { seq: trip_seq, title: trip_title },
    });

    console.log("여행 타이틀 수정 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("여행 타이틀 수정 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 타임라인 추가
export const getMyTimeLineAdd = async (timeline_data) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/timelineadd`,
      method: "POST",
      data: timeline_data,
    });

    console.log("타임라인 추가 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("타임라인 추가 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 타임라인 수정
export const getMyTimeLineUpdate = async (timeline_data) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/timelineupdate`,
      method: "POST",
      data: timeline_data,
    });

    console.log("타임라인 수정 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("타임라인 수정 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};

// 타임라인 삭제
export const getMyTimeLineDelete = async (timeline_seq) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/mytrip/timelinedelete`,
      method: "POST",
      data: {
        seq: timeline_seq,
      },
    });

    console.log("타임라인 삭제 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("타임라인 삭제 실패 :", error);
    return { code: "error", message: "axios error", redirect: "" };
  }
};
