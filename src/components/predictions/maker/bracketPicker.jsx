import React, { useState } from "react";
import TournamentBracket from "react-svg-tournament-bracket";

import SingleMatchModal from "./singleMatchModal";
import IconRender from "../../common/icons/iconRender";
import logos from "../../../textMaps/logos";
import ExternalImage from "../../common/image/externalImage";
import Switch from "../../common/form/switch";
import MatchesModal from "./matchesModal";
import { shortDate } from "../../../utils/allowables";

const BracketPicker = ({
  matches,
  onSelectTeam,
  isLocked,
  misc,
  isPortrait,
  setIsPortrait,
  originalPlayoffMatches,
}) => {
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchesOpen, setMatchesOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const handleSelectMatch = (match) => {
    const originalMatch = originalPlayoffMatches.find(
      (o) =>
        (o.metadata?.matchNumber || o.matchNumber) ===
        (match.metadata?.matchNumber || match.matchNumber)
    );
    setSelectedMatch(originalMatch);
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
      <div className="row">
        <div className="col-2">
          <Switch
            label="Portrait Mode"
            onChange={setIsPortrait}
            value={isPortrait}
            name="orientation"
          />
        </div>
        {!isLocked && (
          <>
            <div className="col">
              <p className="text-center">
                Pick your winner from each match by tapping or clicking the team
                name. Pick your tournament champion by tapping or clicking the
                team in the final match.
              </p>
            </div>

            <div className="col-2">
              <button
                className="btn btn-sm btn-info"
                onClick={() => setMatchesOpen(true)}
              >
                See All Matches
              </button>
            </div>
          </>
        )}
      </div>
      <h1 className="pop-box">
        {renderImage(misc.winner)}
        &nbsp;&nbsp;
        {misc.winner || "Pick the Champion"}&nbsp;&nbsp;
        {renderImage(misc.winner)}
      </h1>
      <TournamentBracket
        matches={matches}
        onSelectMatch={handleSelectMatch}
        onSelectTeam={isLocked ? null : onSelectTeam}
        orientation={isPortrait ? "portrait" : "landscape"}
        backgroundColor="#eeccff"
        lineColor="#999999"
        popColor="#831fe0"
        highlightColor={{
          backgroundColor: "#66ff73",
          color: "#000",
        }}
        dateTimeFormatter={shortDate}
      />
      {selectedMatch && (
        <SingleMatchModal
          isOpen={matchModalOpen}
          setIsOpen={setMatchModalOpen}
          match={selectedMatch}
          finalRoundNumber={Math.max(...matches.map((m) => m.round))}
        />
      )}
      {originalPlayoffMatches && (
        <MatchesModal
          isOpen={matchesOpen}
          setIsOpen={setMatchesOpen}
          matches={originalPlayoffMatches}
          header="Playoff Matches"
        />
      )}
    </>
  );
};

export default BracketPicker;
