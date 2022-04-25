import React from "react";
import DroppableTeamArea from "./droppableTeamArea";

const GroupPicker = ({ groups, onDrop, onReorder, isLocked, groupMatches }) => {
  const keys = Object.keys(groups);
  const halfway = Math.ceil(keys.length / 2);
  const halfs = [keys.slice(0, halfway), keys.slice(-halfway)];

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
        {halfs.map((h, i) => (
          <div className="row" key={i}>
            {h.map((g, ii) => {
              return (
                <div className="col" key={ii}>
                  <DroppableTeamArea
                    groupName={g}
                    teams={groups[g]}
                    onDrop={onDrop}
                    onReorder={onReorder}
                    isLocked={isLocked}
                    matches={groupMatches ? groupMatches[g] : null}
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
