import React, { useState, useEffect, useContext, useRef } from "react";

import BracketFinal from "./bracketFinal";

const BracketFinals = ({
  allRounds,
  bracketSize,
  selectedBracket,
  onSelectMatch,
  webpage,
  showFullTeamNames,
}) => {
  const mainBracketXPlacement = bracketSize.width / 4;
  const mainBracketMatchWidth = bracketSize.width / 2;
  const secondaryBracketXPlacement =
    bracketSize.width - bracketSize.width / 4 - 5;
  const secondaryBracketMatchWidth = bracketSize.width / 4 - 5;
  return (
    <>
      {allRounds.secondFinal && selectedBracket === "main" && (
        <BracketFinal
          match={allRounds.secondFinal}
          bracketSize={bracketSize}
          placement={{
            X: mainBracketXPlacement,
            Y: allRounds.thirdFinal ? bracketSize.matchHeight * 1.6 : 40,
          }}
          header="Main Bracket Winner vs Secondary Bracket Winner"
          width={mainBracketMatchWidth}
          onSelectMatch={onSelectMatch}
          webpage={webpage}
          showFullTeamNames={showFullTeamNames}
        />
      )}
      {allRounds.thirdFinal && selectedBracket === "main" && (
        <BracketFinal
          match={allRounds.thirdFinal}
          bracketSize={bracketSize}
          placement={{
            X: mainBracketXPlacement,
            Y: 30,
          }}
          header="Second Chance Final"
          width={mainBracketMatchWidth}
          onSelectMatch={onSelectMatch}
          webpage={webpage}
          showFullTeamNames={showFullTeamNames}
        />
      )}
      {allRounds.losersFinal && selectedBracket === "secondary" && (
        <BracketFinal
          match={allRounds.losersFinal}
          bracketSize={bracketSize}
          placement={{
            X: mainBracketXPlacement,
            Y: 30,
          }}
          width={mainBracketMatchWidth}
          header="Secondary Bracket Final"
          onSelectMatch={onSelectMatch}
          webpage={webpage}
          showFullTeamNames={showFullTeamNames}
        />
      )}
    </>
  );
};

export default BracketFinals;
