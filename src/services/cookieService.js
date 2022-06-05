import Cookies from "js-cookie";

export const cookieOptions = {
  expires: 9999,
  sameSite: "Lax",
};

const getCookie = (name) => {
  return Cookies.get(name);
};

const addCookie = (name, value) => {
  Cookies.set(name, value, cookieOptions);
};

const removeCookie = (name) => {
  Cookies.remove(name);
};

const tokenName = "dosshouseToken";
const acceptedName = "dosshouseCookiesAccepted";

export default { getCookie, addCookie, removeCookie, tokenName, acceptedName };
