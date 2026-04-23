import React, { useState } from "react";

import BasicModal from "../../common/modal/basicModal";
import logos from "../../../textMaps/logos";
import ExternalImage from "../../common/image/externalImage";
import { findCountryLogo } from "../../../utils/predictionsUtil";
import SingleTeamView from "./singleTeamView";

const TeamSelectComponent = ({
  teams,
  onSelect,
  selectedOption,
  isLocked,
  title,
  children,
  compact,
  subtitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const raiseSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <>
      {compact ? (
        <button className="btn btn-sm btn-info" onClick={() => setIsOpen(true)}>
          {title}
        </button>
      ) : (
        <div className={"competition-card"}>
          <div
            className={"competition-card-header active" + (isLocked ? "" : " clickable")}
            onClick={() => setIsOpen(!isLocked)}
          >
            <h2>{title}</h2>
          </div>
          <div
            className={
              "competition-card-body " + (isLocked ? "" : " clickable")
            }
            onClick={() => setIsOpen(!isLocked)}
          >
            {selectedOption ? (
              <>
                <ExternalImage
                  uri={logos[findCountryLogo(selectedOption)]}
                  height={30}
                  width="auto"
                />
                <p>
                  <b>{selectedOption}</b>
                </p>
              </>
            ) : !isLocked ? (
              <p>Tap to make your selection</p>
            ) : (
              <p>
                Not selected
                <br />
                <br />
                <b>Selection Locked</b>
              </p>
            )}
          </div>
          {children}
        </div>
      )}
      <BasicModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        header={
          <>
            <div className="standout-header">{title}</div>
            {subtitle && <p>{subtitle}</p>}
          </>
        }
      >
        {teams.map((team, idx) => (
          <SingleTeamView
            teamName={team.value}
            onSelect={raiseSelect}
            asCard={true}
            key={idx}
          />
        ))}
      </BasicModal>
    </>
  );
};

export default TeamSelectComponent;
