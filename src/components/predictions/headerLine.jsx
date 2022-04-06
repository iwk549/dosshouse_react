import React, { useState, useEffect, useContext, useRef } from "react";
import Input from "../common/form/input";
import IconRender from "../common/icons/iconRender";
import MissingItems from "./missingItems";

const HeaderLine = ({
  predictionName,
  setPredictionName,
  competition,
  onSave,
  isSaved,
  missingItems,
}) => {
  const [missingItemsOpen, setMissingItemsOpen] = useState(false);
  const isComplete = missingItems.length === 0;
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
        {competition.name}
        <div style={{ float: "right" }}>
          {isSaved ? (
            <button className="pop-box">
              <IconRender type="checkmark" /> Predictions Saved
            </button>
          ) : (
            <button
              className="btn btn-sm btn-block btn-dark submit-button"
              onClick={onSave}
            >
              <IconRender type="save" size={12} /> Save Predictions
            </button>
          )}
        </div>
      </h2>
      <div style={{ height: 20 }} />
      {
        <div
          className={
            "row custom-alert " +
            (isComplete ? (isSaved ? "success" : "warning") : "danger")
          }
        >
          <div className="col">
            This submission is {!isComplete ? "not " : ""}complete
            {isComplete
              ? isSaved
                ? " and has been saved."
                : ". Save it to lock in your predictions."
              : "."}
          </div>
          {!isComplete && (
            <div className="col">
              <button
                className="btn btn-sm btn-info"
                onClick={() => setMissingItemsOpen(true)}
              >
                See What's Missing
              </button>
            </div>
          )}
        </div>
      }
      <MissingItems
        items={missingItems}
        isOpen={missingItemsOpen}
        setIsOpen={setMissingItemsOpen}
      />
    </>
  );
};

export default HeaderLine;
