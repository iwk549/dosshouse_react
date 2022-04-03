import React, { useState, useEffect, useContext, useRef } from "react";

import SingleMatch from "./singleMatch";

const BracketFinal = ({
  match,
  bracketSize,
  placement,
  header,
  width,
  onSelectMatch,
  webpage,
  showFullTeamNames,
}) => {
  const style = { stroke: webpage?.themeTextColor, strokeWidth: 2 };
  return (
    <g>
      <text
        x={width / 2 + placement.X}
        y={placement.Y - 5}
        textAnchor="middle"
        fontSize={bracketSize.matchHeight / 5}
        className="svg-text-header"
        style={{
          stroke: webpage?.themeTextColor,
          fill: webpage?.themeTextColor,
        }}
      >
        {header}
      </text>
      <SingleMatch
        match={match}
        textAnchor={"middle"}
        width={width || bracketSize.width / 2}
        placement={placement}
        bracketEnd={"middle"}
        isSemiFinal={false}
        isFinal={true}
        matchHeight={bracketSize.matchHeight}
        onSelectMatch={onSelectMatch}
        webpage={webpage}
        showFullTeamNames={showFullTeamNames}
      />
      {/* top */}
      <line
        x1={placement.X}
        x2={placement.X + width}
        y1={placement.Y}
        y2={placement.Y}
        className="svg-bracket-line-final"
        style={style}
      />
      {/* bottom */}
      <line
        x1={placement.X}
        x2={placement.X + width}
        y1={placement.Y + bracketSize.matchHeight}
        y2={placement.Y + bracketSize.matchHeight}
        className="svg-bracket-line-final"
        style={style}
      />
      {/* left */}
      <line
        x1={placement.X}
        x2={placement.X}
        y1={placement.Y}
        y2={placement.Y + bracketSize.matchHeight}
        className="svg-bracket-line-final"
        style={style}
      />
      {/* right */}
      <line
        x1={placement.X + width}
        x2={placement.X + width}
        y1={placement.Y}
        y2={placement.Y + bracketSize.matchHeight}
        className="svg-bracket-line-final"
        style={style}
      />
    </g>
  );
};

export default BracketFinal;
