import React, { useEffect, useReducer, useContext, useState } from "react";

import Table from "../../common/table/table";
import SearchBoxSubmit from "../../common/searchSort/searchBoxSubmit";
import ExternalImage from "../../common/image/externalImage";
import logos from "../../../textMaps/logos";
import IconRender from "../../common/icons/iconRender";
import { sortAndFilterTable } from "../../../utils/leaderboardUtil";
import LoadingContext from "../../../context/loadingContext";

import LeaderboardCard from "../../common/cards/leaderboardCard";
import { findCountryLogo } from "../../../utils/predictionsUtil";

const LeaderboardTable = ({
  leaderboard,
  groupInfo,
  onSelectPrediction,
  onSearch,
  setForceRemoveOpen,
  setSelectedPrediction,
  isSecondChance,
}) => {
  const { user } = useContext(LoadingContext);
  const [potentialMode, setPotentialMode] = useState("realistic");
  const [state, dispatch] = useReducer(reducer, {
    sortColumn: { path: "ranking", order: "asc" },
    tableData: [],
    timer: undefined,
  });

  function reducer(state, action) {
    let search =
      typeof action.search === "string" ? action.search : state.search;
    let sortColumn = action.sortColumn || state.sortColumn;
    let tableData = state.tableData;

    // this logic os for old style of debounced local searching
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
    { path: "ranking", label: "Sitewide Rank" },
    {
      path: "userID.name",
      label: "User Name",
    },
    { path: "name", label: "Submission Name" },
    {
      path: "totalPoints",
      label: "Total",
      content: (p) => (
        <>
          <span style={{ fontWeight: 700, fontSize: "1.1em" }}>
            {p.totalPoints || 0}
          </span>
          <span className="picks-badge">{p.totalPicks || 0} ✓</span>
        </>
      ),
    },
    {
      path: "misc.winner",
      label: "Champion Picked",
      content: (p) =>
        !p.misc ? (
          <span title="Submission information will be revealed after the deadline">
            <i>Hidden</i>
          </span>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 600 }}>{p.misc?.winner}</div>
            <ExternalImage
              uri={logos[findCountryLogo(p.misc?.winner)]}
              height={15}
              width="auto"
            />
          </div>
        ),
    },
    {
      path: "points.playoff.points",
      label: "Playoff",
      content: (p) => (
        <>
          {p.points?.playoff?.points || 0}
          <span className="picks-badge">
            {p.points?.playoff?.correctPicks || 0} ✓
          </span>
        </>
      ),
    },
    {
      path: "points.misc.points",
      label: "Bonus",
      content: (p) => (
        <>
          {p.points?.misc?.points || 0}
          <span className="picks-badge">
            {p.points?.misc?.correctPicks || 0} ✓
          </span>
        </>
      ),
    },
    {
      path: "points.champion.points",
      label: "Champion",
      content: (p) => (
        <>
          {p.points?.champion?.points || 0}
          <span className="picks-badge">
            {p.points?.champion?.points ? 1 : 0} ✓
          </span>
        </>
      ),
    },
  ];

  if (!isSecondChance) {
    columns.splice(5, 0, {
      path: "points.group.points",
      label: "Group Stage",
      content: (p) => (
        <>
          {p.points?.group?.points || 0}
          <span className="picks-badge">
            {p.points?.group?.correctPicks || 0} ✓
          </span>
        </>
      ),
    });
  }

  if ((leaderboard[0]?.potentialPoints?.maximum || 0) > 0) {
    columns.splice(4, 0, {
      path: `potentialPoints.${potentialMode}`,
      label: (
        <div>
          <button
            className={`btn btn-xs${potentialMode === "realistic" ? " btn-info" : " btn-secondary"}`}
            onClick={(e) => {
              e.stopPropagation();
              setPotentialMode((m) =>
                m === "realistic" ? "maximum" : "realistic",
              );
            }}
          >
            {potentialMode === "realistic" ? "Show Max" : "Show Real."}
          </button>
          <div>
            {potentialMode === "realistic" ? "Realistic" : "Maximum"} Potential
            Points
          </div>
        </div>
      ),
      content: (p) =>
        p.potentialPoints?.[potentialMode] > 0
          ? `${p.potentialPoints?.[potentialMode]}`
          : "—",
    });
  }

  if (groupInfo && groupInfo.ownerID && groupInfo.ownerID._id === user?._id)
    columns.push({
      path: "forceRemove",
      label: "",
      content: (p) => (
        <button
          className="btn btn-danger"
          onClick={() => {
            setForceRemoveOpen(true);
            setSelectedPrediction(p);
          }}
        >
          <IconRender type="remove" />
        </button>
      ),
      nonSelectable: true,
    });

  return (
    <>
      <SearchBoxSubmit
        name="leaderboardSearch"
        onSearch={(value) => onSearch(value)}
        placeholder="Search by user or bracket name..."
      />
      <Table
        columns={columns}
        data={state.tableData}
        sortColumn={state.sortColumn}
        onSort={(sortColumn) => dispatch({ type: "sort", sortColumn })}
        keyProperty="_id"
        onSelect={onSelectPrediction}
        CardComponent={LeaderboardCard}
        cardSearchColumns={[
          ...columns.filter((c) =>
            ["ranking", "userID.name", "name", "totalPoints"].includes(c.path),
          ),
          { path: "potentialPoints.realistic", label: "Potential Points" },
        ]}
      />
    </>
  );
};

export default LeaderboardTable;
