import axios from "axios"

export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export default API;