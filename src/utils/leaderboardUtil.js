export const sortAndFilterTable = (leaderboard, search, sortColumn) => {
  let filteredLeaderboard = [...leaderboard];
  if (search) {
    const lcSearch = search.toLowerCase();
    filteredLeaderboard = filteredLeaderboard.filter((l) => {
      return (
        l.userID?.name.toLowerCase().includes(lcSearch) ||
        l.name.toLowerCase().includes(lcSearch)
      );
    });
  }
  const splitSortPath = sortColumn.path.split(".");
  filteredLeaderboard.sort((a, b) => {
    const aSort =
      splitSortPath[0] === "points"
        ? a.points[splitSortPath[1]][splitSortPath[2]]
        : a[sortColumn.path];
    const bSort =
      splitSortPath[0] === "points"
        ? b.points[splitSortPath[1]][splitSortPath[2]]
        : b[sortColumn.path];
    let sort = 0;
    if (aSort > bSort) sort = 1;
    else sort = -1;
    return sortColumn.order === "desc" ? sort * -1 : sort;
  });
  return filteredLeaderboard;
};
