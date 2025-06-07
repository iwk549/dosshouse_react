import React from "react";

const Scoring = ({ competition, renderItem }) => {
  const { perTeam, bonus } = competition.scoring.group;
  return (
    <>
      <h3>
        <b>
          <u>Scoring</u>
        </b>
      </h3>
      {renderItem({
        header: "Group Selection",
        body: (
          <p>
            {perTeam} point{perTeam !== 1 ? "s" : ""} for each correctly placed
            team
            <br />
            <br />
            {bonus} point{bonus !== 1 ? "s" : ""} per group where <i>all</i>{" "}
            teams are correctly placed
          </p>
        ),
      })}
      <br />
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
      <br />
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
      {competition.miscPicks && (
        <>
          <br />
          <h3>
            <u>Bonus Scoring</u>
          </h3>
          {!competition?.miscPicks?.length ? (
            <p>There are no bonus picks available for this competition</p>
          ) : (
            competition.miscPicks.map((p, ii) =>
              renderItem(
                {
                  header: p.label,
                  body: <p>{p.points} points</p>,
                },
                ii
              )
            )
          )}
        </>
      )}
    </>
  );
};

export default Scoring;
