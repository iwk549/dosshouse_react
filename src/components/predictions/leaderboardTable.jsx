import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Table from "../common/table/table";
import SearchBox from "../common/table/searchBox";
import ExternalImage from "../common/image/externalImage";
import logos from "../../textMaps/logos";
import IconRender from "../common/icons/iconRender";

const LeaderboardTable = ({ leaderboard }) => {
  let navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState({
    path: "totalPoints",
    order: "desc",
  });
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);

  const sortTable = (data) => {
    let sortedLeaderboard = [...data];

    setTableData(sortedLeaderboard);
  };

  const sortAndFilterTable = () => {
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
    setTableData(filteredLeaderboard);
  };

  useEffect(() => {
    sortAndFilterTable();
  }, [search, sortColumn, leaderboard]);

  const columns = [
    {
      path: "userID.name",
      label: "User Name",
    },
    { path: "name", label: "Bracket Name" },
    {
      path: "points.group.points",
      label: "Group Stage",
      content: (p) => (
        <>
          {p.points.group.correctPicks} <IconRender type="check" /> |{" "}
          {p.points.group.points} pts
        </>
      ),
    },
    {
      path: "points.playoff.points",
      label: "Playoff",
      content: (p) => (
        <>
          {p.points.playoff.correctPicks} <IconRender type="check" /> |{" "}
          {p.points.playoff.points} pts
        </>
      ),
    },
    {
      path: "points.misc.points",
      label: "Misc",
      content: (p) => (
        <>
          {p.points.misc.correctPicks} <IconRender type="check" /> |{" "}
          {p.points.misc.points} pts
        </>
      ),
    },
    {
      path: "points.champion.points",
      label: "Champion",
      content: (p) => `${p.points.champion.points} pts`,
    },
    {
      path: "misc.winner",
      label: "Champion Picked",
      content: (p) =>
        !p.misc ? (
          "Hidden until after submission deadline"
        ) : (
          <>
            <ExternalImage
              uri={logos[p.misc?.winner]}
              height={15}
              width="auto"
            />
            &nbsp;{p.misc?.winner}
          </>
        ),
    },
    {
      path: "totalPoints",
      label: "Total Points",
      content: (p) => p.totalPoints,
    },
  ];

  return (
    <>
      <button
        className="btn btn-block btn-danger"
        onClick={() => navigate("/predictions")}
      >
        Go Back
      </button>
      <SearchBox
        name="leaderboardSearch"
        search={search}
        onSearch={setSearch}
        placeholder="Search by user or bracket name..."
      />
      <Table
        columns={columns}
        data={tableData}
        sortColumn={sortColumn}
        onSort={setSortColumn}
        keyProperty="_id"
      />
    </>
  );
};

export default LeaderboardTable;
