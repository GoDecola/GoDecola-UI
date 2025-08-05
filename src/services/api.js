import axios from "axios";
import { baseURL } from "../utils/baseURL";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
