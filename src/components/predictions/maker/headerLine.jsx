import React, { useState, useRef } from "react";
import Input from "../../common/form/input";
import IconRender from "../../common/icons/iconRender";
import MissingItems from "./missingItems";

const HeaderLine = ({
  predictionName,
  setPredictionName,
  competition,
  onSave,
  isSaved,
  isLocked,
  missingItems,
  onClickMissingItem,
  isSecondChance,
}) => {
  const nameInputRef = useRef(null);

  const [missingItemsOpen, setMissingItemsOpen] = useState(false);
  const isComplete = missingItems.length === 0;

  const raiseClickMissingItem = (item) => {
    if (item.label.toLowerCase() === "name") {
      nameInputRef.current.focus();
    } else onClickMissingItem(item);
  };

  return (
    <>
      <div className="standout-header">
        {competition?.name}
        {isSecondChance && (
          <div style={{ fontSize: "0.65em", fontWeight: "normal" }}>
            Second Chance
          </div>
        )}
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
            : `This submission is ${!isComplete ? "not " : ""}complete${
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
              See What&apos;s Missing
            </button>
          </div>
        )}
      </div>{" "}
      <div className="sticky-top">
        {isSaved ? (
          <button className="pop-box">
            <IconRender type="checkmark" /> Submission Saved
          </button>
        ) : (
          <button
            className="btn btn-lg btn-dark"
            style={{
              marginTop: 15,
              minWidth: 250,
              boxShadow: "0 2px 10px rgba(0, 102, 9, 0.6)",
            }}
            onClick={onSave}
          >
            <IconRender type="save" size={15} /> Save Submission
          </button>
        )}
      </div>
      <div className="standout-input-wrap">
        <div className="standout-input">
          <Input
            name="bracketName"
            label="Give this Submission a Name"
            value={predictionName}
            onChange={(event) => setPredictionName(event.target.value)}
            drillRef={nameInputRef}
            style={{ fontSize: "1.1em", width: "90%" }}
          />
        </div>
      </div>
      <MissingItems
        items={missingItems}
        isOpen={missingItemsOpen}
        setIsOpen={setMissingItemsOpen}
        name={predictionName}
        onClickMissingItem={raiseClickMissingItem}
      />
    </>
  );
};

export default HeaderLine;
