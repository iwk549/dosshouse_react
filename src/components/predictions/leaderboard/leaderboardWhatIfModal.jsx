import { useContext, useEffect, useState } from "react";
import BasicModal from "../../common/modal/basicModal";
import SingleTeamView from "../maker/singleTeamView";
import IconRender from "../../common/icons/iconRender";
import StatusNote from "../../common/pageSections/statusNote";
import PillSort from "../../common/searchSort/pillSort";
import LoadingContext from "../../../context/loadingContext";

const WHAT_IF_TOP_N = 5;

const ordinal = (n) => ["1st", "2nd", "3rd"][n - 1] || `${n}th`;

const FinalistsRow = ({
  sf1Winner,
  sf2Winner,
  thirdPlaces,
  topSubmissions,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="whatif-finalists-row">
      <div
        className="whatif-finalists-header clickable"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="whatif-path-semi">
          <div className="result-section-label">Finalist 1</div>
          <SingleTeamView teamName={sf1Winner} flagSide="right" />
        </div>
        <div className="whatif-path-semi">
          <div className="result-section-label">Finalist 2</div>
          <SingleTeamView teamName={sf2Winner} flagSide="left" />
        </div>
        {thirdPlaces.length > 0 && (
          <div className="whatif-path-third">
            <div className="result-section-label">3rd</div>
            {thirdPlaces.map((t, i) => (
              <div key={i} className="whatif-path-third-name">
                {t}
              </div>
            ))}
          </div>
        )}
        <IconRender type={expanded ? "up" : "down"} size={14} />
      </div>
      {expanded && (
        <div className="whatif-top-three">
          {topSubmissions.map((entry) => (
            <div
              key={entry.predictionID._id}
              className="whatif-top-three-entry"
            >
              <span className="whatif-top-three-rank">{entry.rank}</span>
              <span className="whatif-top-three-name">
                {entry.predictionID.name}
              </span>
              <span className="whatif-top-three-user">{entry.userID.name}</span>
              <span className="whatif-top-three-points">
                {entry.pointsMin === entry.pointsMax
                  ? `${entry.pointsMin} pts`
                  : `${entry.pointsMin}-${entry.pointsMax} pts`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const mergeTopSubmissions = (groupPaths, leaderKey) => {
  const ref = groupPaths[0][leaderKey];
  return ref.map((entry, i) => {
    const allPoints = groupPaths
      .map((p) => p[leaderKey][i]?.totalPoints)
      .filter(Number.isFinite);
    return {
      ...entry,
      pointsMin: Math.min(...allPoints),
      pointsMax: Math.max(...allPoints),
    };
  });
};

const buildFinalistRows = (paths, leaderKey) => {
  const groups = {};
  paths.forEach((path) => {
    const key = `${path.sf1Winner}|${path.sf2Winner}`;
    if (!groups[key])
      groups[key] = {
        sf1Winner: path.sf1Winner,
        sf2Winner: path.sf2Winner,
        paths: [],
      };
    groups[key].paths.push(path);
  });

  const rows = [];
  Object.values(groups).forEach(
    ({ sf1Winner, sf2Winner, paths: groupPaths }) => {
      if (groupPaths.length === 1) {
        const p = groupPaths[0];
        rows.push({
          sf1Winner,
          sf2Winner,
          thirdPlaces: p.thirdPlace ? [p.thirdPlace] : [],
          topSubmissions: mergeTopSubmissions(groupPaths, leaderKey),
        });
        return;
      }

      const ref = groupPaths[0][leaderKey];
      const allSame = groupPaths.every((p) => {
        const top = p[leaderKey];
        return Array.from({ length: WHAT_IF_TOP_N - 1 }, (_, i) => i + 1).every(
          (i) => top[i]?.predictionID._id === ref[i]?.predictionID._id,
        );
      });

      if (allSame) {
        rows.push({
          sf1Winner,
          sf2Winner,
          thirdPlaces: groupPaths.map((p) => p.thirdPlace).filter(Boolean),
          topSubmissions: mergeTopSubmissions(groupPaths, leaderKey),
        });
      } else {
        groupPaths.forEach((p) => {
          rows.push({
            sf1Winner,
            sf2Winner,
            thirdPlaces: p.thirdPlace ? [p.thirdPlace] : [],
            topSubmissions: mergeTopSubmissions([p], leaderKey),
          });
        });
      }
    },
  );

  return rows;
};

const ChampionGroup = ({ champion, paths, leaderKey }) => (
  <div className="whatif-path-row">
    <div className="whatif-path-champion">
      <div className="result-section-label">Champion</div>
      <SingleTeamView teamName={champion} />
    </div>
    {buildFinalistRows(paths, leaderKey).map((row, i) => (
      <FinalistsRow
        key={i}
        sf1Winner={row.sf1Winner}
        sf2Winner={row.sf2Winner}
        thirdPlaces={row.thirdPlaces}
        topSubmissions={row.topSubmissions}
      />
    ))}
  </div>
);

const ChampionCard = ({ champion, paths, leaderKey }) => (
  <div className="single-card whatif-winner-card">
    <div className="whatif-winner-name">
      <SingleTeamView teamName={champion} />
    </div>
    <div className="whatif-winner-meta">
      {paths.length} scenario{paths.length !== 1 ? "s" : ""}
    </div>
    {buildFinalistRows(paths, leaderKey).map((row, i) => (
      <FinalistsRow
        key={i}
        sf1Winner={row.sf1Winner}
        sf2Winner={row.sf2Winner}
        thirdPlaces={row.thirdPlaces}
        topSubmissions={row.topSubmissions}
      />
    ))}
  </div>
);

const groupByChampion = (paths) => {
  const groups = {};
  paths.forEach((path) => {
    if (!groups[path.champion]) groups[path.champion] = [];
    groups[path.champion].push(path);
  });
  return Object.entries(groups);
};

const UserScenariosView = ({ allPaths, user, leaderKey }) => {
  const byRank = {};
  allPaths.forEach((path) => {
    const entry = path[leaderKey].find(
      (e) => String(e.userID._id) === String(user._id),
    );
    if (!entry) return;
    if (!byRank[entry.rank]) byRank[entry.rank] = [];
    byRank[entry.rank].push(path);
  });

  if (!Object.keys(byRank).length)
    return (
      <StatusNote>
        You don&apos;t appear in the top {WHAT_IF_TOP_N} in any scenario.
      </StatusNote>
    );

  return Object.entries(byRank)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([rank, paths]) => (
      <div key={rank} className="single-card whatif-winner-card">
        <div className="whatif-winner-name">Finish {ordinal(Number(rank))}</div>
        <div className="whatif-winner-meta">
          {paths.length} scenario{paths.length !== 1 ? "s" : ""}
        </div>
        {groupByChampion(paths).map(([champion, championPaths]) => (
          <ChampionGroup
            key={champion}
            champion={champion}
            paths={championPaths}
            leaderKey={leaderKey}
          />
        ))}
      </div>
    ));
};

const LeaderboardWhatIfModal = ({
  isOpen,
  setIsOpen,
  whatIfData,
  isSecondChance,
}) => {
  const { user } = useContext(LoadingContext);
  const [mappedByEntry, setMappedByEntry] = useState({});
  const [mappedByChampion, setMappedByChampion] = useState([]);
  const [view, setView] = useState("champion");

  const leaderKey = isSecondChance
    ? "secondChanceTopSubmissions"
    : "topSubmissions";

  const viewOptions = [
    { label: "By Champion", value: "champion" },
    { label: "By Submission", value: "submissions" },
    ...(user ? [{ label: "My Scenarios", value: "mine" }] : []),
  ];

  useEffect(() => {
    const winners = {};
    whatIfData?.paths?.forEach((path) => {
      const top = path[leaderKey][0];
      if (!top) return;
      const id = top.predictionID._id;
      if (winners[id]) winners[id].push(path);
      else winners[id] = [path];
    });
    Object.values(winners).forEach((paths) =>
      paths.sort((a, b) => a.champion.localeCompare(b.champion)),
    );
    setMappedByEntry(winners);
    setMappedByChampion(
      groupByChampion(whatIfData?.paths || []).sort(([a], [b]) =>
        a.localeCompare(b),
      ),
    );
  }, [whatIfData, isSecondChance]);

  const hasData = !!Object.keys(mappedByEntry).length;

  return (
    <BasicModal
      isOpen={isOpen}
      onClose={setIsOpen}
      header={<div className="standout-header">Final Scenarios</div>}
      style={{ maxHeight: "80%", maxWidth: 400 }}
    >
      {!hasData ? (
        <StatusNote>
          Scenarios will be available when the semi finals are set
        </StatusNote>
      ) : (
        <>
          <PillSort
            onFilter={setView}
            options={viewOptions}
            selectedValue={view}
          />
          {view === "submissions" &&
            Object.entries(mappedByEntry).map(([id, paths]) => {
              const top = paths[0][leaderKey][0];
              return (
                <div key={id} className="single-card whatif-winner-card">
                  <div className="whatif-winner-name">
                    {top.predictionID.name}
                  </div>
                  <div className="whatif-winner-meta">
                    {top.userID.name} &middot; {paths.length} scenario
                    {paths.length !== 1 ? "s" : ""}
                  </div>
                  {groupByChampion(paths).map(([champion, championPaths]) => (
                    <ChampionGroup
                      key={champion}
                      champion={champion}
                      paths={championPaths}
                      leaderKey={leaderKey}
                    />
                  ))}
                </div>
              );
            })}
          {view === "champion" &&
            mappedByChampion.map(([champion, paths]) => (
              <ChampionCard
                key={champion}
                champion={champion}
                paths={paths}
                leaderKey={leaderKey}
              />
            ))}
          {view === "mine" && (
            <UserScenariosView
              allPaths={whatIfData?.paths || []}
              user={user}
              leaderKey={leaderKey}
            />
          )}
        </>
      )}
    </BasicModal>
  );
};

export default LeaderboardWhatIfModal;
