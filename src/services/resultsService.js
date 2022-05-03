import http from "./nodeHttpService";

export async function getResult(competitionID) {
  try {
    return await http.get(http.results + "/" + competitionID);
  } catch (ex) {
    return ex.response;
  }
}
