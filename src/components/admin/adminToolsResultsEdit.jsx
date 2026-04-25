import Joi from "joi-browser";
import { toast } from "react-toastify";
import Form from "../common/form/form";
import { updateResult } from "../../services/resultsService";
import { getMatches } from "../../services/matchService";
import LoadingContext from "../../context/loadingContext";
import IconRender from "../common/icons/iconRender";
import TeamSelectComponent from "../predictions/maker/teamSelectComponent";
import { filterRealTeams } from "../../utils/predictionsUtil";

const SINGLE_MISC = new Set(["winner", "thirdPlace"]);

const toFlat = (data) => ({
  winner: data?.misc?.winner || "",
  thirdPlace: data?.misc?.thirdPlace || "",
});

const initMiscArrays = (miscPicks, misc) => {
  const out = {};
  (miscPicks || [])
    .filter((p) => !SINGLE_MISC.has(p.name))
    .forEach((p) => {
      const val = misc?.[p.name];
      out[p.name] = Array.isArray(val) ? [...val] : val ? [val] : [];
    });
  return out;
};

const initLeaders = (miscPicks, leadersData) => {
  const out = {};
  (miscPicks || [])
    .filter((p) => !SINGLE_MISC.has(p.name))
    .forEach((p) => {
      const entry = leadersData?.find((l) => l.key === p.name);
      out[p.name] = entry?.leaders?.map((l) => ({ ...l })) || [];
    });
  return out;
};

class AdminToolsResultsEdit extends Form {
  static contextType = LoadingContext;

  constructor(props) {
    super(props);
    const { initialData, competition } = props;
    this.state = {
      data: toFlat(initialData),
      errors: {},
      miscArrays: initMiscArrays(competition?.miscPicks, initialData?.misc),
      leaders: initLeaders(competition?.miscPicks, initialData?.leaders),
      groups:
        initialData?.group?.map((g) => ({
          groupName: g.groupName,
          teamOrder: g.teamOrder.join("\n"),
        })) || [],
      playoff:
        initialData?.playoff?.map((p) => ({
          round: p.round,
          teams: [...p.teams],
        })) || [],
      groupTeams: {},
      allRealTeams: [],
      playoffRoundLimits: {},
    };
  }

  async componentDidMount() {
    const { competition } = this.props;
    const res = await getMatches(competition._id);
    if (res?.status !== 200) return;
    const matches = res.data;
    const groupTeams = {};
    matches.forEach((m) => {
      if (!m.groupName) return;
      if (!groupTeams[m.groupName]) groupTeams[m.groupName] = new Set();
      groupTeams[m.groupName].add(m.homeTeamName);
      groupTeams[m.groupName].add(m.awayTeamName);
    });
    Object.keys(groupTeams).forEach((g) => {
      groupTeams[g] = filterRealTeams([...groupTeams[g]]).sort();
    });
    const groupNames = Object.keys(groupTeams).sort();
    const allRealTeams = filterRealTeams([
      ...new Set(matches.flatMap((m) => [m.homeTeamName, m.awayTeamName])),
    ]).sort();
    const playoffMatches = matches.filter((m) => m.type === "Playoff");
    const playoffRoundLimits = {};
    playoffMatches.forEach((m) => {
      playoffRoundLimits[m.round] = (playoffRoundLimits[m.round] || 0) + 1;
    });
    const matrixKeys = new Set(
      (this.props.competition.groupMatrix || []).map((gm) => gm.key),
    );
    const matrixGroups = [...matrixKeys].map((key) => ({
      groupName: key,
      teamOrder: "",
    }));
    this.setState((prev) => {
      const baseGroups =
        prev.groups.length > 0
          ? [...prev.groups].sort((a, b) =>
              a.groupName.localeCompare(b.groupName),
            )
          : groupNames.map((name) => ({ groupName: name, teamOrder: "" }));
      const existingNames = new Set(baseGroups.map((g) => g.groupName));
      const newMatrixGroups = matrixGroups.filter(
        (g) => !existingNames.has(g.groupName),
      );
      const allGroups = [...baseGroups, ...newMatrixGroups];
      const regularGroups = allGroups.filter((g) => !matrixKeys.has(g.groupName));
      const matrixGroupsSorted = allGroups.filter((g) => matrixKeys.has(g.groupName));
      const existingRounds = new Set(prev.playoff.map((p) => p.round));
      const reconciledExisting = prev.playoff.map((p) => {
        const limit =
          playoffRoundLimits[p.round] != null
            ? playoffRoundLimits[p.round] * 2
            : p.teams.length;
        const teams = Array(limit)
          .fill("")
          .map((_, i) => p.teams[i] || "");
        return { ...p, teams };
      });
      const newRounds = Object.keys(playoffRoundLimits)
        .map(Number)
        .filter((r) => !existingRounds.has(r))
        .map((round) => ({
          round,
          teams: Array(playoffRoundLimits[round] * 2).fill(""),
        }));
      const basePlayoff = [...reconciledExisting, ...newRounds].sort(
        (a, b) => a.round - b.round,
      );
      return {
        groupTeams,
        allRealTeams,
        playoffRoundLimits,
        groups: [...regularGroups, ...matrixGroupsSorted],
        playoff: basePlayoff,
      };
    });
  }

