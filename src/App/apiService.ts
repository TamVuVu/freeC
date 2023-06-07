import axios from "axios";

const apiService = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

apiService.interceptors.request.use(
  (request) => {
    // console.log("Start Request", request);
    return request;
  },
  (error) => {
    // console.log("Request Error", { error });
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => {
    // console.log("Start Response", response);
    return response;
  },
  (error) => {
    // console.log("Response error", { error });
    const message =
      error.response?.data?.status_message || error.message || "Unknown Error";
    return Promise.reject({ message });
  }
);

export default apiService;
