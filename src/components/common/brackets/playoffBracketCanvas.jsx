import React, { useState, useEffect, useContext, useRef } from "react";

import useWindowDimensions from "../../../utils/useWindowDimensions";
import { separateAndSplit } from "../../../utils/bracketsUtil";
import SingleMatch from "./singleMatch";
import MatchConnector from "./matchConnector";
// import BracketButtons from "./bracketButtons";
import BracketFinals from "./bracketFinals";

const PlayoffBracketCanvas = ({ matches, onSelectMatch, onSelectTeam }) => {
  const { width, height } = useWindowDimensions();
  const [orientation] = useState("landscape");
  const [selectedBracket] = useState("main");
  const [bracketSize, setBracketSize] = useState({
    width: width < 1280 ? width : 1280,
    height: height < 720 ? height : 720,
    matchHeight: 100,
  });

  useEffect(() => {
    setBracketSize({
      width: width < 1280 ? width : 1280,
      height: height < 720 ? height : 720,
      matchHeight: 100,
    });
  }, []);

  if (matches.length === 0) return null;

  const allRounds = {
    main: [
      ...new Set(
        matches
          .filter((m) => m.round > 0 && m.round <= 10)
          .map((m) => m.round)
          .sort((a, b) => a - b)
      ),
    ],
    secondary: [
      ...new Set(
        matches
          .filter(
            (m) =>
              m.round > 10 &&
              m.round !== 99 &&
              m.round !== 100 &&
              m.round !== 999
          )
          .map((m) => m.round)
          .sort((a, b) => a - b)
      ),
    ],
    prelim: [
      ...new Set(
        matches
          .filter((m) => m.round === 0)
          .map((m) => m.round)
          .sort((a, b) => a - b)
      ),
    ],
    secondFinal: matches.find((m) => m.round === 99),
    thirdFinal: matches.find((m) => m.round === 100),
    losersFinal: matches.find((m) => m.round === 999),
  };

  const getRounds = () => {
    const final = Math.max(...allRounds[selectedBracket]);
    return {
      final,
      semi: final - 1,
    };
  };

  const renderBracket = () => {
    const bracket = separateAndSplit(
      allRounds,
      selectedBracket,
      matches,
      orientation === "landscape"
    );
    let remainingBracketSize = { ...bracketSize };
    const heightOffset =
      selectedBracket === "main"
        ? (allRounds.secondFinal ? bracketSize.matchHeight * 1.6 : 0) +
          (allRounds.thirdFinal ? bracketSize.matchHeight * 1.6 : 0)
        : selectedBracket === "secondary"
        ? bracketSize.matchHeight * 1.6
        : 0;

    remainingBracketSize.height = remainingBracketSize.height - heightOffset;
    return (
      <svg
        height={bracketSize.height}
        width={bracketSize.width}
        className="svg-whole-bracket"
        id="svg-bracket"
      >
        <BracketFinals
          allRounds={allRounds}
          bracketSize={bracketSize}
          selectedBracket={selectedBracket}
          onSelectMatch={onSelectMatch}
          showFullTeamNames={true}
        />
        {bracket.map((roundMatches, i) => {
          let X = (i * remainingBracketSize.width) / bracket.length;
          return roundMatches.map((m, ii) => {
            const blockStart =
              (ii * remainingBracketSize.height) / roundMatches.length +
              heightOffset;
            const blockEnd =
              ((ii + 1) * remainingBracketSize.height) / roundMatches.length +
              heightOffset;
            let Y = {
              start: blockStart,
              end: blockEnd,
            };

            const bracketEnd =
              ii === 0
                ? "top"
                : ii === roundMatches.length - 1
                ? "bottom"
                : "middle";
            const isFinal = m.round === getRounds().final;
            const isSemiFinal =
              m.round === getRounds().semi && orientation === "landscape";
            const textAnchor =
              orientation === "portrait"
                ? "start"
                : isFinal
                ? "middle"
                : i < bracket.length / 2
                ? "start"
                : "end";
            Y =
              isFinal && orientation === "landscape"
                ? {
                    start: remainingBracketSize.height / 2,
                    end: remainingBracketSize.height / 2 + 250,
                  }
                : Y;
            const yMatchStart =
              (Y.end - Y.start) / 2 - bracketSize.matchHeight / 2 + Y.start;
            const matchWidth = remainingBracketSize.width / bracket.length;
            return (
              <g key={m._id}>
                <SingleMatch
                  match={m}
                  textAnchor={textAnchor}
                  width={matchWidth}
                  placement={{ X, Y: yMatchStart }}
                  bracketEnd={bracketEnd}
                  isSemiFinal={isSemiFinal}
                  isFinal={isFinal}
                  matchHeight={bracketSize.matchHeight}
                  onSelectMatch={onSelectMatch}
                  onSelectTeam={onSelectTeam}
                  showFullTeamNames={true}
                />
                <MatchConnector
                  position={{
                    X,
                    Y: {
                      matchStart: yMatchStart,
                      matchEnd: yMatchStart + bracketSize.matchHeight,
                      blockStart,
                      blockEnd,
                    },
                  }}
                  width={matchWidth}
                  textAnchor={textAnchor}
                  isSemiFinal={isSemiFinal}
                  isFinal={isFinal}
                  orientation={orientation}
                  bracketEnd={bracketEnd}
                  isOnlyMatch={roundMatches.length === 1}
                />
              </g>
            );
          });
        })}
      </svg>
    );
  };

  return <div className="text-center">{renderBracket()}</div>;
};

export default PlayoffBracketCanvas;
