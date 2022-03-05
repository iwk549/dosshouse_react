import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    // logger.log(error);
    toast.error("An unexpected error occured");
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  audio_features_endpoint: "api/v1/spotify/audio_features",
  artist_endpoint: "api/v1/spotify/artist",
  playlist_endpoint: "api/v1/spotify/playlist",
};
