import React, { useState, useEffect, useContext, useRef } from "react";

const SumbittedPredictions = ({ predictions }) => {
  return (
    <div>
      {predictions.map((p) => (
        <>{p.name}</>
      ))}
    </div>
  );
};

export default SumbittedPredictions;
