import Joi from "joi-browser";
import { toast } from "react-toastify";
import Form from "../common/form/form";
import { updateMatch } from "../../services/matchService";
import LoadingContext from "../../context/loadingContext";

const toDateTimeLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

class AdminToolsMatchEdit extends Form {
  static contextType = LoadingContext;

  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      data: {
        homeTeamName: match.homeTeamName,
        homeTeamGoals: match.homeTeamGoals ?? "",
        homeTeamPKs: match.homeTeamPKs ?? "",
        awayTeamName: match.awayTeamName,
        awayTeamGoals: match.awayTeamGoals ?? "",
        awayTeamPKs: match.awayTeamPKs ?? "",
        dateTime: toDateTimeLocal(match.dateTime),
        location: match.location ?? "",
        matchAccepted: match.matchAccepted ?? false,
      },
      errors: {},
    };
  }

  schema = {
    homeTeamName: Joi.string().required().label("Home Team"),
    homeTeamGoals: Joi.number().allow("").optional().label("Home Goals"),
    homeTeamPKs: Joi.number().allow("").optional().label("Home PKs"),
    awayTeamName: Joi.string().required().label("Away Team"),
    awayTeamGoals: Joi.number().allow("").optional().label("Away Goals"),
    awayTeamPKs: Joi.number().allow("").optional().label("Away PKs"),
    dateTime: Joi.string().allow("").optional().label("Date & Time"),
    location: Joi.string().allow("").optional().label("Location"),
    matchAccepted: Joi.boolean().label("Match Accepted"),
  };

  doSubmit = async () => {
    const { match } = this.props;
    const { data } = this.state;
    this.context.setLoading(true);
    const toNum = (v) => (v !== "" ? Number(v) : undefined);
    const body = {
      bracketCode: match.bracketCode,
      matchNumber: match.matchNumber,
      round: match.round,
      homeTeamName: data.homeTeamName,
      homeTeamGoals: toNum(data.homeTeamGoals),
      homeTeamPKs: toNum(data.homeTeamPKs),
      awayTeamName: data.awayTeamName,
      awayTeamGoals: toNum(data.awayTeamGoals),
      awayTeamPKs: toNum(data.awayTeamPKs),
      dateTime: data.dateTime ? new Date(data.dateTime).toISOString() : undefined,
      location: data.location || undefined,
      matchAccepted: data.matchAccepted,
    };
    const { saveOverride } = this.props;
    const res = saveOverride ? await saveOverride(body) : await updateMatch(match._id, body);
    if (res?.status === 200) {
      toast.success("Match updated");
      this.props.onSave(res.data);
    } else {
      toast.error(res?.data || "Failed to update match");
    }
    this.context.setLoading(false);
  };

  render() {
    const { match, teamOptions, onCancel } = this.props;

    return (
      <div className="match-edit-form">
        <div className="match-edit-ref inline-row">
          <span className="match-meta">R{match.round} #{match.matchNumber}</span>
          <span className="match-meta">{match.type}</span>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="match-edit-grid">
            {this.renderTeamSelect("homeTeamName", "Home Team", "Select the home team", teamOptions)}
            {this.renderTeamSelect("awayTeamName", "Away Team", "Select the away team", teamOptions)}
            {this.renderInput("homeTeamGoals", "Home Goals", "", "number")}
            {this.renderInput("awayTeamGoals", "Away Goals", "", "number")}
            {this.renderInput("homeTeamPKs", "Home PKs", "", "number")}
            {this.renderInput("awayTeamPKs", "Away PKs", "", "number")}
          </div>
          <div className="match-edit-full">
            {this.renderInput("dateTime", "Date & Time", "", "datetime-local")}
          </div>
          <div className="match-edit-full">
            {this.renderInput("location", "Location")}
          </div>
          {this.renderCheckbox("matchAccepted", "Match Accepted")}
          <div className="match-edit-actions">
            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={onCancel}
            >
              Cancel
            </button>
            {this.renderValidatedButton("Save")}
          </div>
        </form>
      </div>
    );
  }
}

export default AdminToolsMatchEdit;
