import http from "./nodeHttpService";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { cookieOptions } from "../utils/allowables";

const tokenKey = "dosshouseToken";

http.setJwt(getJwt());

function setUser(jwt) {
  Cookies.set(tokenKey, jwt, cookieOptions);
  http.setJwt(jwt);
}

export function getJwt() {
  return Cookies.get(tokenKey);
}

export function getCurrentUser() {
  try {
    let user = jwtDecode(Cookies.get(tokenKey));
    user.firstName = user.name.split("%20%")[0];
    user.lastName = user.name.split("%20%")[1] || "";
    return user;
  } catch (ex) {
    return null;
  }
}

export function logout() {
  Cookies.remove(tokenKey);
}

export async function registerUser(userData) {
  try {
    const res = await http.post(http.users, userData);
    setUser(res.data);
    return res;
  } catch (ex) {
    return ex.response;
  }
}

export async function loginUser(userData) {
  try {
    const res = await http.post(http.users + "/login", userData);
    setUser(res.data);
    return res;
  } catch (ex) {
    return ex.response;
  }
}

export async function refreshUser() {
  try {
    const res = await http.get(http.users);
    setUser(res.data);
    return res;
  } catch (ex) {
    return ex.response;
  }
}

export async function editUser(info) {
  try {
    const res = await http.put(http.users, info);
    setUser(res.data);
    return res;
  } catch (ex) {
    return ex.response;
  }
}

export async function deleteUser() {
  try {
    const res = await http.delete(http.users);
    logout();
    return res;
  } catch (ex) {
    return ex.response;
  }
}

export async function requestPasswordReset(email) {
  try {
    return await http.put(http.users + "/resetpassword/" + email);
  } catch (ex) {
    return ex.response;
  }
}
