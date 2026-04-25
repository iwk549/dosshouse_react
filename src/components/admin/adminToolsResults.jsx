import { useState, useContext } from "react";
import { toast } from "react-toastify";
import LoadingContext from "../../context/loadingContext";
import { getResult, calculateCompetition } from "../../services/resultsService";
import StatusNote from "../common/pageSections/statusNote";
import Confirm from "../common/modal/confirm";
import AdminToolsResultsEdit from "./adminToolsResultsEdit";

const AdminToolsResults = ({ competitions }) => {
  const { setLoading } = useContext(LoadingContext);
  const [results, setResults] = useState({});
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
  const [editingCompetitionId, setEditingCompetitionId] = useState(null);
  const [confirmCode, setConfirmCode] = useState(null);

  const handleLoadResults = async (competition) => {
    setLoading(true);
    const res = await getResult(competition._id);
    if (res?.status === 200) {
      setResults((prev) => ({
        ...prev,
        [competition._id]: { ok: true, data: res.data },
      }));
      setSelectedCompetitionId(competition._id);
    } else if (res?.status === 404) {
      setResults((prev) => ({
        ...prev,
        [competition._id]: { ok: false, data: null },
      }));
      setSelectedCompetitionId(competition._id);
    } else {
      toast.error("Failed to load results");
    }
    setLoading(false);
  };

  const handleCalculateClick = (competition) => {
    const isComplete = new Date(competition.competitionEnd) < new Date();
    if (isComplete) return setConfirmCode(competition.code);
    runCalculation(competition.code);
  };

  const runCalculation = async (code) => {
    setLoading(true);
    const res = await calculateCompetition(code);
    if (res?.status === 200) {
      toast.success(`Calculation complete for ${code}`);
    } else {
      toast.error(res?.data || "Calculation failed");
    }
    setLoading(false);
  };

  const confirmCompetition = competitions.find((c) => c.code === confirmCode);

  return (
    <div>
      {competitions.map((c) => {
        const complete = new Date(c.competitionEnd) < new Date();
        const isSelected = selectedCompetitionId === c._id;
        const loaded = results[c._id];
        return (
          <div
            key={c._id}
            className={
              "single-card" +
              (complete ? " muted-card" : "") +
              (editingCompetitionId === c._id ? " editing-card" : "")
            }
          >
            <div className="competition-card-header-row">
              <div className="inline-row">
                <b>{c.name}</b>
                <span className="muted-text">{c.code}</span>
                {complete && <span className="complete-badge">Complete</span>}
              </div>
              <div className="inline-row">
                {isSelected && loaded?.ok && editingCompetitionId !== c._id && (
                  <>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => setEditingCompetitionId(c._id)}
                    >
                      Edit Results
                    </button>
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => handleCalculateClick(c)}
                    >
                      Calculate
                    </button>
                  </>
                )}
                <button
                  className="btn btn-sm btn-dark"
                  onClick={() => handleLoadResults(c)}
                >
                  Load Results
                </button>
              </div>
            </div>
            {isSelected && (
              <div className="match-list">
                {editingCompetitionId === c._id ? (
                  <AdminToolsResultsEdit
                    competition={c}
                    initialData={loaded?.data}
                    onSave={() => {
                      setEditingCompetitionId(null);
                      handleLoadResults(c);
                    }}
                    onCancel={() => setEditingCompetitionId(null)}
                  />
                ) : !loaded ? null : !loaded.ok ? (
                  <StatusNote>
                    No results found —{" "}
                    <button
                      className="text-link"
                      onClick={() => setEditingCompetitionId(c._id)}
                    >
                      create them
                    </button>
                  </StatusNote>
                ) : (
                  <ResultSummary result={loaded.data} competition={c} />
                )}
              </div>
            )}
          </div>
        );
      })}
      {competitions.length === 0 && (
        <StatusNote>No competitions found.</StatusNote>
      )}
      <Confirm
        header="Competition Complete"
        isOpen={!!confirmCode}
        setIsOpen={(open) => !open && setConfirmCode(null)}
        onConfirm={() => runCalculation(confirmCode)}
        buttonText={["Cancel", "Calculate"]}
        focus="cancel"
      >
        <p>
          <strong>{confirmCompetition?.name}</strong> has already ended. Are you
          sure you want to recalculate?
        </p>
      </Confirm>
    </div>
  );
};

const GroupStandings = ({ groups, groupMatrix }) => {
  const matrixMap = {};
  (groupMatrix || []).forEach((gm) => { matrixMap[gm.key] = gm.name; });
  const sorted = [...groups].sort((a, b) => {
    const aMatrix = a.groupName in matrixMap;
    const bMatrix = b.groupName in matrixMap;
    if (aMatrix !== bMatrix) return aMatrix ? 1 : -1;
    return a.groupName.localeCompare(b.groupName);
  });
  return sorted.map((g) => (
    <div key={g.groupName} className="result-group-item">
      <div className="result-group-name">{matrixMap[g.groupName] || g.groupName}</div>
      {g.teamOrder.map((team, i) => (
        <div key={team} className="result-group-team">
          <span className="match-meta">{i + 1}.</span> {team}
        </div>
      ))}
    </div>
  ));
};

const ResultSummary = ({ result, competition }) => {
  const roundNames = {};
  (competition?.scoring?.playoff || []).forEach((r) => {
    roundNames[r.roundNumber] = r.roundName;
  });
  const miscRows = [{ label: "Winner", value: result.misc?.winner || "" }];
  (competition?.miscPicks || []).forEach((p) => {
    const val = result.misc?.[p.name];
    miscRows.push({
      label: p.label,
      value: Array.isArray(val) ? val.join(", ") : val || "",
    });
  });
  return (
    <div className="result-summary">
      <div className="result-section">
        <div className="result-section-label">Winners and Bonus</div>
        {miscRows.map((r) => (
          <div key={r.label} className="result-playoff-row">
            <span className="match-meta">{r.label}</span>
            <span>{r.value}</span>
          </div>
        ))}
      </div>
      {result.group?.length > 0 && (
        <div className="result-section">
          <div className="result-section-label">Group Standings</div>
          <div className="result-groups-grid">
            <GroupStandings groups={result.group} groupMatrix={competition?.groupMatrix} />
          </div>
        </div>
      )}
      {result.playoff?.length > 0 && (
        <div className="result-section">
          <div className="result-section-label">Playoff Rounds</div>
          {result.playoff.map((p) => (
            <div key={p.round} className="result-playoff-row">
              <span className="match-meta">
                {roundNames[p.round] || `Round ${p.round}`}
              </span>
              <span>{p.teams.join(", ")}</span>
            </div>
          ))}
        </div>
      )}
      {result.leaders?.length > 0 && (
        <div className="result-section">
          <div className="result-section-label">Leaders</div>
          {result.leaders.map((category) => (
            <div key={category.key} className="result-section">
              <div className="result-group-name">{category.label}</div>
              {category.leaders.map((entry) => (
                <div key={entry.team} className="result-playoff-row">
                  <span className="match-meta">
                    {entry.team}
                    {entry.player ? ` — ${entry.player}` : ""}
                  </span>
                  <span>{entry.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminToolsResults;
