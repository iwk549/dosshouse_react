import React, { useState, useEffect, useContext, useRef } from "react";
import Select from "../common/form/select";

const Miscellaneous = ({ playoffMatches, misc, onChange }) => {
  const finalRound = Math.max(...playoffMatches.map((m) => m.round));

  const final = playoffMatches.find((m) => m.round === finalRound);

  const getThirdPlacePlayoff = () => {
    const semiFinals = playoffMatches.filter((m) => m.round === finalRound - 1);
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
        thirdPlaceMatch.push({ label: losingTeam, id: idx });
      }
    });
    return thirdPlaceMatch;
  };

  return (
    <div>
      <h2>Winner</h2>
      <Select
        name="winner"
        label="Winner"
        value={misc.thirdPlace}
        options={getThirdPlacePlayoff()}
      />
    </div>
  );
};

export default Miscellaneous;
