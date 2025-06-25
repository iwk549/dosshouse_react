import React, { useEffect, useReducer, useContext } from "react";

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
  hasSearched,
  setForceRemoveOpen,
  setSelectedPrediction,
}) => {
  const { user } = useContext(LoadingContext);
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
    { path: "name", label: "Bracket Name" },
    {
      path: "totalPoints",
      label: "Total",
      content: (p) => (
        <>
          {p.totalPicks || 0} <IconRender type="check" /> | {p.totalPoints || 0}{" "}
          pts
        </>
      ),
    },
    // {
    //   path: "potentialPoints.realistic",
    //   label: "Potential Points",
    //   content: (p) =>
    //     p.potentialPoints ? <>{p.potentialPoints?.realistic}</> : null,
    // },
    {
      path: "misc.winner",
      label: "Champion Picked",
      content: (p) =>
        !p.misc ? (
          "Hidden until after submission deadline"
        ) : (
          <div style={{ textAlign: "left" }}>
            {p.misc?.winner} &nbsp;
            <ExternalImage
              uri={logos[findCountryLogo(p.misc?.winner)]}
              height={15}
              width="auto"
            />
          </div>
        ),
    },
    {
      path: "points.group.points",
      label: "Group Stage",
      content: (p) => (
        <>
          {p.points?.group?.correctPicks || 0} <IconRender type="check" /> |{" "}
          {p.points?.group?.points || 0} pts
        </>
      ),
    },
    {
      path: "points.playoff.points",
      label: "Playoff",
      content: (p) => (
        <>
          {p.points?.playoff?.correctPicks || 0} <IconRender type="check" /> |{" "}
          {p.points?.playoff?.points || 0} pts
        </>
      ),
    },
    {
      path: "points.misc.points",
      label: "Misc",
      content: (p) => (
        <>
          {p.points?.misc?.correctPicks || 0} <IconRender type="check" /> |{" "}
          {p.points?.misc?.points || 0} pts
        </>
      ),
    },
    {
      path: "points.champion.points",
      label: "Champion",
      content: (p) => `${p.points?.champion?.points || 0} pts`,
    },
  ];

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
        hasSearched={hasSearched}
      />
      <Table
        columns={columns}
        data={state.tableData}
        sortColumn={state.sortColumn}
        onSort={(sortColumn) => dispatch({ type: "sort", sortColumn })}
        keyProperty="_id"
        onSelect={onSelectPrediction}
        CardComponent={LeaderboardCard}
        cardSearchColumns={columns.slice(0, 6)}
      />
    </>
  );
};

export default LeaderboardTable;
