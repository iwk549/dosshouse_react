import React, { useState } from "react";

import BasicModal from "../../common/modal/basicModal";
import logos from "../../../textMaps/logos";
import ExternalImage from "../../common/image/externalImage";
import { findCountryLogo } from "../../../utils/predictionsUtil";

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
          <div
            className="single-card text-center row clickable"
            key={idx}
            onClick={() => raiseSelect(team.value)}
          >
            <div style={{ gridColumn: 1 }}>
              <ExternalImage
                uri={logos[findCountryLogo(team.value)]}
                height={15}
                width="auto"
              />
            </div>
            <div style={{ gridColumn: 2 }}>{team.value}</div>
            <div style={{ gridColumn: 3 }}>
              <ExternalImage
                uri={logos[findCountryLogo(team.value)]}
                height={15}
                width="auto"
              />
            </div>
          </div>
        ))}
      </BasicModal>
    </>
  );
};

export default TeamSelectComponent;
