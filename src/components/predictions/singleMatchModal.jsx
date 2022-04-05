import React, { useState, useEffect, useContext, useRef } from "react";
import BasicModal from "../common/modal/basicModal";

import { longDate, translateRound } from "../../utils/allowables";
import { confirmModalStyle } from "../../utils/styles";

const SingleMatchModal = ({ isOpen, setIsOpen, match, finalRoundNumber }) => {
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
        <p>{match.location}</p>
        <p>{longDate(match.dateTime)}</p>
      </div>
    </BasicModal>
  );
};

export default SingleMatchModal;
