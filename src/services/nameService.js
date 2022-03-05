import http from "./httpService";

export async function getArtistInfo(params) {
  try {
    return await http.get(
      http.artist_endpoint +
        "?id=" +
        params.artistID +
        "&api_id=" +
        params.api_id +
        "&api_key=" +
        params.api_key
    );
  } catch (ex) {
    return ex.response;
  }
}

export async function getPlaylistInfo(params) {
  try {
    return await http.get(
      http.playlist_endpoint +
        "?id=" +
        params.playlistID +
        "&api_id=" +
        params.api_id +
        "&api_key=" +
        params.api_key
    );
  } catch (ex) {
    return ex.response;
  }
}
