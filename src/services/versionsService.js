import http from "./nodeHttpService";

export async function getLatestVersion() {
  try {
    return await http.get(http.versions);
  } catch (ex) {
    return ex.response;
  }
}
