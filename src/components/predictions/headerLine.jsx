import React, { useState, useEffect, useContext, useRef } from "react";
import Input from "../common/form/input";

const HeaderLine = ({ predictionName, setPredictionName, onSave, isSaved }) => {
  return (
    <div>
      <div className="row">
        <div className="col">
          <Input
            name="name"
            label="Name this Bracket"
            value={predictionName}
            onChange={(event) => setPredictionName(event.target.value)}
          />
        </div>
        <div className="col">
          <h2>{predictionName}</h2>
        </div>
        <div className="col">
          {isSaved ? (
            <div>
              <h4 className="pop-box">Predictions Saved</h4>
            </div>
          ) : (
            <button
              className="btn btn-md btn-block btn-dark submit-button"
              onClick={onSave}
            >
              Save Predictions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderLine;
