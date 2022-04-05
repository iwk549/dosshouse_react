import http from "./nodeHttpService";

export async function getCompetitions() {
  try {
    return await http.get(http.competitions);
  } catch (ex) {
    return ex.response;
  }
}
