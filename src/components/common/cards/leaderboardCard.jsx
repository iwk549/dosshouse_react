import IconRender from "../icons/iconRender";
import logos from "../../../textMaps/logos";
import ExternalImage from "../image/externalImage";
import { findCountryLogo } from "../../../utils/predictionsUtil";
import { getTeamAbbreviation } from "../../../utils/bracketsUtil";

const LeaderboardCard = ({ data, onSelect }) => {
  if (data.length === 0) return null;
  return (
    <div style={{ textAlign: "center", padding: "0 10px" }}>
      {data.map((d, idx) => {
        return (
          <div
            className="single-card row clickable"
            key={idx}
            style={{ gridTemplateColumns: "50px 1fr auto auto" }}
            onClick={() => onSelect(d)}
          >
            <div style={{ gridColumn: 1, textAlign: "left" }}>
              <div><IconRender type="ranking" /> {d.ranking}</div>
              <div>{d.totalPoints} Pts</div>
              <span className="picks-badge" style={{ marginLeft: 0, display: "inline-block", minWidth: "unset" }}>{d.totalPicks || 0} ✓</span>
            </div>
            <div style={{ gridColumn: 2, textAlign: "left", paddingLeft: 12 }}>
              <div style={{ fontWeight: "bold" }}>
                <IconRender type="name" /> {d.name}
              </div>
              <div>
                <IconRender type="user" /> {d.userID?.name}
              </div>
            </div>

            <div style={{ gridColumn: 3, textAlign: "right", paddingRight: 8, fontSize: "0.8em", color: "gray" }}>
              {d.potentialPoints?.realistic > 0 && (
                <>
                  <div>{d.potentialPoints.realistic}</div>
                  <div>pot</div>
                </>
              )}
            </div>
            <div style={{ gridColumn: 4, textAlign: "right" }}>
              {d.misc?.winner && (
                <>
                  <b>{getTeamAbbreviation(d.misc?.winner)}</b>
                  <br />
                  <ExternalImage
                    uri={logos[findCountryLogo(d.misc.winner)]}
                    height={15}
                    width="auto"
                  />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardCard;
