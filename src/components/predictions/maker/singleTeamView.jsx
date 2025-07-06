import logos from "../../../textMaps/logos";
import { findCountryLogo } from "../../../utils/predictionsUtil";
import ExternalImage from "../../common/image/externalImage";

const SingleTeamView = ({ teamName, onSelect, asCard }) => {
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
        <ExternalImage
          uri={logos[findCountryLogo(teamName)]}
          height={15}
          width="auto"
        />
      </div>
      <div style={{ gridColumn: 2, fontWeight: asCard ? "" : "bold" }}>
        {teamName}
      </div>
      <div style={{ gridColumn: 3 }}>
        <ExternalImage
          uri={logos[findCountryLogo(teamName)]}
          height={15}
          width="auto"
        />
      </div>
    </div>
  );
};

export default SingleTeamView;
