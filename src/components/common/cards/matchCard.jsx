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
        const wentToPks =
          d.homeTeamGoals === d.awayTeamGoals &&
          d.homeTeamPKs !== d.awayTeamPKs;
        return (
          <div key={idx} className="single-card">
            {order.map((team, idx) => {
              const otherTeam = team === "home" ? "away" : "home";
              return (
                <div key={team}>
                  <div
                    style={{
                      fontWeight: winner === team ? "bold" : "",
                    }}
                  >
                    {d[team + "TeamName"]}
                  </div>
                  {idx === 0 && d.matchAccepted && (
                    <div>
                      {d[team + "TeamGoals"]}
                      {wentToPks ? ` (${d[team + "TeamPKs"]})` : ""} -{" "}
                      {wentToPks ? `(${d[otherTeam + "TeamPKs"]}) ` : ""}
                      {d[otherTeam + "TeamGoals"]}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mini-div-line" />
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
