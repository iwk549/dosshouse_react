import React, { useState, useEffect, useContext, useRef } from "react";

import Table from "../common/table/table";
import SearchBox from "../common/table/searchBox";

const LeaderboardTable = ({ leaderboard }) => {
  const [sortColumn, setSortColumn] = useState({
    path: "totalPoints",
    order: "asc",
  });
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);

  const getTableData = () => {
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
    getTableData();
  }, [search, sortColumn, leaderboard]);

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
      path: "totalPoints",
      label: "Total Points",
      content: (p) => p.totalPoints,
    },
  ];

  return (
    <>
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
