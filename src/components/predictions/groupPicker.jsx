import React, { useState, useEffect, useContext, useRef } from "react";
import DroppableTeamArea from "./droppableTeamArea";

const GroupPicker = ({ groups, onDrop, onReorder, isLocked, groupMatches }) => {
  return (
    <div className="row">
      {Object.keys(groups).map((g) => {
        return (
          <div className="col" key={g}>
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
  );
};

export default GroupPicker;
