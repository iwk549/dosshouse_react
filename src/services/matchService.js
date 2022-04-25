import http from "./nodeHttpService";

export async function getMatches(competitionID) {
  try {
    return await http.get(http.matches + "/" + competitionID);
  } catch (ex) {
    return ex.response;
  }
}
