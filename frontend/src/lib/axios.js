// import axios from "axios";
// const BASE_URL = import.meta.env.VITE_API_URL;
// export const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api"
  : "/api"; // same-origin in production now, proxied by Vercel to Render

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


// import axios from "axios";
// const BASE_URL = "http://localhost:5000/api";
// export const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });