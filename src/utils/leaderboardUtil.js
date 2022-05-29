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
    if (splitSortPath[0] === "misc" && !a.misc) return 0;
    let aSort =
      splitSortPath[0] === "points"
        ? a.points[splitSortPath[1]][splitSortPath[2]]
        : splitSortPath.length === 2
        ? a[splitSortPath[0]][splitSortPath[1]]
        : a[sortColumn.path];
    let bSort =
      splitSortPath[0] === "points"
        ? b.points[splitSortPath[1]][splitSortPath[2]]
        : splitSortPath.length === 2
        ? b[splitSortPath[0]][splitSortPath[1]]
        : b[sortColumn.path];

    if (typeof aSort === "string") aSort = aSort.toLowerCase();
    if (typeof bSort === "string") bSort = bSort.toLowerCase();

    let sort = 0;
    if (aSort > bSort) sort = 1;
    else sort = -1;
    return sortColumn.order === "desc" ? sort * -1 : sort;
  });
  return filteredLeaderboard;
};
