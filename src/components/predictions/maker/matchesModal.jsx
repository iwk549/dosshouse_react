import React from "react";

import { shortDate } from "../../../utils/allowables";
import BasicModal from "../../common/modal/basicModal";
import Table from "../../common/table/table";
import {
  teamOrder,
  titleCase,
  matchStartText,
} from "../../../utils/allowables";
import MatchCard from "../../common/cards/matchCard";
import logos from "../../../textMaps/logos";
import ExternalImage from "../../common/image/externalImage";

const MatchesModal = ({
  matches,
  isOpen,
  setIsOpen,
  header,
  sortColumn,
  onSort,
}) => {
  const teams = teamOrder(matches[0]?.sport || "");

  const renderLogo = (teamName) => {
    return <ExternalImage uri={logos[teamName]} width={25} height={25} />;
  };

  if (!matches || matches.length === 0) return null;
  const columns = [
    {
      path: `${teams[0]}TeamLogo`,
      label: "",
      content: (m) => renderLogo(m[teams[0] + "TeamName"]),
    },
    { path: `${teams[0]}TeamName`, label: `${titleCase(teams[0])} Team` },
    {
      path: `${teams[0]}TeamGoals`,
      label: "",
      content: (m) => (m.matchAccepted ? m[teams[0] + "TeamGoals"] : ""),
    },
    {
      path: `${teams[1]}TeamGoals`,
      label: "",
      content: (m) => (m.matchAccepted ? m[teams[1] + "TeamGoals"] : ""),
    },
    { path: `${teams[1]}TeamName`, label: `${titleCase(teams[1])} Team` },
    {
      path: `${teams[1]}TeamLogo`,
      label: "",
      content: (m) => renderLogo(m[teams[1] + "TeamName"]),
    },
    { path: "location", label: "Location" },
    {
      path: "dateTime",
      label: matchStartText(matches[0]?.sport),
      content: (m) => shortDate(m.dateTime, true),
    },
  ];

  return (
    <BasicModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <h3 className="text-center">
        <b>{header}</b>
      </h3>
      <Table
        columns={columns}
        data={matches}
        sortColumn={sortColumn}
        onSort={onSort}
        keyProperty={"_id"}
        headerClass="thead-light"
        CardComponent={MatchCard}
        cardSearchColumns={columns.filter((c) => c.label)}
      />
    </BasicModal>
  );
};

export default MatchesModal;
