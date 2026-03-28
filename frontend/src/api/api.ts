import axios from "axios";

export const API_BASE = "/api/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  withCredentials: true,
});

export default api;
