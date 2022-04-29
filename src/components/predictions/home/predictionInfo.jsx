import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { renderInfoLine } from "../../../utils/textUtils";
import PredictionGroupList from "../groups/predictionGroupList";

const PredictionInfo = ({
  prediction,
  onRemoveGroup,
  setSelectedSubmission,
  setGroupFormOpen,
  setConfirmDeleteOpen,
  submissionsMade,
}) => {
  let navigate = useNavigate();

  const renderInfo = (prediction) => {
    return (
      <div className="col">
        <h4>
          <b>Info</b>
        </h4>
        {renderInfoLine("Submission Name", prediction.name)}
        {renderInfoLine("Competition", prediction.competitionID?.name)}
        {renderInfoLine(
          "Submissions Allowed",
          prediction.competitionID?.maxSubmissions
        )}
        {renderInfoLine("Submissions Made", submissionsMade)}
      </div>
    );
  };

  const renderPoints = (points, totalPoints) => {
    return (
      <div className="col">
        <h4>
          <b>Points</b>
        </h4>
        {renderInfoLine("Total", totalPoints)}
        {renderInfoLine("Group", points.group.points)}
        {renderInfoLine("Bracket", points.playoff.points)}
        {renderInfoLine("Champion", points.champion.points)}
        {renderInfoLine("Miscellaneous", points.misc.points)}
      </div>
    );
  };

  return (
    <>
      <div className="row">
        {renderInfo(prediction)}
        {renderPoints(prediction.points, prediction.totalPoints)}
        <div className="col-2">
          <br />
          <button
            className="btn btn-sm btn-dark"
            onClick={() =>
              navigate(
                `/predictions?id=${prediction._id}&competitionID=${prediction.competitionID?._id}`
              )
            }
          >
            {new Date(prediction.competitionID?.submissionDeadline) < new Date()
              ? "View"
              : "Edit"}
          </button>
          <div style={{ height: 50 }} />
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              setSelectedSubmission(prediction);
              setConfirmDeleteOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mini-div-line" />
      <PredictionGroupList
        prediction={prediction}
        setSelectedSubmission={setSelectedSubmission}
        setGroupFormOpen={setGroupFormOpen}
        onRemoveGroup={(group) => onRemoveGroup(prediction, group)}
      />
    </>
  );
};

export default PredictionInfo;
