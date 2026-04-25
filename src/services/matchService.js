import http from "./nodeHttpService";

export async function getMatches(competitionID) {
  try {
    return await http.get(http.matches + "/" + competitionID);
  } catch (ex) {
    return ex.response;
  }
}

export async function updateMatch(matchId, data) {
  try {
    return await http.put(http.matches + "/" + matchId, data);
  } catch (ex) {
    return ex.response;
  }
}
