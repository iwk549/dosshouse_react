const titleMap = {
  competitions: "Competitions",
  submissions: "Submissions",
};

export default function setPageTitle(pathname) {
  const mapName = pathname.split("/");
  document.title = `Picker | Ultimate Scoreboard | ${titleMap[mapName[1]]}`;
}
