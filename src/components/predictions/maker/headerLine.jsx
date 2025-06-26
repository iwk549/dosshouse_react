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
      <Input
        name="bracketName"
        label="Name this Submission"
        value={predictionName}
        onChange={(event) => setPredictionName(event.target.value)}
        drillRef={nameInputRef}
      />
      <h1>
        <b>
          {competition?.name}
          {isSecondChance ? <small> - Second Chance</small> : null}
        </b>
      </h1>
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
      </div>
      <div className="sticky-top">
        {isSaved ? (
          <button className="pop-box">
            <IconRender type="checkmark" /> Prediction Saved
          </button>
        ) : (
          <button
            className="btn btn-md btn-block btn-dark submit-button sticky-top"
            onClick={onSave}
          >
            <IconRender type="save" size={15} /> Save Prediction
          </button>
        )}
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
