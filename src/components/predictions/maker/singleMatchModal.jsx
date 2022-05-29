import React from "react";

import BasicModal from "../../common/modal/basicModal";
import { longDate, translateRound, teamOrder } from "../../../utils/allowables";
import { confirmModalStyle } from "../../../utils/styles";

const SingleMatchModal = ({ isOpen, setIsOpen, match, finalRoundNumber }) => {
  const teams = teamOrder(match.sport);
  const neededPKs =
    match.homeTeamPKs !== match.awayTeamPKS && match.homeTeamPKs !== 0;
  return (
    <BasicModal isOpen={isOpen} onClose={setIsOpen} style={confirmModalStyle}>
      <div className="text-center">
        <h3>
          <b>Match Number {match.matchNumber}</b>
        </h3>
        <p>{translateRound(match.round, finalRoundNumber)}</p>
        <p>
          {match.homeTeamName} vs {match.awayTeamName}
        </p>
        {match.matchAccepted && (
          <div className="row">
            <div className="col">
              <h3>
                <b>
                  {match[teams[0] + "TeamGoals"]}
                  {neededPKs && (
                    <>
                      &nbsp;&nbsp;<small>({match[teams[0] + "TeamPKs"]})</small>
                    </>
                  )}
                </b>
              </h3>
            </div>
            <div className="col">
              <h3>
                {neededPKs && (
                  <>
                    <small>({match[teams[0] + "TeamPKs"]})</small>&nbsp;&nbsp;
                  </>
                )}
                <b>{match[teams[1] + "TeamGoals"]}</b>
              </h3>
            </div>
          </div>
        )}
        <p>{match.location}</p>
        <p>{longDate(match.dateTime)}</p>
      </div>
    </BasicModal>
  );
};

export default SingleMatchModal;
