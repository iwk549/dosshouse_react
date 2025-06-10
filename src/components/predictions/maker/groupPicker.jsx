import React, { useState, useEffect } from "react";

import DroppableTeamArea from "./droppableTeamArea";
import useWindowDimensions from "../../../utils/useWindowDimensions";

const GroupPicker = ({
  groups,
  onDrop,
  onReorder,
  isLocked,
  groupMatches,
  highlight,
  competition,
}) => {
  const { width } = useWindowDimensions();
  const [groupMaps, setGroupMaps] = useState([]);

  useEffect(() => {
    // set number of groups displayed per row
    // 300 pixels needed per group
    let groupsPerRow = Math.floor(width / 300) || 1;
    const keys = Object.keys(groups);
    let maps = [];
    let i = 0;
    while (i < keys.length) {
      maps.push(keys.slice(i, groupsPerRow + i));
      i += groupsPerRow;
    }
    setGroupMaps(maps);
  }, [width, groups]);

  return (
    <>
      {!isLocked && (
        <p className="text-center">
          Rearrange the teams by dragging and dropping or using the arrow
          buttons. The position of the teams in their groups will effect where
          they will be placed in the bracket. Changing the group order after you
          have already made selections in the bracket will cascade those changes
          through the whole bracket.
        </p>
      )}
      <div className="row">
        {groupMaps.map((h, i) => (
          <div className="row" key={i}>
            {h.map((g, ii) => {
              const groupMatrix = competition.groupMatrix
                ? competition.groupMatrix.find((m) => m.key === g)
                : null;
              return (
                <div key={ii} style={{ gridColumn: ii + 1 }}>
                  <DroppableTeamArea
                    groupHeader={
                      groupMatrix && g === groupMatrix.key
                        ? groupMatrix.name
                        : `Group ${g}`
                    }
                    description={
                      groupMatrix && g === groupMatrix.key
                        ? groupMatrix.description
                        : ""
                    }
                    groupName={g}
                    teams={groups[g]}
                    onDrop={onDrop}
                    onReorder={onReorder}
                    isLocked={isLocked}
                    matches={groupMatches ? groupMatches[g] : null}
                    highlight={highlight}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default GroupPicker;
