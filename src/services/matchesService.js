import http from "./nodeHttpService";

export async function getMatches(bracketCode) {
  try {
    return await http.get(http.matches + "/" + bracketCode);
  } catch (ex) {
    return ex.response;
  }
}
