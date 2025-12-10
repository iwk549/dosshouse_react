const titleMap = {
  // active_sites: "Active Sites",
  // home: "Home",
  competitions: "Competitions",
  submissions: "Submissions",
  // spotify_api: "Spotify API",
};

export default function setPageTitle(pathname) {
  const mapName = pathname.split("/");
  document.title = `Picker | Ultimate Scoreboard | ${titleMap[mapName[1]]}`;
}
