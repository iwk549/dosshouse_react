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

export function shortDate(matchDateTime, dontSlice) {
  if (!matchDateTime) return "";
  const newDateTime = new Date(
    dontSlice ? matchDateTime : matchDateTime.slice(0, matchDateTime.length - 1)
  );
  return format(newDateTime, "M/d/yy h:mma").toLowerCase();
}

export function teamOrder(sport) {
  const lowerSport = sport.toLowerCase();
  return ["soccer"].includes(lowerSport) ? ["home", "away"] : ["away", "home"];
}
