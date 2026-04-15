import { useNavigate } from "react-router-dom";

import cookies from "../../../services/cookieService";
import { submissionsMadeByCompetition } from "../../../utils/competitionsUtil";
import StatusNote from "../../common/pageSections/statusNote";
import TextLink from "../../common/pageSections/textLink";
import InfoLine from "../../common/pageSections/infoLine";

const Competitions = ({ competitions, predictions, expired }) => {
  let navigate = useNavigate();

  if (competitions.length === 0)
    return (
      <StatusNote>
        There are {expired ? "no expired" : "currently no active"} competitions.
      </StatusNote>
    );

  let submissions = submissionsMadeByCompetition(predictions);

  return competitions.map((c) => {
    const madeCount = submissions[c._id] || 0;
    const deadlinePassed = new Date(c.submissionDeadline) < new Date();
    const maxedOut = madeCount >= c.maxSubmissions;

    return (
      <div className="competition-card" key={c._id}>
        <div className={`competition-card-header${expired ? " expired" : ""}`}>
          <h2>{c.name}</h2>
        </div>

        <div className="competition-card-body">
          <div className="competition-columns">
            <div>
              {c.prize && (
                <InfoLine
                  label="Prize"
                  value={
                    <a
                      href={c.prize.link}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {c.prize.text}
                    </a>
                  }
                />
              )}
              <InfoLine
                label="Submission Deadline"
                value={c.submissionDeadline}
                type="date"
                testId="deadline"
              />
              <InfoLine
                label="Submissions Allowed"
                value={c.maxSubmissions}
                testId="allowed"
              />
              <InfoLine
                label="Submissions Made"
                value={madeCount}
                testId="made"
              />
              <InfoLine
                label="Competition Start"
                value={c.competitionStart}
                type="date"
                testId="start"
              />
              <InfoLine
                label="Competition End"
                value={c.competitionEnd}
                type="date"
                testId="end"
              />
            </div>
            <div className="competition-buttons">
              {!expired && (
                <>
                  {deadlinePassed ? (
                    <StatusNote>Submission deadline has passed</StatusNote>
                  ) : !maxedOut ? (
                    <button
                      className="btn btn-dark btn-block"
                      onClick={() => {
                        cookies.addCookie(c.code, true);
                        navigate(`/submissions?id=new&competitionID=${c._id}`);
                      }}
                    >
                      Start New Submission
                    </button>
                  ) : (
                    <StatusNote>Maximum submissions reached</StatusNote>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="competition-card-footer">
            {submissions[c._id] && (
              <TextLink
                onClick={() => navigate(`/submissions?competitionID=${c._id}`)}
              >
                View Submissions
              </TextLink>
            )}
            <TextLink
              onClick={() =>
                navigate(
                  `/competitions?leaderboard=show&competitionID=${c._id}&groupID=all`,
                )
              }
            >
              View Leaderboard
            </TextLink>
          </div>

          {c.secondChance && (
            <div className="second-chance-panel">
              <div className="second-chance-header">
                <span className="second-chance-badge">Second Chance</span>
                {new Date(c.secondChance.availableFrom) > new Date() && (
                  <span className="second-chance-note">
                    Available after all group matches are completed.
                  </span>
                )}
              </div>

              <div className="competition-columns">
                <div>
                  <InfoLine
                    label="Available From"
                    value={c.secondChance.availableFrom}
                    type="date"
                  />
                  <InfoLine
                    label="Submission Deadline"
                    value={c.secondChance.submissionDeadline}
                    type="date"
                  />
                  <InfoLine
                    label="Competition Start"
                    value={c.secondChance.competitionStart}
                    type="date"
                  />
                </div>
                <div className="competition-buttons">
                  {!expired && (
                    <>
                      {new Date(c.secondChance.submissionDeadline) <
                      new Date() ? (
                        <StatusNote>
                          Second chance deadline has passed
                        </StatusNote>
                      ) : new Date(c.secondChance.availableFrom) >
                        new Date() ? (
                        <StatusNote>Not available yet</StatusNote>
                      ) : (submissions[c._id + "_sc"] || 0) <
                        (c.secondChance.maxSubmissions || c.maxSubmissions) ? (
                        <button
                          className="btn btn-dark btn-block"
                          onClick={() => {
                            cookies.addCookie(c.code, true);
                            navigate(
                              `/submissions?id=new&competitionID=${c._id}&secondChance=true`,
                            );
                          }}
                        >
                          Start Second Chance Submission
                        </button>
                      ) : (
                        <StatusNote>Maximum submissions reached</StatusNote>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="second-chance-footer">
                <TextLink
                  onClick={() =>
                    navigate(
                      `/competitions?leaderboard=show&competitionID=${c._id}&groupID=all&secondChance=true`,
                    )
                  }
                >
                  View Second Chance Leaderboard
                </TextLink>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  });
};

export default Competitions;
