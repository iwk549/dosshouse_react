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
