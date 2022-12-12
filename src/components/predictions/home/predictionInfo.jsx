import React from "react";
import { useNavigate } from "react-router-dom";

import { renderInfoLine } from "../../../utils/textUtils";
import PredictionGroupList from "../groups/predictionGroupList";
import SideBySideView from "../../common/pageSections/sideBySideView";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import Header from "../../common/pageSections/header";
import ExternalImage from "../../common/image/externalImage";
import logos from "../../../textMaps/logos";
import cookies from "../../../services/cookieService";

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
        <b>{prediction.competitionID?.name}</b>
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

  const renderPoints = (points, totalPoints, potentialPoints) => {
    return (
      <div className="col">
        {renderInfoLine("Total Points", totalPoints, "", "points", isMobile)}
        {potentialPoints &&
          renderInfoLine(
            "Potential Points",
            potentialPoints.realistic,
            "",
            "points",
            isMobile
          )}
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
    <div className="single-card light-bg" data-testid="prediction-info">
      <Header text={prediction.name} secondary={true} />
      <SideBySideView
        Components={[
          renderInfo(prediction),
          renderPoints(
            prediction.points,
            prediction.totalPoints,
            prediction.potentialPoints
          ),
          <>
            {renderInfoLine(
              "Champion",
              prediction.misc?.winner,
              "",
              "champion",
              isMobile
            )}
            <ExternalImage uri={logos[prediction.misc?.winner]} width="auto" />
            <br />
            {!isMobile && <div style={{ height: 25 }} />}
            <button
              className="btn btn-sm btn-dark"
              onClick={() => {
                cookies.addCookie(prediction.competitionID.code, true);
                navigate(
                  `/predictions?id=${prediction._id}&competitionID=${prediction.competitionID?._id}`
                );
              }}
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
              data-testid="delete-prediction-button"
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
