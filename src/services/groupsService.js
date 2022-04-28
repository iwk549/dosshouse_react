import http from "./nodeHttpService";

export async function saveGroup(groupID, group) {
  try {
    if (groupID) return await http.put(http.groups + "/" + groupID, group);
    else return await http.post(http.groups, group);
  } catch (ex) {
    return ex.response;
  }
}

export async function getGroups() {
  try {
    return await http.get(http.groups);
  } catch (ex) {
    return ex.response;
  }
}
