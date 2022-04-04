import React, { useState, useEffect, useContext, useRef } from "react";
import Input from "../common/form/input";

const HeaderLine = ({ predictionName, setPredictionName, onSave }) => {
  return (
    <div>
      <h3>{predictionName}</h3>
      <div style={{ float: "right", paddingRight: 50 }}>
        <button className="btn btn-sm btn-block btn-dark" onClick={onSave}>
          Save
        </button>
      </div>
      <div>
        <Input
          name="name"
          label="Name this Bracket"
          value={predictionName}
          onChange={(event) => setPredictionName(event.target.value)}
        />
      </div>
    </div>
  );
};

export default HeaderLine;
