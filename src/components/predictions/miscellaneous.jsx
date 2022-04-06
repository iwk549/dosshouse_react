import React, { useState, useEffect, useContext, useRef } from "react";

import Select from "../common/form/select";
import Tooltip from "../common/tooltip/tooltip";
import { getFinalRound } from "../../utils/bracketsUtil";

const Miscellaneous = ({
  playoffMatches,
  misc,
  onChange,
  competition,
  allTeams,
}) => {
  const mappedTeams = allTeams
    .sort((a, b) => (a > b ? 1 : -1))
    .map((t) => {
      return { _id: t, label: t };
    });
  const final = playoffMatches.find(
    (m) => m.round === getFinalRound(playoffMatches)
  );

  const getThirdPlacePlayoff = () => {
    const semiFinals = playoffMatches.filter(
      (m) => m.round === getFinalRound(playoffMatches) - 1
    );
    const thirdPlaceMatch = [];
    ["home", "away"].forEach((t, idx) => {
      const finalist = final[t + "TeamName"];
      if (finalist.toLowerCase().includes("winner"))
        thirdPlaceMatch.push({
          label: "Loser " + final.getTeamsFrom[t].matchNumber,
          id: idx,
        });
      else {
        let losingTeam = "";
        ["home", "away"].forEach((t1) => {
          const semiFinal = semiFinals.find(
            (m) => m[t1 + "TeamName"] === finalist
          );
          if (semiFinal) {
            losingTeam =
              semiFinal[(t1 === "home" ? "away" : "home") + "TeamName"];
          }
        });
        thirdPlaceMatch.push({ label: losingTeam, _id: t });
      }
    });
    return thirdPlaceMatch;
  };

  return (
    <div>
      {competition?.miscPicks.map((p) => (
        <React.Fragment key={p.name}>
          <Select
            name={p.name}
            label={p.label}
            onChange={(value) => onChange(p.name, value)}
            options={
              p.name === "thirdPlace" ? getThirdPlacePlayoff() : mappedTeams
            }
            selectedOption={misc[p.name]}
            tooltip={{
              direction: "right",
              content: (
                <span className="tooltip-content-mini">
                  <p>
                    <b>{p.label}</b>
                    <br />
                    {p.description}
                  </p>
                </span>
              ),
            }}
          />
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Miscellaneous;
