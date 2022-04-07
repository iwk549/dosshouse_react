import React, { useState, useEffect, useContext, useRef } from "react";

import PlayoffBracketCanvas from "../common/brackets/playoffBracketCanvas";
import SingleMatchModal from "./singleMatchModal";
import IconRender from "../common/icons/iconRender";
import logos from "../../textMaps/logos";
import ExternalImage from "../common/image/externalImage";

const BracketPicker = ({ matches, onSelectTeam, isLocked, misc }) => {
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setMatchModalOpen(true);
  };

  const renderImage = (team) => {
    return logos[team] ? (
      <ExternalImage uri={logos[team]} height={20} width="auto" />
    ) : (
      <small className="muted-text">
        <IconRender type="trophy" />
      </small>
    );
  };

  return (
    <>
      <p className="text-center">
        Pick your winner from each match by tapping or clicking the team name.
        Pick your tournament champion by tapping or clicking the team in the
        final match.
      </p>
      <h1 className="pop-box">
        {renderImage(misc.winner)}
        &nbsp;&nbsp;
        {misc.winner || "Pick the Champion"}&nbsp;&nbsp;
        {renderImage(misc.winner)}
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
    </>
  );
};

export default BracketPicker;
