import { useNavigate } from "react-router-dom";

import PredictionGroupList from "../groups/predictionGroupList";
import SideBySideView from "../../common/pageSections/sideBySideView";
import InfoLine from "../../common/pageSections/infoLine";
import TextLink from "../../common/pageSections/textLink";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import ExternalImage from "../../common/image/externalImage";
import logos from "../../../textMaps/logos";
import cookies from "../../../services/cookieService";
import { findCountryLogo } from "../../../utils/predictionsUtil";

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
        {!isMobile && (
          <>
            <InfoLine
              label="Submissions Allowed"
              value={prediction.competitionID?.maxSubmissions}
            />
            <InfoLine label="Submissions Made" value={submissionsMade} />
          </>
        )}
      </div>
    );
  };

  const renderPoints = (points, totalPoints, potentialPoints) => {
    if (!points) return null;

    return (
      <div className="col">
        <InfoLine
          label="Total Points"
          value={totalPoints}
          testId="totalPoints"
        />
        {potentialPoints && (
          <InfoLine
            label="Potential Points"
            value={potentialPoints.realistic}
            testId="potentialPoints"
          />
        )}
        {!isMobile && (
          <>
            <InfoLine label="Group" value={points.group?.points} />
            <InfoLine label="Bracket" value={points.playoff?.points} />
            <InfoLine label="Champion" value={points.champion?.points} />
            <InfoLine label="Miscellaneous" value={points.misc?.points} />
          </>
        )}
      </div>
    );
  };

  const isExpired =
    new Date(prediction.competitionID?.competitionEnd) < new Date();

  const deadlinePassed =
    new Date(
      prediction.isSecondChance
        ? prediction.competitionID?.secondChance?.submissionDeadline
        : prediction.competitionID?.submissionDeadline,
    ) < new Date();

  return (
    <div className="competition-card" data-testid="prediction-info">
      <div className={`competition-card-header submission-card-header${isExpired ? " expired" : ""}`}>
        <h2>{prediction.name}</h2>
        <div className="submission-card-subtitle">
          {prediction.competitionID?.name}
          {prediction.isSecondChance ? " - Second Chance" : null}
        </div>
      </div>
      <div className="competition-card-body">
        <SideBySideView
          Components={[
            <>
              {renderInfo(prediction)}
              {!deadlinePassed && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setSelectedSubmission(prediction);
                    setConfirmDeleteOpen(true);
                  }}
                  data-testid="delete-prediction-button"
                >
                  Delete Submission
                </button>
              )}
            </>,
            renderPoints(
              prediction.points,
              prediction.totalPoints,
              prediction.potentialPoints,
            ),
            <>
              {prediction.misc?.winner && (
                <div className="champion-display">
                  <div className="info-line-label">Champion Picked</div>
                  <div className="champion-pick">
                    <ExternalImage
                      uri={logos[findCountryLogo(prediction.misc?.winner)]}
                      width={30}
                      height={20}
                    />
                    <span data-testid="champion">
                      {prediction.misc?.winner}
                    </span>
                  </div>
                </div>
              )}
              <button
                className="btn btn-md btn-dark btn-block"
                onClick={() => {
                  cookies.addCookie(prediction.competitionID.code, true);
                  navigate(
                    `/submissions?id=${prediction._id}&competitionID=${
                      prediction.competitionID?._id
                    }&secondChance=${!!prediction.isSecondChance}`,
                  );
                }}
              >
                {deadlinePassed ? "View" : "Edit"} Submission
              </button>
              <div className="competition-card-footer">
                <TextLink
                  onClick={() =>
                    navigate(
                      `/competitions?leaderboard=show&competitionID=${
                        prediction.competitionID._id
                      }&groupID=all&secondChance=${!!prediction.isSecondChance}`,
                    )
                  }
                >
                  View Sitewide Leaderboard
                </TextLink>
              </div>
              {submissionsMade < prediction.competitionID?.maxSubmissions && (
                <button
                  className="btn btn-dark"
                  onClick={() =>
                    navigate(
                      `/submissions?id=new&competitionID=${prediction.competitionID._id}`,
                    )
                  }
                >
                  Start Another Prediction
                </button>
              )}
            </>,
          ]}
        />
        <PredictionGroupList
          prediction={prediction}
          setSelectedSubmission={setSelectedSubmission}
          setGroupFormOpen={setGroupFormOpen}
          onRemoveGroup={(group) => onRemoveGroup(prediction, group)}
        />
      </div>
    </div>
  );
};

export default PredictionInfo;
