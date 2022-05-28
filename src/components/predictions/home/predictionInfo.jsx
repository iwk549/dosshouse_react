import React from "react";
import { useNavigate } from "react-router-dom";

import { renderInfoLine } from "../../../utils/textUtils";
import PredictionGroupList from "../groups/predictionGroupList";
import SideBySideView from "../../common/pageSections/sideBySideView";

import useWindowDimensions from "../../../utils/useWindowDimensions";
import Header from "../../common/pageSections/header";

const PredictionInfo = ({
  prediction,
  onRemoveGroup,
  setSelectedSubmission,
  setGroupFormOpen,
  setConfirmDeleteOpen,
  submissionsMade,
}) => {
  let navigate = useNavigate();
  const { isMobile } = useWindowDimensions();

  const renderInfo = (prediction) => {
    return (
      <div className="col">
        {renderInfoLine("Competition", prediction.competitionID?.name)}
        {!isMobile && (
          <>
            {renderInfoLine(
              "Submissions Allowed",
              prediction.competitionID?.maxSubmissions
            )}
            {renderInfoLine("Submissions Made", submissionsMade)}
          </>
        )}
      </div>
    );
  };

  const renderPoints = (points, totalPoints) => {
    return (
      <div className="col">
        {renderInfoLine("Total Points", totalPoints)}
        {!isMobile && (
          <>
            {renderInfoLine("Group", points.group.points)}
            {renderInfoLine("Bracket", points.playoff.points)}
            {renderInfoLine("Champion", points.champion.points)}
            {renderInfoLine("Miscellaneous", points.misc.points)}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="single-card" style={{ backgroundColor: "#f2f2f2" }}>
      <Header text={prediction.name} secondary={true} />
      <SideBySideView
        Components={[
          renderInfo(prediction),
          renderPoints(prediction.points, prediction.totalPoints),
          <>
            {!isMobile && <div style={{ height: 25 }} />}
            <button
              className="btn btn-sm btn-dark"
              onClick={() =>
                navigate(
                  `/predictions?id=${prediction._id}&competitionID=${prediction.competitionID?._id}`
                )
              }
            >
              {new Date(prediction.competitionID?.submissionDeadline) <
              new Date()
                ? "View"
                : "Edit"}
            </button>
            <div style={{ height: 10 }} />
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                setSelectedSubmission(prediction);
                setConfirmDeleteOpen(true);
              }}
            >
              Delete
            </button>
          </>,
        ]}
      />
      <div className="mini-div-line" />
      <PredictionGroupList
        prediction={prediction}
        setSelectedSubmission={setSelectedSubmission}
        setGroupFormOpen={setGroupFormOpen}
        onRemoveGroup={(group) => onRemoveGroup(prediction, group)}
      />
    </div>
  );
};

export default PredictionInfo;
