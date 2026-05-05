import { useEffect, useState } from "react";
import SingleTeamView from "./singleTeamView";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import GroupPicker from "./groupPicker";
import { getCssVar } from "../../../utils/styles";

const PointsBadge = ({ points, style }) => (
  <span className="picks-badge" style={style}>
    {points} {points === 1 ? "pt" : "pts"}
  </span>
);

const PickDots = ({ picks }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
    {picks.map((p, i) => (
      <span
        key={i}
        className={`group-pick-dot${
          p.pending ? " pending" : p.correct ? " correct" : ""
        }`}
      />
    ))}
  </div>
);

const SummaryRow = ({
  label,
  labelMinWidth,
  picks,
  showDots,
  showPoints,
  points,
}) => (
  <div className="single-card summary-row">
    <div className="summary-row-label">
      <strong
        style={
          labelMinWidth
            ? {
                minWidth: labelMinWidth,
                display: "inline-block",
                textAlign: "left",
              }
            : undefined
        }
      >
        {label}
      </strong>
      {showDots && <PickDots picks={picks} />}
    </div>
    {showPoints && <PointsBadge points={points} />}
  </div>
);

const PlayoffRoundDetail = ({
  round,
  label,
  picks,
  showPoints,
  roundPoints,
}) => {
  const { isMobile, isSuperSmall } = useWindowDimensions();
  return (
    <div className="single-card light-bg">
      <div style={{ textAlign: "center" }}>
        <div className="playoff-round-header">
          <span>{label}</span>
          {showPoints && <PointsBadge points={roundPoints} />}
        </div>
      </div>
      <div
        className="auto-fit-team-grid"
        style={{
          "--card-min-width": `${isSuperSmall ? 120 : isMobile ? 140 : 160}px`,
        }}
      >
        {picks.map((pick, idx) => (
          <div key={round + pick.name + idx}>
            <SingleTeamView
              teamName={pick.name}
              asCard
              correct={pick.correct}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const SubmissionListView = ({
  groups,
  playoffMatches,
  misc,
  result,
  competition,
}) => {
  const { isMobile, isSuperSmall, width } = useWindowDimensions();
  const [picksByRound, setPicksByRound] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    let rounds = {};
    playoffMatches.forEach((m) => {
      const pending = !m.highlight;
      const homePick = {
        name: m.homeTeamName,
        correct: !!m.highlight?.includes("home"),
        pending,
      };
      const awayPick = {
        name: m.awayTeamName,
        correct: !!m.highlight?.includes("away"),
        pending,
      };
      if (rounds[m.round]) {
        rounds[m.round].push(homePick, awayPick);
      } else rounds[m.round] = [homePick, awayPick];
    });
    // For partially-filled rounds, mark unverified picks as pending so they
    // don't render as incorrect — verified-correct picks stay green.
    // result.playoff[round].teams is sized to matches*2 with empty strings.
    if (result?.playoff) {
      Object.keys(rounds).forEach((round) => {
        const thisRound = result.playoff.find(
          (r) => Number(r.round) === Number(round),
        );
        if (!thisRound) return;
        const filledTeams = (thisRound.teams || []).filter((t) => t).length;
        if (filledTeams < rounds[round].length) {
          rounds[round].forEach((p) => {
            if (!p.correct) p.pending = true;
          });
        }
      });
    }
    Object.keys(rounds).forEach((round) => {
      rounds[round].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    });
    setPicksByRound(rounds);
  }, [playoffMatches, result]);

  const sortedGroups = Object.keys(groups).sort((a, b) => a - b);
  const sortedPlayoffRounds = Object.keys(picksByRound).sort(
    (a, b) => Number(a) - Number(b),
  );

  const groupRows = sortedGroups.map((g) => {
    const groupScoring = competition?.scoring?.group;
    const teams = groups[g];
    const correctCount = teams.filter((t) => t.correct).length;
    const isPerfect = correctCount === teams.length;
    const points =
      groupScoring.perTeam * correctCount +
      (isPerfect ? groupScoring.bonus || 0 : 0);
    const matrix = competition?.groupMatrix?.find((m) => m.key === g);
    const groupScored = !!result?.group?.find((rg) => rg.groupName === g);
    return {
      key: g,
      label: matrix?.name || g,
      picks: teams.map((t) => ({ correct: t.correct, pending: !groupScored })),
      groupScored,
      points,
    };
  });

  // Champion is rendered as a synthetic round so the playoff loops don't have
  // to special-case it. Its roundInfo.points is the champion bonus, so the
  // generic `points * correctCount` formula yields the right score.
  const playoffRows =
    sortedPlayoffRounds.length > 0
      ? [
          ...sortedPlayoffRounds.map((round) => ({
            key: round,
            round,
            roundInfo: competition?.scoring?.playoff?.find(
              (pr) => String(pr.roundNumber) === round,
            ),
            picks: picksByRound[round],
          })),
          {
            key: "champion",
            round: "champion",
            roundInfo: {
              roundName: "Champion",
              points: competition?.scoring?.champion || 0,
            },
            picks: [
              {
                name: misc?.winner,
                correct: !!(
                  result?.misc?.winner && misc?.winner === result.misc.winner
                ),
                pending: !result?.misc?.winner,
              },
            ],
          },
        ].map((row) => {
          const correctCount = row.picks.filter((p) => p.correct).length;
          const allPending = row.picks.every((p) => p.pending);
          return {
            ...row,
            label:
              row.roundInfo?.roundName || `Round of ${row.picks.length}`,
            roundPoints: (row.roundInfo?.points || 0) * correctCount,
            showDots: !!result,
            showPoints: !!result && !allPending,
          };
        })
      : [];

  const miscPicksList = [];
  competition?.miscPicks?.forEach((p) => {
    const userPick = misc?.[p.name];
    if (!userPick) return;
    const resultValue = result?.misc?.[p.name];
    const pending = !resultValue;
    const correct = !pending && resultValue.includes(userPick);
    miscPicksList.push({
      key: p.name,
      label: p.label,
      teamName: userPick,
      correct,
      pending,
      points: correct ? p.points || 0 : 0,
    });
  });

  return (
    <div>
      {sortedPlayoffRounds.length > 0 && (
        <div
          className="pill-group"
          style={{ justifyContent: "flex-end", padding: 0, marginBottom: 6 }}
        >
          <button
            className={`pill-btn${!showDetail ? " active" : ""}`}
            onClick={() => setShowDetail(false)}
          >
            Summary
          </button>
          <button
            className={`pill-btn${showDetail ? " active" : ""}`}
            onClick={() => setShowDetail(true)}
          >
            Detail
          </button>
        </div>
      )}
      {sortedGroups.length && (
        <>
          <div className="standout-header section-start">Groups</div>
          {showDetail ? (
            <GroupPicker
              groups={groups}
              isLocked={true}
              highlight={{
                backgroundColor: getCssVar("--correct-bg-color", "#66ff73"),
                color: getCssVar("--dark-text", "#1a1a1a"),
                key: "correct",
              }}
              competition={competition}
              availableWidth={width * 0.8}
              compact={true}
            />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${isSuperSmall ? 1 : 2}, 1fr)`,
                gap: 4,
                marginTop: 6,
              }}
              className="single-card light-bg"
            >
              {groupRows.map(({ key, label, picks, groupScored, points }) => (
                <SummaryRow
                  key={key}
                  label={label}
                  picks={picks}
                  showDots={!!result}
                  showPoints={!!result && groupScored}
                  points={points}
                />
              ))}
            </div>
          )}
        </>
      )}
      {sortedPlayoffRounds.length > 0 && (
        <div className="standout-header section-start">Playoffs</div>
      )}
      {!showDetail ? (
        <div className="single-card light-bg summary-list">
          {playoffRows.map((row) => (
            <SummaryRow
              key={row.key}
              label={row.label}
              labelMinWidth={110}
              picks={row.picks}
              showDots={row.showDots}
              showPoints={row.showPoints}
              points={row.roundPoints}
            />
          ))}
        </div>
      ) : (
        playoffRows.map((row) => (
          <PlayoffRoundDetail
            key={row.key}
            round={row.round}
            label={row.label}
            picks={row.picks}
            showPoints={row.showPoints}
            roundPoints={row.roundPoints}
          />
        ))
      )}
      {miscPicksList.length > 0 && (
        <>
          <div className="standout-header section-start">Bonus</div>
          {showDetail ? (
            <div
              className="single-card light-bg auto-fit-team-grid"
              style={{
                "--card-min-width": `${
                  isSuperSmall ? 120 : isMobile ? 140 : 160
                }px`,
              }}
            >
              {miscPicksList.map((p) => (
                <div key={p.key}>
                  <div className="misc-detail-header">
                    <strong>{p.label}</strong>
                    {result && <PointsBadge points={p.points} />}
                  </div>
                  <SingleTeamView
                    teamName={p.teamName}
                    asCard
                    correct={p.correct}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="single-card light-bg"
              style={{ marginTop: 6, padding: 6 }}
            >
              {miscPicksList.map((p) => (
                <SummaryRow
                  key={p.key}
                  label={p.label}
                  labelMinWidth={110}
                  picks={[{ correct: p.correct, pending: p.pending }]}
                  showDots={!!result}
                  showPoints={!!result && !p.pending}
                  points={p.points}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubmissionListView;
