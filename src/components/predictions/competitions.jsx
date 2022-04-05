import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { renderInfoLine } from "../../utils/textUtils";

const Competitions = ({ competitions, predictions, expired }) => {
  let navigate = useNavigate();

  return competitions.map((c) => {
    const submissionsMade = predictions.filter(
      (p) => p.competitionID._id === c._id
    ).length;
    return (
      <React.Fragment key={c._id}>
        <h3>{c.name}</h3>
        <div className="row">
          <div className="col">
            {renderInfoLine(
              "Submission Deadline",
              c.submissionDeadline,
              "date"
            )}
            {renderInfoLine("Submissions Allowed", c.maxSubmissions)}
            {renderInfoLine("Submissions Made", submissionsMade)}
            {renderInfoLine("Competition Start", c.competitionStart, "date")}
            {renderInfoLine("Competition End", c.competitionEnd, "date")}
          </div>
          <div className="col-3">
            {!expired && (
              <>
                {submissionsMade < c.maxSubmissions ? (
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
                    You have already made the maximum amount of submissions for
                    this competition.
                    <br />
                    Delete or edit one of your existing submissions
                  </p>
                )}
              </>
            )}
          </div>
          <hr />
        </div>
      </React.Fragment>
    );
  });
};

export default Competitions;
