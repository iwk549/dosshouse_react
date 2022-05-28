import React from "react";
import { useNavigate } from "react-router-dom";

import { renderInfoLine } from "../../../utils/textUtils";
import SideBySideView from "../../common/pageSections/sideBySideView";

const Competitions = ({ competitions, predictions, expired }) => {
  let navigate = useNavigate();

  return competitions.map((c) => {
    const submissionsMade = predictions.filter(
      (p) => p.competitionID?._id === c._id
    ).length;

    return (
      <React.Fragment key={c._id}>
        <h3>{c.name}</h3>
        <SideBySideView
          Components={[
            <div key="info">
              {renderInfoLine(
                "Submission Deadline",
                c.submissionDeadline,
                "date"
              )}
              {renderInfoLine("Submissions Allowed", c.maxSubmissions)}
              {renderInfoLine("Submissions Made", submissionsMade)}
              {renderInfoLine("Competition Start", c.competitionStart, "date")}
              {renderInfoLine("Competition End", c.competitionEnd, "date")}
            </div>,
            <div key="buttons">
              {!expired && (
                <>
                  {new Date(c.submissionDeadline) < new Date() ? (
                    <p>
                      The submission deadline for this competition has passed
                    </p>
                  ) : submissionsMade < c.maxSubmissions ? (
                    <button
                      className="btn btn-dark"
                      onClick={() =>
                        navigate(`/predictions?id=new&competitionID=${c._id}`)
                      }
                    >
                      Start New Submission
                    </button>
                  ) : (
                    <p>
                      You have already made the maximum amount of submissions
                      for this competition.
                    </p>
                  )}
                </>
              )}
              <div style={{ height: 50 }} />
              <button
                className="btn btn-info"
                onClick={() =>
                  navigate(
                    `/predictions?leaderboard=show&competitionID=${c._id}&groupID=all`
                  )
                }
              >
                View Leaderboard
              </button>
              <br />
              <br />
            </div>,
          ]}
        />
      </React.Fragment>
    );
  });
};

export default Competitions;
