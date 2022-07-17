import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: process.env.REACT_APP_RENDER_API_URL,
});

if (process.env.NODE_ENV !== "test") {
  instance.interceptors.response.use(null, (error) => {
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
  instance.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
  users: "/users",
  matches: "/matches",
  competitions: "/competitions",
  predictions: "/predictions",
  groups: "/groups",
  results: "/results",
  versions: "/versions",
  setJwt,
};
