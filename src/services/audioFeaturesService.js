import http from "./httpService";

export async function getTopTracks(artist_id) {
  try {
    return await http.get(
      http.audio_features_endpoint + "/artists/top_tracks?id=" + artist_id
    );
  } catch (ex) {
    return ex.response;
  }
}

export async function getPlaylistRecommendations(params) {
  try {
    return await http.get(
      http.audio_features_endpoint +
        "/playlist_recommendations?playlistids=" +
        params.playlist_ids +
        "&artistid=" +
        params.artist_id +
        "&probability=" +
        params.probability +
        "&all_songs=" +
        params.all_songs +
        "&api_id=" +
        params.api_id +
        "&api_key=" +
        params.api_key
    );
  } catch (ex) {
    return ex.response;
  }
}
