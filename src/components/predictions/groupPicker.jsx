import React from "react";
import DroppableTeamArea from "./droppableTeamArea";

const GroupPicker = ({ groups, onDrop, onReorder, isLocked, groupMatches }) => {
  const keys = Object.keys(groups);
  const halfway = Math.ceil(keys.length / 2);
  const halfs = [keys.slice(0, halfway), keys.slice(-halfway)];

  return (
    <>
      <p className="text-center">
        Rearrange the order you predict that each team will finish within their
        group by dragging and dropping or using the arrow buttons.
      </p>
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
                    matches={groupMatches[g]}
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