  schema = {
    winner: Joi.string().allow("").optional().label("Winner"),
    thirdPlace: Joi.string().allow("").optional().label("Third Place"),
  };

  handleGroupChange = (idx, field, value) => {
    this.setState((prev) => ({
      groups: prev.groups.map((g, i) =>
        i === idx ? { ...g, [field]: value } : g,
      ),
    }));
  };

  splitLines = (str) =>
    str
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);

  addToMiscArray = (name, team) => {
    this.setState((prev) => {
      const current = prev.miscArrays[name] || [];
      if (current.includes(team)) return null;
      return { miscArrays: { ...prev.miscArrays, [name]: [...current, team] } };
    });
  };

  removeFromMiscArray = (name, team) => {
    this.setState((prev) => ({
      miscArrays: {
        ...prev.miscArrays,
        [name]: (prev.miscArrays[name] || []).filter((t) => t !== team),
      },
    }));
  };

  addLeader = (name, team) => {
    this.setState((prev) => {
      const current = prev.leaders[name] || [];
      if (current.find((l) => l.team === team)) return null;
      return {
        leaders: {
          ...prev.leaders,
          [name]: [...current, { team, player: "", value: "" }],
        },
      };
    });
  };

  removeLeader = (name, team) => {
    this.setState((prev) => ({
      leaders: {
        ...prev.leaders,
        [name]: (prev.leaders[name] || []).filter((l) => l.team !== team),
      },
    }));
  };

  handleLeaderChange = (name, team, field, value) => {
    this.setState((prev) => ({
      leaders: {
        ...prev.leaders,
        [name]: (prev.leaders[name] || []).map((l) =>
          l.team === team ? { ...l, [field]: value } : l,
        ),
      },
    }));
  };

  doSubmit = async () => {
    const { competition, onSave } = this.props;
    const { data, groups, playoff, miscArrays, leaders } = this.state;
    this.context.setLoading(true);
    const misc = {};
    if (data.winner.trim()) misc.winner = data.winner.trim();
    if (data.thirdPlace.trim()) misc.thirdPlace = data.thirdPlace.trim();
    Object.entries(miscArrays).forEach(([k, v]) => {
      if (v.length > 0) misc[k] = v;
    });
    const leadersBody = (competition.miscPicks || [])
      .filter(
        (p) => !SINGLE_MISC.has(p.name) && (leaders[p.name] || []).length > 0,
      )
      .map((p) => ({
        key: p.name,
        label: p.label,
        leaders: leaders[p.name].map(({ team, player, value }) => ({
          team,
          ...(player?.trim() && { player: player.trim() }),
          value,
        })),
      }));
    const body = {
      code: competition.code,
      misc,
      leaders: leadersBody,
      group: groups
        .filter((g) => g.groupName.trim())
        .map((g) => ({
          groupName: g.groupName.trim(),
          teamOrder: this.splitLines(g.teamOrder),
        })),
      playoff: playoff
        .map((p) => ({
          round: Number(p.round),
          teams: p.teams.filter(Boolean),
        }))
        .filter((p) => p.teams.length > 0),
    };
    const res = await updateResult(competition.code, body);
    if (res?.status === 200) {
      toast.success("Results saved");
      onSave();
    } else {
      toast.error(res?.data || "Failed to save results");
    }
    this.context.setLoading(false);
  };

  appendTeamToGroup = (idx, team) => {
    this.setState((prev) => {
      const g = prev.groups[idx];
      const current = g.teamOrder.trim();
      return {
        groups: prev.groups.map((gr, i) =>
          i === idx
            ? { ...gr, teamOrder: current ? current + "\n" + team : team }
            : gr,
        ),
      };
    });
  };

  render() {
    const { onCancel, competition } = this.props;
    const { groups, playoff, groupTeams, allRealTeams, miscArrays, leaders } =
      this.state;
    const matrixGroupNames = new Set(
      (competition.groupMatrix || []).map((gm) => gm.key),
    );
    const matrixDisplayName = {};
    (competition.groupMatrix || []).forEach((gm) => {
      matrixDisplayName[gm.key] = gm.name;
    });
    const roundNames = {};
    (competition.scoring?.playoff || []).forEach((r) => {
      roundNames[r.roundNumber] = r.roundName;
    });
    const teamOpts = allRealTeams.map((t) => ({ value: t }));
    const miscPicksMap = {};
    (competition.miscPicks || []).forEach((p) => {
      miscPicksMap[p.name] = p;
    });

    return (
      <form onSubmit={this.handleSubmit} className="result-edit-form">
        <div className="result-edit-header">
          <span>
            Editing Results — <b>{competition.name}</b>
          </span>
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
        <div className="result-edit-section">
          <div className="result-section-label">Finals and Bonus</div>
          <div className="result-edit-misc-grid">
            <div className="result-edit-group">
              <label className="form-label">Winner</label>
              <div className="result-playoff-slot">
                {this.renderTeamSelect(
                  "winner",
                  "Select Winner",
                  "Select winner",
                  teamOpts,
                )}
                {this.state.data.winner && (
                  <button
                    type="button"
                    className="result-team-chip result-team-chip-undo"
                    onClick={() =>
                      this.handleChange({
                        currentTarget: { name: "winner", value: "" },
                      })
                    }
                  >
                    <IconRender type="clear" size={10} />
                  </button>
                )}
              </div>
            </div>
            {miscPicksMap["thirdPlace"] && (
              <div className="result-edit-group">
                <label className="form-label">
                  {miscPicksMap["thirdPlace"].label}
                </label>
                <div className="result-playoff-slot">
                  {this.renderTeamSelect(
                    "thirdPlace",
                    miscPicksMap["thirdPlace"].label,
                    "Select team",
                    teamOpts,
                  )}
                  {this.state.data.thirdPlace && (
                    <button
                      type="button"
                      className="result-team-chip result-team-chip-undo"
                      onClick={() =>
                        this.handleChange({
                          currentTarget: { name: "thirdPlace", value: "" },
                        })
                      }
                    >
                      <IconRender type="clear" size={10} />
                    </button>
                  )}
                </div>
              </div>
            )}
            {(competition.miscPicks || [])
              .filter((p) => !SINGLE_MISC.has(p.name))
              .map((pick) => (
                <div key={pick.name} className="result-edit-group">
                  <label className="form-label">{pick.label}</label>
                  <div className="result-team-chips">
                    {(miscArrays[pick.name] || []).map((team) => (
                      <button
                        key={team}
                        type="button"
                        className="result-team-chip result-team-chip-undo"
                        onClick={() =>
                          this.removeFromMiscArray(pick.name, team)
                        }
                      >
                        {team} <IconRender type="clear" size={10} />
                      </button>
                    ))}
                  </div>
                  <TeamSelectComponent
                    teams={teamOpts}
                    selectedOption=""
                    title={`Add ${pick.label}`}
                    subtitle="Select team"
                    onSelect={(v) => this.addToMiscArray(pick.name, v)}
                    singleTeam
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="result-edit-section">
          <div className="result-section-label">Group Standings</div>
          <div className="result-groups-grid">
            {groups.map((g, idx) => (
              <div key={idx} className="result-edit-group">
                <div className="result-group-name">{matrixDisplayName[g.groupName] || g.groupName}</div>
                <div className="result-edit-teams-label">
                  <label className="form-label">
                    {matrixGroupNames.has(g.groupName)
                      ? "Groups (in order)"
                      : "Teams (in order)"}
                  </label>
                  {g.teamOrder.trim() && (
                    <button
                      type="button"
                      className="result-team-chip result-team-chip-undo"
                      onClick={() => {
                        const lines = g.teamOrder.trimEnd().split("\n");
                        lines.pop();
                        this.handleGroupChange(
                          idx,
                          "teamOrder",
                          lines.join("\n"),
                        );
                      }}
                    >
                      <IconRender type="refresh" size={12} /> Undo
                    </button>
                  )}
                </div>
                {(() => {
                  const isMatrix = matrixGroupNames.has(g.groupName);
                  const chips = isMatrix
                    ? Object.keys(groupTeams).sort()
                    : groupTeams[g.groupName] || [];
                  return chips.length > 0 ? (
                    <div className="result-team-chips">
                      {chips.map((t) => (
                        <button
                          key={t}
                          type="button"
                          className="result-team-chip"
                          onClick={() => this.appendTeamToGroup(idx, t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  ) : null;
                })()}
                <textarea
                  className="form-control result-edit-textarea"
                  value={g.teamOrder}
                  onChange={(e) =>
                    this.handleGroupChange(idx, "teamOrder", e.target.value)
                  }
                  rows={4}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="result-edit-section">
          <div className="result-section-label">Playoff Rounds</div>
          <div className="result-playoff-rounds">
            {playoff.map((p, roundIdx) => (
              <div key={roundIdx} className="result-edit-round">
                <div className="result-edit-round-header">
                  <span className="result-section-label">
                    {roundNames[p.round] || `Round ${p.round}`}
                  </span>
                </div>
                {p.teams.map((team, teamIdx) => {
                  const setTeam = (v) =>
                    this.setState((prev) => ({
                      playoff: prev.playoff.map((r, i) => {
                        if (i !== roundIdx) return r;
                        const teams = [...r.teams];
                        teams[teamIdx] = v;
                        return { ...r, teams };
                      }),
                    }));
                  return (
                    <div key={teamIdx} className="result-playoff-slot">
                      <TeamSelectComponent
                        teams={teamOpts}
                        selectedOption={team}
                        title={`Slot ${teamIdx + 1}`}
                        subtitle="Select advancing team"
                        onSelect={setTeam}
                        singleTeam
                      />
                      {team && (
                        <button
                          type="button"
                          className="result-team-chip result-team-chip-undo"
                          onClick={() => setTeam("")}
                        >
                          <IconRender type="clear" size={10} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {(competition.miscPicks || []).some(
          (p) => !SINGLE_MISC.has(p.name),
        ) && (
          <div className="result-edit-section">
            <div className="result-section-label">Leaders</div>
            <div className="result-edit-misc-grid">
              {(competition.miscPicks || [])
                .filter((p) => !SINGLE_MISC.has(p.name))
                .map((pick) => (
                  <div key={pick.name}>
                    <label className="form-label">{pick.label}</label>
                    {(leaders[pick.name] || []).map((entry) => (
                      <div key={entry.team} className="result-leader-entry">
                        <div className="result-leader-team">
                          <span>{entry.team}</span>
                          <button
                            type="button"
                            className="result-team-chip result-team-chip-undo"
                            onClick={() =>
                              this.removeLeader(pick.name, entry.team)
                            }
                          >
                            <IconRender type="clear" size={10} />
                          </button>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          placeholder="Player (optional)"
                          value={entry.player || ""}
                          onChange={(e) =>
                            this.handleLeaderChange(
                              pick.name,
                              entry.team,
                              "player",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          className="form-control form-control-sm"
                          placeholder="Value (e.g. 4 Goals)"
                          value={entry.value || ""}
                          onChange={(e) =>
                            this.handleLeaderChange(
                              pick.name,
                              entry.team,
                              "value",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    ))}
                    <TeamSelectComponent
                      teams={teamOpts}
                      selectedOption=""
                      title={`Add ${pick.label} leader`}
                      subtitle="Select team"
                      onSelect={(v) => this.addLeader(pick.name, v)}
                      singleTeam
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="match-edit-actions">
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={onCancel}
          >
            Cancel
          </button>
          {this.renderValidatedButton("Save Results")}
        </div>
      </form>
    );
  }
}

export default AdminToolsResultsEdit;
