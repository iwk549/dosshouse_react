import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_RENDER_API_URL;

if (process.env.NODE_ENV !== "test") {
  axios.defaults.baseURL = apiUrl;
  axios.interceptors.response.use(null, (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      toast.error(
        "An unexpected error occured. Please check your internet connection."
      );
    }

    return Promise.reject(error);
  });
}
function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  users: "/users",
  matches: "/matches",
  predictions: "/predictions",
  setJwt,
};
