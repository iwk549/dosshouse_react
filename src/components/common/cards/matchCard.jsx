import React, { useState, useEffect, useContext, useRef } from "react";

import { shortDate, teamOrder } from "../../../utils/allowables";
import IconRender from "../icons/iconRender";

const MatchCard = ({ data }) => {
  if (data.length === 0) return null;
  const order = teamOrder(data[0].sport);

  return (
    <div style={{ textAlign: "center" }}>
      {data.map((d, idx) => {
        const winner =
          d.homeTeamGoals > d.awayTeamGoals
            ? "home"
            : d.awayTeamGoals > d.homeTeamGoals
            ? "away"
            : d.homeTeamPKs > d.awayTeamPKs
            ? "home"
            : d.awayTeamPKs > d.homeTeamPKs
            ? "away"
            : "";
        return (
          <div key={idx} className="single-card">
            <div className="row">
              {order.map((team, idx) => (
                <div
                  key={team}
                  style={{
                    gridColumn: idx + 1,
                    fontWeight: winner === team ? "bold" : "",
                  }}
                >
                  {idx === 1 &&
                    d.matchAccepted &&
                    d[team + "TeamGoals"] + " - "}
                  {d[team + "TeamName"]}
                  {idx === 0 &&
                    d.matchAccepted &&
                    " - " + d[team + "TeamGoals"]}
                </div>
              ))}
            </div>
            <div>
              <IconRender type="location" /> {d.location}
            </div>
            <div>
              <IconRender type="calendar" /> {shortDate(d.dateTime)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchCard;
