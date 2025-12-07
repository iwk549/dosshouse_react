import http from "./nodeHttpService";
import jwtDecode from "jwt-decode";

import cookies from "./cookieService";

http.setJwt(getJwt());

function setUser(jwt) {
  cookies.addCookie(cookies.tokenName, jwt);
  http.setJwt(jwt);
}

export function getJwt() {
  return cookies.getCookie(cookies.tokenName);
}

export function getCurrentUser() {
  try {
    let user = jwtDecode(cookies.getCookie(cookies.tokenName));
    user.firstName = user.name.split("%20%")[0];
    user.lastName = user.name.split("%20%")[1] || "";
    return user;
  } catch (ex) {
    return null;
  }
}

export function logout() {
  cookies.removeCookie(cookies.tokenName);
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

export async function updatePassword(token, email, password) {
  try {
    const res = await http.put(http.users + "/updatepassword", {
      token,
      email,
      password,
    });
    setUser(res.data);
    return res;
  } catch (ex) {
    return ex.response;
  }
}

export async function loginWithGoogle(idToken) {
  try {
    const res = await http.post(http.users + "/loginwithgoogle", { idToken });
    setUser(res.data);
    return res;
  } catch (ex) {
    return ex.response;
  }
}
