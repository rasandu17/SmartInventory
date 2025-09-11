import axios from "axios";

const API_URL = "https://localhost:5001/api"; // .NET API

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default api;
