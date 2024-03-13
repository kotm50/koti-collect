import axios from "axios";
import { store } from "../Reducer/store"; // 스토어 가져오기
import { getNewToken } from "../Reducer/userSlice";

const axiosInstance = axios.create();

const refreshAccessToken = async () => {
  // 토큰 갱신 로직
  const { user } = store.getState();
  //console.log("현재토큰", user.accessToken);
  const response = await axios.post("/api/v1/user/get/point", null, {
    headers: { Authorization: user.accessToken },
  });
  //console.log(response);
  const newAccessToken = response.headers.authorization;
  //console.log("갱신토큰", newAccessToken);

  if (newAccessToken && newAccessToken !== user.accessToken) {
    store.dispatch(getNewToken({ accessToken: newAccessToken }));
    return newAccessToken;
  }

  return user.accessToken;
};

axiosInstance.interceptors.request.use(async config => {
  //console.log("수정전", config.headers.Authorization);
  const { user } = store.getState();
  let accessToken = user.accessToken;

  // 토큰 만료 여부를 확인하고 필요에 따라 갱신
  accessToken = await refreshAccessToken();

  config.headers.Authorization = `${accessToken}`;
  //console.log("수정후", config.headers.Authorization);
  return config;
});

export default axiosInstance;
