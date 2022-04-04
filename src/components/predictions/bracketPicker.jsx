import React, { useState, useEffect, useContext, useRef } from "react";

import PlayoffBracketCanvas from "../common/brackets/playoffBracketCanvas";

const BracketPicker = ({ matches, onSelectTeam }) => {
  const handleSelectMatch = (match) => {
    console.log("open modal");
  };
  return (
    <div>
      <PlayoffBracketCanvas
        matches={matches}
        onSelectMatch={handleSelectMatch}
        onSelectTeam={onSelectTeam}
      />
    </div>
  );
};

export default BracketPicker;
