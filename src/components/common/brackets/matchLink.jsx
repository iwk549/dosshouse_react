import React, { useState, useEffect, useContext, useRef } from "react";

import { getTextX } from "../../../utils/bracketsUtil";
import { shortDate } from "../../../utils/allowables";
import CLinkSvg from "../links/cLinkSvg";

const MatchLink = ({ match, textAnchor, width, height, onSelectMatch }) => {
  const X = getTextX(textAnchor, width);

  return (
    <CLinkSvg
      x={X}
      y={height / 2 + 5}
      className="svg-final-text svg-match-spacer"
      style={{ textAnchor, fontSize: height / 7 }}
      clickHandler={onSelectMatch}
      textColor={null}
    >
      #{match.metadata?.matchNumber || match.matchNumber}:{" "}
      {shortDate(match.dateTime, false, true)}
    </CLinkSvg>
  );
};

export default MatchLink;
