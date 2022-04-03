import React, { useState, useEffect, useContext, useRef } from "react";

import MatchesModal from "./matchesModal";
import DraggableTable from "../common/table/draggableTable";
import ExternalImage from "../common/image/externalImage";

const DroppableTeamArea = ({
  teams,
  groupName,
  onDrop,
  onReorder,
  isLocked,
  matches,
}) => {
  const [matchesOpen, setMatchesOpen] = useState(false);
  const columns = [
    { content: (t) => <ExternalImage uri={t.flag} width={50} height={35} /> },
    { content: (t) => t.name },
  ];

  const raiseDrop = ({ draggedItem, droppedOn }) => {
    onDrop({
      type: "update",
      draggedTeam: draggedItem,
      droppedOn,
      groupName,
    });
  };
  const raiseReorder = (item, direction, position) => {
    onReorder({
      type: "reorder",
      selectedTeam: { item, position },
      direction,
      groupName,
    });
  };

  return (
    <>
      <h3 className="text-center">
        <b>Group {groupName}</b>
      </h3>
      <DraggableTable
        data={teams}
        columns={columns}
        onDrop={raiseDrop}
        onReorder={raiseReorder}
        type="team"
        isLocked={isLocked}
      />
      <div style={{ height: 5 }} />
      <div className="text-center">
        <button
          className="btn btn-sm btn-info"
          onClick={() => setMatchesOpen(true)}
        >
          See Matches
        </button>
      </div>
      <MatchesModal
        isOpen={matchesOpen}
        setIsOpen={setMatchesOpen}
        matches={matches}
      />
    </>
  );
};

export default DroppableTeamArea;
