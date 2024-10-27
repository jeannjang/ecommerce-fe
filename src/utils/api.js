import axios from "axios";

const LOCAL_BACKEND =
  process.env.REACT_APP_LOCAL_BACKEND || "http://localhost:5010/api";
// const PROD_BACKEND = process.env.REACT_APP_PROD_BACKEND;
// const BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY;

const api = axios.create({
  baseURL: LOCAL_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});
/**
 * console.log all requests and responses
 */
api.interceptors.request.use(
  (request) => {
    console.log("Starting Request", request);
    request.headers.authorization = `Bearer ${sessionStorage.getItem(
      "authToken"
    )}`;
    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    error = error.response.data;
    console.log("RESPONSE ERROR", error);
    return Promise.reject(error);
  }
);

export default api;
