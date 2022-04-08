import React, { useState, useEffect, useContext, useRef } from "react";

import { getTeamNameYPlacement } from "../../../utils/bracketsUtil";
import { getTextX, getLineX, offsets } from "../../../utils/bracketsUtil";
import CLinkSvg from "../links/cLinkSvg";

const SingleTeam = ({
  match,
  team,
  textAnchor,
  verticalPosition,
  width,
  height,
  bracketEnd,
  isSemiFinal,
  isFinal,
  webpage,
  isLocked,
  showFullTeamNames,
  onSelectTeam,
}) => {
  const [showTooltip, setShowTooltip] = useState({ show: false, label: "" });
  const Y = getTeamNameYPlacement(verticalPosition, height);
  const X = getTextX(textAnchor, width);

  const style = { stroke: webpage?.themeTextColor };

  const toggleFullTeamName = () => {
    let tooltip = { ...showTooltip };
    tooltip.show = !tooltip.show;
    tooltip.label = match[team + "TeamName"];
    setShowTooltip(tooltip);
  };

  const renderUnderline = () => {
    const lineY = verticalPosition === 0 ? Y + 5 : Y - 18;
    return (
      <line
        x1={offsets.lines}
        x2={width - offsets.lines}
        className={`svg-bracket-line${isFinal ? "-final" : ""}`}
        y1={lineY}
        y2={lineY}
        style={style}
      />
    );
  };

  const renderJoinLine = () => {
    const X = getLineX(textAnchor, width);
    return textAnchor === "middle" ? (
      <g>
        <line
          x1={offsets.lines}
          x2={offsets.lines}
          className={`svg-bracket-line${isFinal ? "-final" : ""}`}
          y1={25}
          y2={height - 28}
          style={style}
        />
        <line
          x1={width - offsets.lines}
          x2={width - offsets.lines}
          className={`svg-bracket-line${isFinal ? "-final" : ""}`}
          y1={25}
          y2={height - 28}
          style={style}
        />
      </g>
    ) : (
      <g>
        <line
          x1={width - X}
          x2={width - X}
          className={`svg-bracket-line${isFinal ? "-final" : ""}`}
          y1={25}
          y2={height - 28}
          style={style}
        />
        {!isSemiFinal && !isFinal && (
          <line
            x1={width - X}
            x2={width - X}
            className="svg-bracket-line"
            y1={bracketEnd === "middle" ? 0 : 25}
            y2={bracketEnd === "bottom" ? 0 : height}
            style={style}
          />
        )}
      </g>
    );
  };

  const otherTeam = team === "home" ? "away" : "home";
  const isWinner =
    match.matchAccepted === 1
      ? match[team + "TeamGoals"] > match[otherTeam + "TeamGoals"] ||
        (match[team + "TeamGoals"] === match[otherTeam + "TeamGoals"] &&
          match[team + "TeamPKs"] > match[otherTeam + "TeamPKs"])
      : false;

  const getLineText = () => {
    const teamName = match[team + "TeamName"];
    const teamAbbreviation =
      match[team + "TeamAbbreviation"] || teamName.slice(0, 6).toUpperCase();

    let teamText =
      (showTooltip.show && showTooltip.label === teamName) || showFullTeamNames
        ? teamName
        : teamAbbreviation;

    let goals = match.matchAccepted
      ? `${match[team + "TeamGoals"]}${
          match[team + "TeamGoals"] === match[otherTeam + "TeamGoals"]
            ? ` (${match[team + "TeamPKs"]})`
            : ""
        }`
      : "";

    if (textAnchor === "end")
      teamText = `${goals ? goals + " - " : ""}${teamText}`;
    else teamText = `${teamText}${goals ? " - " + goals : ""}`;
    return teamText;
  };

  const hasLogo = match[team + "TeamLogo"];

  return (
    <g>
      <CLinkSvg
        x={
          X +
          (hasLogo
            ? textAnchor === "start"
              ? 25
              : textAnchor === "end"
              ? -25
              : 0
            : 0)
        }
        y={Y}
        className="svg-text"
        style={{ textAnchor, fontSize: height / 6 }}
        onMouseOver={() => {
          toggleFullTeamName();
        }}
        onMouseOut={() => {
          toggleFullTeamName();
        }}
        disabled={isLocked}
        boldText={isWinner}
        textColor={null}
        clickHandler={() => onSelectTeam(match, team)}
      >
        {getLineText()}
      </CLinkSvg>
      {renderUnderline()}
      {renderJoinLine()}
      {hasLogo ? (
        <image
          href={match[team + "TeamLogo"]}
          x={
            textAnchor == "middle"
              ? offsets.text
              : X + (hasLogo ? (textAnchor === "start" ? 0 : -20) : 0)
          }
          y={Y - 17 + verticalPosition}
          width={20}
          height={20}
        />
      ) : null}
      {hasLogo && textAnchor === "middle" && (
        <image
          href={match[team + "TeamLogo"]}
          x={width - 28}
          y={Y - 17 + verticalPosition}
          width={20}
          height={20}
        />
      )}
    </g>
  );
};

export default SingleTeam;
