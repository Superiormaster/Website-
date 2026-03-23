// src/services/api.js
import axios from "axios"
import { getToken } from "../utils/auth"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000",
  timeout: 30000,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getToken(); // getToken from auth.js
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle unauthorized globally (NO REDIRECT HERE)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("Axios response error:", error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error("Axios no response:", error.request);
    } else {
      // Something else triggered error
      console.error("Axios config error:", error.message);
    }
    return Promise.reject(error);
  }
)

export default api