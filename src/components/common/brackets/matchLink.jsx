import React, { useState, useEffect, useContext, useRef } from "react";

import { getTextX } from "../../../utils/bracketsUtil";
import { shortDate } from "../../../utils/allowables";

const MatchLink = ({ match, textAnchor, width, height }) => {
  const X = getTextX(textAnchor, width);

  return (
    <text
      x={X}
      y={height / 2 + 5}
      className="svg-final-text svg-match-spacer"
      style={{ fontSize: height / 7 }}
    >
      #{match.matchNumber}: {shortDate(match.dateTime)}
    </text>
  );
};

export default MatchLink;
