import React from "react";
import IconRender from "../icons/iconRender";
import logos from "../../../textMaps/logos";
import ExternalImage from "../image/externalImage";

const LeaderboardCard = ({ data, onSelect }) => {
  if (data.length === 0) return null;
  return (
    <div style={{ textAlign: "center" }}>
      {data.map((d, idx) => {
        return (
          <div
            className="single-card row clickable"
            key={idx}
            onClick={() => onSelect(d)}
          >
            <div style={{ gridColumn: 1, textAlign: "left" }}>
              <div>
                <IconRender type="ranking" /> {d.ranking}
              </div>
              <div>{d.totalPoints} Pts</div>
            </div>
            <div style={{ gridColumn: 2, textAlign: "center" }}>
              <div style={{ fontWeight: "bold" }}>
                <IconRender type="name" /> {d.name}
              </div>
              <div>
                <IconRender type="user" /> {d.userID.name}
              </div>
            </div>

            <div style={{ gridColumn: 3, textAlign: "right" }}>
              {d.misc?.winner && (
                <ExternalImage
                  uri={logos[d.misc.winner]}
                  height={25}
                  width="auto"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardCard;
