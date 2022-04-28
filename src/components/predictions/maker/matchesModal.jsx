import React, { useState } from "react";

import { shortDate } from "../../../utils/allowables";
import BasicModal from "../../common/modal/basicModal";
import Table from "../../common/table/table";
import {
  teamOrder,
  titleCase,
  matchStartText,
} from "../../../utils/allowables";

const MatchesModal = ({ matches, isOpen, setIsOpen, header }) => {
  const teams = teamOrder(matches[0]?.sport);

  const [sortColumn, setSortColumn] = useState({
    path: "dateTime",
    order: "asc",
  });
  if (!matches || matches.length === 0) return null;
  const columns = [
    { path: `${teams[0]}TeamName`, label: `${titleCase(teams[0])} Team` },
    {
      path: `${teams[0]} TeamGoals`,
      label: "",
      content: (m) => (m.matchAccepted ? m[teams[0] + "TeamGoals"] : ""),
    },
    { path: `${teams[1]}TeamName`, label: `${titleCase(teams[1])} Team` },
    {
      path: `${teams[1]} TeamGoals`,
      label: "",
      content: (m) => (m.matchAccepted ? m[teams[1] + "TeamGoals"] : ""),
    },
    { path: "location", label: "Location" },
    {
      path: "dateTime",
      label: matchStartText(matches[0]?.sport),
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
        <b>{header}</b>
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
