import React from "react";

import { longDate, teamOrder } from "../../../utils/allowables";
import IconRender from "../icons/iconRender";
import logos from "../../../textMaps/logos";
import ExternalImage from "../image/externalImage";
import { findCountryLogo } from "../../../utils/predictionsUtil";

const MatchCard = ({ data }) => {
  if (data.length === 0) return null;
  const order = teamOrder(data[0].sport);

  const renderLogo = (teamName) => {
    return (
      <ExternalImage
        uri={logos[findCountryLogo(teamName)]}
        width={15}
        height={15}
      />
    );
  };

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
                <React.Fragment key={team}>
                  <div style={{ position: "absolute", left: 35 }}>
                    {renderLogo(d[team + "TeamName"])}
                  </div>
                  <div style={{ position: "absolute", right: 35 }}>
                    {renderLogo(d[team + "TeamName"])}
                  </div>
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
                </React.Fragment>
              );
            })}
            <div className="mini-div-line" />
            <div>
              <IconRender type="location" /> {d.location}
            </div>
            <div>
              <IconRender type="calendar" /> {longDate(d.dateTime)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchCard;
