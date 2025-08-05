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
      console.log("Token enviado:", token);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Headers da requisição:", config.headers); // Debug
    } else {
      console.log("Nenhum token encontrado no localStorage"); // Debug
    }

    return config;
  },
  (error) => {
    console.error("Erro no interceptor:", error);
    return Promise.reject(error);
  }
);

export default api;
