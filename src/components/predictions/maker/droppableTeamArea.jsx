import { useState, useEffect } from "react";

import MatchesModal from "./matchesModal";
import DraggableTable from "../../common/table/draggableTable";
import ExternalImage from "../../common/image/externalImage";
import logos from "../../../textMaps/logos";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import { findCountryLogo } from "../../../utils/predictionsUtil";

const DroppableTeamArea = ({
  teams,
  groupName,
  groupHeader,
  description,
  onDrop,
  onReorder,
  isLocked,
  matches,
  highlight,
}) => {
  const { isSuperSmall } = useWindowDimensions();
  const [matchesOpen, setMatchesOpen] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    let newColumns = [{ testid: "team_name", content: (t) => t.name }];
    if (!isSuperSmall) {
      newColumns.unshift({
        content: (t) => (
          <ExternalImage
            uri={logos[findCountryLogo(t.name)]}
            width={30}
            height={20}
          />
        ),
      });
    }
    setColumns(newColumns);
  }, [isSuperSmall]);

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
    <div>
      <h3 className="text-center">
        <b>{groupHeader}</b>
        {description && (
          <>
            <br />
            <small style={{ fontWeight: "normal" }}>{description}</small>
          </>
        )}
      </h3>
      <DraggableTable
        data={teams}
        columns={columns}
        onDrop={raiseDrop}
        onReorder={raiseReorder}
        type="team"
        isLocked={isLocked}
        highlight={highlight}
      />
      <div style={{ height: 5 }} />
      {matches && (
        <>
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
            header={`Group ${groupName} Matches`}
          />
        </>
      )}
    </div>
  );
};

export default DroppableTeamArea;
