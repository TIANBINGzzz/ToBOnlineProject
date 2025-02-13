import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 20 * 1000,
});

instance.interceptors.request.use(
  (config) => {

    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  (response) => {

    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error("Error:", error.response.data.message || "请求失败");
    }
    return Promise.reject(error);
  }
);

export const get = (url, params) => instance.get(url, { params });
export const delete1 = (url, params) => instance.delete(url, { params });
export const post = (url, data) => {
  return instance.post(url, data);
};

export default instance;
