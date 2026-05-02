import React from "react";

const Scoring = ({ competition, renderItem }) => {
  if (!competition.scoring) return null;
  const { perTeam, bonus } = competition.scoring.group;
  return (
    <>
      <div className="competition-card info-card">
        <div className="competition-card-header">
          <h3>Scoring</h3>
        </div>
        <div className="competition-card-body">
          {renderItem({
            header: "Group Selection",
            body: (
              <p>
                {perTeam} point{perTeam !== 1 ? "s" : ""} for each correctly
                placed team
                <br />
                <br />
                {bonus} point{bonus !== 1 ? "s" : ""} per group where <i>
                  all
                </i>{" "}
                teams are correctly placed
              </p>
            ),
          })}
          {competition.scoring.playoff &&
            renderItem({
              header: "Playoff Bracket",
              body: competition.scoring.playoff.map((round) => (
                <p key={round.roundName}>
                  {round.points} point{round.points !== 1 ? "s" : ""} for each
                  correct {round.roundName} team
                </p>
              )),
            })}
          {competition.scoring.champion &&
            renderItem({
              header: "Champion",
              body: (
                <p>
                  {competition.scoring.champion} points for picking the correct
                  tournament champion
                </p>
              ),
            })}
        </div>
      </div>
      {competition.miscPicks && (
        <div className="competition-card info-card">
          <div className="competition-card-header">
            <h3>Bonus Scoring</h3>
          </div>
          <div className="competition-card-body">
            {!competition?.miscPicks?.length ? (
              <p>There are no bonus picks available for this competition</p>
            ) : (
              competition.miscPicks.map((p, ii) =>
                renderItem(
                  {
                    header: p.label,
                    body: <p>{p.points} points</p>,
                  },
                  ii,
                ),
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Scoring;
