import React, { useState, useEffect, useContext, useRef } from "react";
import { shortDate } from "../../utils/allowables";
import BasicModal from "../common/modal/basicModal";
import Table from "../common/table/table";

const MatchesModal = ({ matches, isOpen, setIsOpen }) => {
  const [sortColumn, setSortColumn] = useState({
    path: "dateTime",
    order: "asc",
  });
  if (!matches || matches.length === 0) return null;
  const columns = [
    { path: "homeTeamName", label: "Home Team" },
    { path: "homeTeamGoals", label: "" },
    { path: "awayTeamGoals", label: "" },
    { path: "awayTeamName", label: "Away Team" },
    { path: "location", label: "Location" },
    {
      path: "dateTime",
      label: "Kick Off",
      content: (m) => shortDate(m.dateTime, true),
    },
  ];

  const getData = () => {
    const sortedMatches = matches.sort((a, b) => {
      if (!b[sortColumn.path]) return -1;
      if (!a[sortColumn.path]) return 1;
      const isGreater = a[sortColumn.path] > b[sortColumn.path];
      return (isGreater && sortColumn.order === "asc") ||
        (!isGreater && sortColumn.order === "desc")
        ? 1
        : -1;
    });
    return sortedMatches;
  };

  return (
    <BasicModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <h3 className="text-center">
        <b>Group {matches[0].groupName} Matches</b>
      </h3>
      <Table
        columns={columns}
        data={getData()}
        sortColumn={sortColumn}
        onSort={setSortColumn}
        keyProperty={"_id"}
        headerClass="thead-light"
      />
    </BasicModal>
  );
};

export default MatchesModal;
