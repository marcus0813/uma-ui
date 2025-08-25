import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACK_END_API;

export const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 5000,
});
