import { useNavigate } from "react-router-dom";

import { renderInfoLine } from "../../../utils/textUtils";
import SideBySideView from "../../common/pageSections/sideBySideView";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import cookies from "../../../services/cookieService";
import { submissionsMadeByCompetition } from "../../../utils/competitionsUtil";

const Competitions = ({ competitions, predictions, expired }) => {
  let navigate = useNavigate();
  const { isMobile } = useWindowDimensions();

  if (competitions.length === 0)
    return (
      <p>
        There are {expired ? "no expired" : "currently no active"} competitions.
      </p>
    );

  let submissions = submissionsMadeByCompetition(predictions);

  return competitions.map((c) => {
    return (
      <div className="single-card light-bg" key={c._id}>
        <h2>{c.name}</h2>
        <SideBySideView
          Components={[
            <div key="info">
              {c.prize &&
                renderInfoLine(
                  "Prize",
                  <a
                    href={c.prize.link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {c.prize.text}
                  </a>,
                  "text",
                  "prize",
                  isMobile
                )}
              {renderInfoLine(
                "Submission Deadline",
                c.submissionDeadline,
                "date",
                "deadline",
                isMobile
              )}
              {renderInfoLine(
                "Submissions Allowed",
                c.maxSubmissions,
                "",
                "allowed",
                isMobile
              )}
              {renderInfoLine(
                "Submissions Made",
                submissions[c._id] || 0,
                "",
                "made",
                isMobile
              )}
              {renderInfoLine(
                "Competition Start",
                c.competitionStart,
                "date",
                "start",
                isMobile
              )}
              {renderInfoLine(
                "Competition End",
                c.competitionEnd,
                "date",
                "end",
                isMobile
              )}
            </div>,
            <div key="buttons">
              {!expired && (
                <>
                  {new Date(c.submissionDeadline) < new Date() ? (
                    <p>
                      The submission deadline for this competition has passed
                    </p>
                  ) : (submissions[c._id] || 0) < c.maxSubmissions ? (
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        cookies.addCookie(c.code, true);
                        navigate(`/submissions?id=new&competitionID=${c._id}`);
                      }}
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
              <div style={{ height: 25 }} />
              {submissions[c._id] && (
                <button
                  className="btn btn-light"
                  onClick={() =>
                    navigate(`/submissions?competitionID=${c._id}`)
                  }
                >
                  View Submissions
                </button>
              )}
              <div style={{ height: 25 }} />
              <button
                className="btn btn-info"
                onClick={() =>
                  navigate(
                    `/competitions?leaderboard=show&competitionID=${c._id}&groupID=all`
                  )
                }
              >
                View Leaderboard
              </button>
            </div>,
          ]}
        />
        {c.secondChance && (
          <div>
            <hr />
            <h3>Second Chance</h3>
            {new Date(c.secondChance.availableFrom) > new Date() && (
              <p>
                The second chance competition will become available after all
                group matches have been completed.
              </p>
            )}
            <SideBySideView
              Components={[
                <div key="secondChance.info">
                  {renderInfoLine(
                    "Available From",
                    c.secondChance.availableFrom,
                    "date",
                    "secondChance.available",
                    isMobile
                  )}
                  {renderInfoLine(
                    "Submission Deadline",
                    c.secondChance.submissionDeadline,
                    "date",
                    "secondChance.deadline",
                    isMobile
                  )}
                  {renderInfoLine(
                    "Competition Start",
                    c.secondChance.competitionStart,
                    "date",
                    "secondChance.start",
                    isMobile
                  )}
                </div>,
                <div key="buttons">
                  {!expired && (
                    <>
                      {new Date(c.secondChance.submissionDeadline) <
                      new Date() ? (
                        <p>
                          The submission deadline for the second chance
                          competition has passed
                        </p>
                      ) : new Date(c.secondChance.availableFrom) >
                        new Date() ? (
                        <p>The second chance competition is not ready yet</p>
                      ) : (submissions[c._id + "_sc"] || 0) <
                        (c.secondChance.maxSubmissions || c.maxSubmissions) ? (
                        <div style={{ marginBottom: 25 }}>
                          <button
                            className="btn btn-dark"
                            onClick={() => {
                              cookies.addCookie(c.code, true);
                              navigate(
                                `/submissions?id=new&competitionID=${c._id}&secondChance=true`
                              );
                            }}
                          >
                            Start New Second Chance Submission
                          </button>
                        </div>
                      ) : (
                        <p>
                          You have already made the maximum amount of
                          submissions for this competition.
                        </p>
                      )}
                    </>
                  )}
                  <button
                    className="btn btn-info"
                    onClick={() =>
                      navigate(
                        `/competitions?leaderboard=show&competitionID=${c._id}&groupID=all&secondChance=true`
                      )
                    }
                  >
                    View Second Chance Leaderboard
                  </button>
                </div>,
              ]}
            />
          </div>
        )}
      </div>
    );
  });
};

export default Competitions;
