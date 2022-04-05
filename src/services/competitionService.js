import http from "./nodeHttpService";

export async function getActiveCompetitions() {
  try {
    return await http.get(http.competitions + "/active");
  } catch (ex) {
    return ex.response;
  }
}

export async function getExpiredCompetitions() {
  try {
    return await http.get(http.competitions + "/expired");
  } catch (ex) {
    return ex.response;
  }
}

export async function getCompetition(competitionID) {
  try {
    return await http.get(http.competitions + "/single/" + competitionID);
  } catch (ex) {
    return ex.response;
  }
}
