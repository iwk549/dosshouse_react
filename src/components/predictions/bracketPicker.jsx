import React, { useState, useEffect, useContext, useRef } from "react";

import PlayoffBracketCanvas from "../common/brackets/playoffBracketCanvas";

const BracketPicker = ({ matches }) => {
  const handleSelectMatch = (match) => {
    console.log(match);
  };
  return (
    <div>
      <PlayoffBracketCanvas matches={matches} />
    </div>
  );
};

export default BracketPicker;
