import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    // logger.log(error);
    toast.error("An unexpected error occured");
    toast.clearWaitingQueue();
  }

  return Promise.reject(error);
});

export default {
  get: instance.get,
  audio_features_endpoint: "/spotify/audio_features",
  artist_endpoint: "/spotify/artist",
  playlist_endpoint: "/spotify/playlist",
};
