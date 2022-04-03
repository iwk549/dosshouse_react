import React, { useState, useEffect, useContext, useRef } from "react";
import { getLineX } from "../../../utils/bracketsUtil";

const MatchConnector = ({
  position,
  width,
  bracketEnd,
  textAnchor,
  isSemiFinal,
  isFinal,
  isOnlyMatch,
  webpage,
}) => {
  if (isFinal || isSemiFinal || isOnlyMatch) return null;
  const yStart =
    bracketEnd === "top"
      ? position.Y.matchEnd
      : bracketEnd === "bottom"
      ? position.Y.blockStart
      : position.Y.matchEnd;

  const height = position.Y.blockEnd - position.Y.matchEnd;

  const renderLines = () => {
    const X = getLineX(textAnchor, width);
    return textAnchor !== "middle" ? (
      <g>
        <line
          x1={width - X}
          x2={width - X}
          className="svg-bracket-line"
          y1={0}
          y2={height}
          style={{ stroke: webpage?.themeTextColor }}
        />
      </g>
    ) : null;
  };

  return (
    <>
      <g transform={`translate(${position.X}, ${yStart})`}>
        <rect
          width={Math.abs(width)}
          height={Math.abs(height)}
          className="svg-bracket-match"
          style={{ fill: webpage?.logoBgColor }}
        />
        {renderLines()}
      </g>
      {bracketEnd === "middle" && !isFinal && (
        <g transform={`translate(${position.X}, ${position.Y.blockStart})`}>
          <rect
            width={Math.abs(width)}
            height={Math.abs(height)}
            className="svg-bracket-match"
          />
          {renderLines()}
        </g>
      )}
    </>
  );
};

export default MatchConnector;
