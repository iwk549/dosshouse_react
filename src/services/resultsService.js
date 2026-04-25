import http from "./nodeHttpService";

export async function getResult(competitionID) {
  try {
    return await http.get(http.results + "/" + competitionID);
  } catch (ex) {
    return ex.response;
  }
}

export async function updateResult(code, data) {
  try {
    return await http.put(http.results + "/" + code, data);
  } catch (ex) {
    return ex.response;
  }
}

export async function calculateCompetition(code) {
  try {
    return await http.post(http.results + "/calculate/" + code);
  } catch (ex) {
    return ex.response;
  }
}
