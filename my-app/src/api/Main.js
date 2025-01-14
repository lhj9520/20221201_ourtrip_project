import axios from "axios";
import { BASE_URL } from "../config";

axios.defaults.withCredentials = true;

export const getTourResourceAPI = async (sido, gungu) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/datareq/list`,
      method: "GET",
      params: {
        sido: sido,
        gungu: gungu,
      },
    });

    console.log("관광정보 api 호출 : ", response.data);

    return response.data;
  } catch (error) {
    console.error("관광정보 api 호출 :", error);
    return null;
  }
};
