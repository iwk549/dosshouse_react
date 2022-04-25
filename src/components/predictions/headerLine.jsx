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
  isLocked,
  missingItems,
}) => {
  const [missingItemsOpen, setMissingItemsOpen] = useState(false);
  const isComplete = missingItems.length === 0;
  return (
    <>
      <div className="row">
        <div className="col">
          <Input
            name="bracketName"
            label="Name this Submission"
            value={predictionName}
            onChange={(event) => setPredictionName(event.target.value)}
          />
        </div>
        <div className="col">
          <h1>
            <b>{competition.name}</b>
          </h1>
        </div>
        <div className="col"></div>
      </div>
      <div
        className={
          "row custom-alert " +
          (isComplete && !isLocked
            ? isSaved
              ? "success"
              : "warning"
            : "danger")
        }
      >
        <div className="col">
          {isLocked
            ? "The submission deadline for this competition is over"
            : `This submission is ${!isComplete ? "not " : ""}complete
            ${
              isComplete
                ? isSaved
                  ? " and has been saved."
                  : ". Save it to lock in your predictions."
                : "."
            }`}
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
      <div className="sticky-top">
        {isSaved ? (
          <button className="pop-box">
            <IconRender type="checkmark" /> Predictions Saved
          </button>
        ) : (
          <button
            className="btn btn-md btn-block btn-dark submit-button sticky-top"
            onClick={onSave}
          >
            <IconRender type="save" size={15} /> Save Predictions
          </button>
        )}
      </div>
      <MissingItems
        items={missingItems}
        isOpen={missingItemsOpen}
        setIsOpen={setMissingItemsOpen}
        name={predictionName}
      />
    </>
  );
};

export default HeaderLine;
