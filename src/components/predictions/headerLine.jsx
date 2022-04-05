import React, { useState, useEffect, useContext, useRef } from "react";
import Input from "../common/form/input";

const HeaderLine = ({ predictionName, setPredictionName, onSave, isSaved }) => {
  return (
    <>
      <h2 className="text-center">
        <div style={{ float: "left" }}>
          <Input
            name="bracketName"
            label="Name this Bracket"
            value={predictionName}
            onChange={(event) => setPredictionName(event.target.value)}
          />
        </div>
        {predictionName || "-----"}
        <div style={{ float: "right" }}>
          {isSaved ? (
            <div>
              <h4 className="pop-box">Predictions Saved</h4>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-block btn-dark submit-button"
              onClick={onSave}
            >
              Save Predictions
            </button>
          )}
        </div>
      </h2>
      <div style={{ height: 10 }} />
    </>
  );
};

export default HeaderLine;
