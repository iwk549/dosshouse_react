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
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const raiseSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <>
      <div className={"single-card light-bg"}>
        <div
          className={isLocked ? "" : " clickable"}
          onClick={() => setIsOpen(!isLocked)}
        >
          <h3>
            <b>{title}</b>
          </h3>
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
          ) : (
            !isLocked && <p>Tap to make your selection</p>
          )}
        </div>
        {children}
      </div>
      <BasicModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        header={
          <h3>
            <b>{title}</b>
          </h3>
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
