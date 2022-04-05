import React, { useState, useEffect, useContext, useRef } from "react";

import PlayoffBracketCanvas from "../common/brackets/playoffBracketCanvas";
import SingleMatchModal from "./singleMatchModal";

const BracketPicker = ({ matches, onSelectTeam, isLocked, misc }) => {
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setMatchModalOpen(true);
  };

  return (
    <div>
      <h1 className="pop-box">
        <small className="muted-text">Champion:</small> {misc.winner}
      </h1>
      <PlayoffBracketCanvas
        matches={matches}
        onSelectMatch={handleSelectMatch}
        onSelectTeam={onSelectTeam}
        isLocked={isLocked}
      />
      {selectedMatch && (
        <SingleMatchModal
          isOpen={matchModalOpen}
          setIsOpen={setMatchModalOpen}
          match={selectedMatch}
          finalRoundNumber={Math.max(...matches.map((m) => m.round))}
        />
      )}
    </div>
  );
};

export default BracketPicker;
