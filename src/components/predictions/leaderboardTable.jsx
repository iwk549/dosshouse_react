import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import Table from "../common/table/table";
import SearchBox from "../common/table/searchBox";
import ExternalImage from "../common/image/externalImage";
import logos from "../../textMaps/logos";
import IconRender from "../common/icons/iconRender";
import { sortAndFilterTable } from "../../utils/leaderboardUtil";

const LeaderboardTable = ({ leaderboard }) => {
  let navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    sortColumn: { path: "totalPoints", order: "desc" },
    search: "",
    tableData: [],
    timer: undefined,
  });

  function reducer(state, action) {
    let search =
      typeof action.search === "string" ? action.search : state.search;
    let sortColumn = action.sortColumn || state.sortColumn;
    let tableData = state.tableData;
    let timer = action.type === "search" ? undefined : state.timer;
    if (action.type === "search") {
      clearTimeout(state.timer);
      if (!timer) {
        timer = setTimeout(() => {
          dispatch({ type: "timerExpired" });
        }, 300);
      }
    } else {
      tableData = sortAndFilterTable(leaderboard, search, sortColumn);
    }
    return { tableData, search, sortColumn, timer };
  }

  useEffect(() => {
    dispatch({});
  }, [leaderboard]);

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
        search={state.search}
        onSearch={(value) => dispatch({ type: "search", search: value })}
        placeholder="Search by user or bracket name..."
      />
      <Table
        columns={columns}
        data={state.tableData}
        sortColumn={state.sortColumn}
        onSort={(sortColumn) => dispatch({ type: "sort", sortColumn })}
        keyProperty="_id"
      />
    </>
  );
};

export default LeaderboardTable;
