import { format } from "date-fns";

export const toastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export function titleCase(words) {
  if (!words) return "";
  let split = words.split(" ");
  let titled = [];
  split.forEach((word) => {
    titled.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  });
  return titled.join(" ");
}

export function shortDate(dateTime, dontSlice, noTime) {
  if (!dateTime) return "";
  const newDateTime = new Date(
    dontSlice ? dateTime : dateTime.slice(0, dateTime.length - 1)
  );
  const time = format(newDateTime, "h:mma").toLowerCase();
  return format(newDateTime, "yyyy-MM-dd") + (noTime ? "" : " " + time);
}
export function longDate(dateTime, dontSlice) {
  if (!dateTime) return "";
  const newDateTime = new Date(
    dontSlice ? dateTime : dateTime.slice(0, dateTime.length - 1)
  );
  const amPm = format(newDateTime, "a").toLowerCase();
  return format(newDateTime, "MMMM dd, yyyy h:mm") + amPm;
}

export function teamOrder(sport) {
  const lowerSport = sport.toLowerCase();
  return ["soccer"].includes(lowerSport) ? ["home", "away"] : ["away", "home"];
}
export function atOrVs(sport) {
  const lowerSport = sport.toLowerCase();
  return ["soccer"].includes(lowerSport) ? "vs" : "at";
}
export function matchStartText(sport) {
  const lowerSport = sport.toLowerCase();
  return ["soccer", "football"].includes(lowerSport)
    ? "Kick Off"
    : "First Pitch";
}

export const cookieOptions = {
  expires: 9999,
  sameSite: "Lax",
};

export function splitName(name) {
  return name.split(" ")[0];
}
export function translateRound(round, finalRound) {
  if (round === 1001) return "Third Place";
  const translation = [
    "Final",
    "Semi-Final",
    "Quarter-Final",
    "Round of 16",
    "Round of 32",
    "Round of 64",
  ];
  return translation[finalRound - round];
}
export function decideSortOrder(sortColumn, path) {
  if (sortColumn.path === path)
    sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
  else {
    sortColumn.path = path;
    sortColumn.order = path.toLowerCase().includes("points") ? "desc" : "asc";
  }
  return sortColumn;
}
