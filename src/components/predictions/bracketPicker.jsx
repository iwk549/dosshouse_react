import React, { useState, useEffect, useContext, useRef } from "react";

import PlayoffBracketCanvas from "../common/brackets/playoffBracketCanvas";
import SingleMatchModal from "./singleMatchModal";
import IconRender from "../common/icons/iconRender";

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
        <small className="muted-text">
          <IconRender type="trophy" />
        </small>{" "}
        {misc.winner || "Pick the Champion"}{" "}
        <small className="muted-text">
          <IconRender type="trophy" />
        </small>
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
