import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Table from "../common/table/table";
import SearchBox from "../common/table/searchBox";
import ExternalImage from "../common/image/externalImage";
import logos from "../../textMaps/logos";

const LeaderboardTable = ({ leaderboard }) => {
  let navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState({
    path: "totalPoints",
    order: "desc",
  });
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);

  const sortTable = () => {
    let sortedLeaderboard = [...leaderboard];
    sortedLeaderboard.sort((a, b) => {
      let sort = 0;
      if (a[sortColumn.path] > b[sortColumn.path]) sort = 1;
      else sort = -1;
      return sortColumn.order === "desc" ? sort * -1 : sort;
    });
    setTableData(sortedLeaderboard);
  };

  const filterTable = () => {
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
    setTableData(filteredLeaderboard);
  };

  useEffect(() => {
    filterTable();
  }, [search]);

  useEffect(() => {
    sortTable();
  }, [sortColumn, leaderboard]);

  const columns = [
    {
      path: "userID.name",
      label: "User Name",
      content: (p) => p.userID?.name,
    },
    { path: "name", label: "Bracket Name" },
    {
      path: "points.group",
      label: "Group Stage Points",
      content: (p) => p.points.group,
    },
    {
      path: "points.playoff",
      label: "Playoff Points",
      content: (p) => p.points.playoff,
    },
    {
      path: "points.misc",
      label: "Misc Points",
      content: (p) => p.points.misc,
    },
    {
      path: "points.champion",
      label: "Champion Points",
      content: (p) => p.points.champion,
    },
    {
      path: "misc.winner",
      label: "Picked Champion",
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
