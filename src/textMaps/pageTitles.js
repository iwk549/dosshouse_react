const titleMap = {
  active_sites: "Active Sites",
  home: "Home",
  predictions: "Predictions",
  spotify_api: "Spotify API",
};

export default function setPageTitle(pathname) {
  const mapName = pathname.split("/");
  document.title = `Dosshouse | ${titleMap[mapName[1]]}`;
}
