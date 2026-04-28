import logos from "../../../textMaps/logos";
import { findCountryLogo } from "../../../utils/predictionsUtil";
import ExternalImage from "../../common/image/externalImage";

const SingleTeamView = ({ teamName, onSelect, asCard, flagSide }) => {
  const flag = (
    <ExternalImage
      uri={logos[findCountryLogo(teamName)]}
      height={15}
      width="auto"
    />
  );

  return (
    <div
      className={
        (asCard ? "single-card" : "") +
        " text-center row" +
        (onSelect ? " clickable" : "")
      }
      onClick={onSelect ? () => onSelect(teamName) : null}
    >
      <div style={{ gridColumn: 1 }}>
        {flagSide !== "right" && flag}
      </div>
      <div className="single-team-name" style={{ gridColumn: 2, fontWeight: asCard ? "" : "bold" }}>
        {teamName}
      </div>
      <div style={{ gridColumn: 3 }}>
        {flagSide !== "left" && flag}
      </div>
    </div>
  );
};

export default SingleTeamView;
