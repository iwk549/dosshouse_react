import http from "./nodeHttpService";

export async function getUsers(page = 1, limit = 100, search = "", hasGoogleAccount = undefined, sort = "name", order = "asc") {
  try {
    const params = { page, limit, search, sort, order };
    if (hasGoogleAccount !== undefined) params.hasGoogleAccount = hasGoogleAccount;
    return await http.get(http.admin + "/users", { params });
  } catch (ex) {
    return ex.response;
  }
}

export async function deleteUser(id) {
  try {
    return await http.delete(http.admin + "/users/" + id);
  } catch (ex) {
    return ex.response;
  }
}
