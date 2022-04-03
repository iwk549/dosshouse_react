import React, { useState, useEffect, useContext, useRef } from "react";

import { teamOrder } from "../../../utils/allowables";
import SingleTeam from "./singleTeam";
import MatchLink from "./matchLink";

const SingleMatch = ({
  match,
  textAnchor,
  width,
  placement,
  bracketEnd,
  isSemiFinal,
  isFinal,
  matchHeight,
  spectate,
  onSelectMatch,
  webpage,
  showFullTeamNames,
  dontSliceTime,
}) => {
  const handleSelectMatch = () => {
    onSelectMatch(match);
  };
  return (
    <g transform={`translate(${placement.X}, ${placement.Y})`}>
      <rect
        width={Math.abs(width)}
        height={Math.abs(matchHeight)}
        className="svg-bracket-match"
        style={{ fill: webpage?.logoBgColor }}
      />
      {teamOrder(match.sport).map((t, i) => {
        return (
          <React.Fragment key={t}>
            <SingleTeam
              match={match}
              team={t}
              verticalPosition={i}
              textAnchor={textAnchor}
              width={width}
              height={matchHeight}
              bracketEnd={bracketEnd}
              isSemiFinal={isSemiFinal}
              isFinal={isFinal}
              spectate={spectate}
              webpage={webpage}
              showFullTeamNames={showFullTeamNames}
            />
            {i === 0 && (
              <MatchLink
                match={match}
                textAnchor={textAnchor}
                width={width}
                height={matchHeight}
                onSelectMatch={onSelectMatch ? handleSelectMatch : null}
                webpage={webpage}
                dontSliceTime={dontSliceTime}
              />
            )}
          </React.Fragment>
        );
      })}
    </g>
  );
};

export default SingleMatch;
