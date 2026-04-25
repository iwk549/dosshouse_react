import { useState, useContext } from "react";
import { toast } from "react-toastify";
import LoadingContext from "../../context/loadingContext";
import { getMatches } from "../../services/matchService";
import { updateMiscPickInfo } from "../../services/competitionService";
import IconRender from "../common/icons/iconRender";
import { filterRealTeams } from "../../utils/predictionsUtil";
import StatusNote from "../common/pageSections/statusNote";
import { shortDate } from "../../utils/allowables";
import AdminToolsMatchEdit from "./adminToolsMatchEdit";

const formatScore = (match) => {
  if (!match.matchAccepted) return null;
  const wentToPks =
    match.homeTeamGoals === match.awayTeamGoals &&
    match.homeTeamPKs !== match.awayTeamPKs;
  const goals = `${match.homeTeamGoals} - ${match.awayTeamGoals}`;
  const pks = wentToPks
    ? ` (PKs: ${match.homeTeamPKs} - ${match.awayTeamPKs})`
    : "";
  return goals + pks;
};

const AdminToolsMatches = ({ competitions }) => {
  const { setLoading } = useContext(LoadingContext);
  const [matches, setMatches] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [showAccepted, setShowAccepted] = useState(false);

  const [selectedCompetition, setSelectedCompetition] = useState(null);

  const handleLoadMatches = async (competition) => {
    setLoading(true);
    setEditingMatchId(null);
    const res = await getMatches(competition._id);
    if (res?.status === 200) {
      setMatches(res.data);
      setSelectedCompetitionId(competition._id);
      if (selectedCompetition?._id !== competition._id) setSelectedCompetition(competition);
      const allTeams = [
        ...new Set(res.data.flatMap((m) => [m.homeTeamName, m.awayTeamName])),
      ];
      setTeamOptions(filterRealTeams(allTeams).map((t) => ({ value: t })));
    } else {
      toast.error("Failed to load matches");
    }
    setLoading(false);
  };

  const thirdPlaceInfo = selectedCompetition?.miscPicks?.find((p) => p.name === "thirdPlace")?.info;
  const thirdPlaceMatch = thirdPlaceInfo
    ? { ...thirdPlaceInfo, _id: "thirdPlace", isMiscPick: true, miscPickName: "thirdPlace" }
    : null;

  const renderMatch = (m, { onSave, saveOverride }) => {
    if (editingMatchId === m._id) {
      return (
        <AdminToolsMatchEdit
          key={m._id}
          match={m}
          teamOptions={teamOptions}
          onSave={onSave}
          onCancel={() => setEditingMatchId(null)}
          saveOverride={saveOverride}
        />
      );
    }
    return (
      <div
        key={m._id}
        className={"match-row" + (m.matchAccepted ? " match-row-accepted" : "")}
      >
        <div className="match-info">
          <span className="match-meta">R{m.round} #{m.matchNumber}</span>
          <span className="match-meta">{m.type}</span>
          {m.isMiscPick && <span className="match-meta">3rd Place</span>}
          <span className="match-teams">{m.homeTeamName} vs {m.awayTeamName}</span>
          {formatScore(m) && <span className="match-score">{formatScore(m)}</span>}
          {m.dateTime && <span className="match-meta">{shortDate(m.dateTime)}</span>}
          {m.location && <span className="match-meta">{m.location}</span>}
        </div>
        <div className="inline-row">
          {m.matchAccepted ? (
            <span className="match-accepted-badge">Accepted</span>
          ) : (
            <span className="match-pending-badge">Pending</span>
          )}
          <button className="btn btn-sm btn-dark" onClick={() => setEditingMatchId(m._id)}>
            <IconRender type="edit" size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {competitions.map((c) => {
        const complete = new Date(c.competitionEnd) < new Date();
        const isSelected = selectedCompetitionId === c._id;
        return (
          <div key={c._id} className={"single-card" + (complete ? " muted-card" : "")}>
            <div className="competition-card-header-row">
              <div className="inline-row">
                <b>{c.name}</b>
                <span className="muted-text">{c.code}</span>
                {complete && <span className="complete-badge">Complete</span>}
              </div>
              <div className="inline-row">
                {isSelected && (
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => setShowAccepted((prev) => !prev)}
                  >
                    {showAccepted ? "Hide" : "Show"} Accepted
                  </button>
                )}
                <button
                  className="btn btn-sm btn-dark"
                  onClick={() => handleLoadMatches(c)}
                >
                  Load Matches
                </button>
              </div>
            </div>
            {isSelected && (
              <div className="match-list">
                {matches.length === 0 && !thirdPlaceMatch ? (
                  <p className="muted-text">No matches found.</p>
                ) : (() => {
                    const filtered = matches.filter((m) => showAccepted || !m.matchAccepted);
                    const allButLast = thirdPlaceMatch ? filtered.slice(0, -1) : filtered;
                    const finalMatch = thirdPlaceMatch ? filtered.slice(-1) : [];
                    const matchOnSave = (m) => (updated) => {
                      setMatches((prev) => prev.map((x) => (x._id === m._id ? updated : x)));
                      setEditingMatchId(null);
                    };
                    const thirdPlaceSaveOverride = ({ homeTeamName, awayTeamName, homeTeamGoals, homeTeamPKs, awayTeamGoals, awayTeamPKs, dateTime, location, matchAccepted }) =>
                      updateMiscPickInfo(selectedCompetition.code, "thirdPlace", { homeTeamName, awayTeamName, homeTeamGoals, homeTeamPKs, awayTeamGoals, awayTeamPKs, dateTime, location, matchAccepted });
                    return (
                      <>
                        {allButLast.map((m) => renderMatch(m, { onSave: matchOnSave(m) }))}
                        {thirdPlaceMatch && (showAccepted || !thirdPlaceMatch.matchAccepted) && renderMatch(thirdPlaceMatch, {
                          onSave: (updated) => {
                            setSelectedCompetition((prev) => ({
                              ...prev,
                              miscPicks: prev.miscPicks.map((p) =>
                                p.name === "thirdPlace" ? { ...p, info: updated } : p
                              ),
                            }));
                            setEditingMatchId(null);
                          },
                          saveOverride: thirdPlaceSaveOverride,
                        })}
                        {finalMatch.map((m) => renderMatch(m, { onSave: matchOnSave(m) }))}
                      </>
                    );
                  })()}
              </div>
            )}
          </div>
        );
      })}
      {competitions.length === 0 && (
        <StatusNote>No competitions found.</StatusNote>
      )}
    </div>
  );
};

export default AdminToolsMatches;
