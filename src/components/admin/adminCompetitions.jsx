import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingContext from "../../context/loadingContext";
import {
  getActiveCompetitions,
  getExpiredCompetitions,
} from "../../services/competitionService";
import { getResult } from "../../services/resultsService";
import { getLeaderboard } from "../../services/predictionsService";
import { shortDate } from "../../utils/allowables";
import IconRender from "../common/icons/iconRender";
import TextLink from "../common/pageSections/textLink";

const PullToLoad = () => (
  <span className="pull-to-load">pull to load</span>
);

const AdminCompetitions = () => {
  const { setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [info, setInfo] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [activeRes, expiredRes] = await Promise.all([
        getActiveCompetitions(),
        getExpiredCompetitions(),
      ]);
      const active = activeRes?.status === 200 ? activeRes.data : [];
      const expired = expiredRes?.status === 200 ? expiredRes.data : [];
      setRows([...active, ...expired]);
      setLoading(false);
    };
    load();
  }, []);

  const handleLoadInfo = async (competition) => {
    const { _id, secondChance } = competition;
    setLoading(true);
    const requests = [getResult(_id), getLeaderboard(_id, 1, 1, "all", false)];
    if (secondChance) requests.push(getLeaderboard(_id, 1, 1, "all", true));
    const [resultRes, primaryRes, scRes] = await Promise.all(requests);
    if (primaryRes?.status === 200) {
      setInfo((prev) => ({
        ...prev,
        [_id]: {
          hasResult: resultRes?.status === 200,
          primary: primaryRes.data.count,
          secondChance: scRes?.status === 200 ? scRes.data.count : null,
        },
      }));
    } else {
      toast.error("Failed to load submission info");
    }
    setLoading(false);
  };

  const isComplete = (c) => new Date(c.competitionEnd) < new Date();

  return (
    <div>
      {rows.map((c) => {
        const data = info[c._id];
        const complete = isComplete(c);
        return (
          <div key={c._id} className="competition-card">
            <div className={`competition-card-header${complete ? " expired" : ""}`}>
              <div className="competition-card-header-row">
                <div>
                  <h2>{c.name}</h2>
                  <div className="competition-card-subtitle">{c.code}</div>
                </div>
                <button
                  className="btn btn-sm btn-dark"
                  onClick={() => handleLoadInfo(c)}
                  title={data ? "Refresh Info" : "Load More Info"}
                >
                  <IconRender type={data ? "refresh" : "download"} size={14} />
                </button>
              </div>
            </div>
            <div className="competition-card-body">
              <div className="competition-card-info-grid">
                <div className="info-line">
                  <span className="info-line-label">Deadline</span>
                  <span className="info-line-value">{shortDate(c.submissionDeadline)}</span>
                </div>
                <div className="info-line">
                  <span className="info-line-label">Ends</span>
                  <span className="info-line-value">{shortDate(c.competitionEnd, true)}</span>
                </div>
                <div className="info-line">
                  <span className="info-line-label">Last Calculated</span>
                  <span className="info-line-value">{shortDate(c.lastCalculated) || "—"}</span>
                </div>
                <div className="info-line">
                  <span className="info-line-label">Result</span>
                  <span className="info-line-value">
                    {data ? (data.hasResult ? "Posted" : "Not posted") : <PullToLoad />}
                  </span>
                </div>
                <div className="info-line no-border">
                  <span className="info-line-label">Submissions</span>
                  <span className="info-line-value">
                    {data ? data.primary : <PullToLoad />}
                  </span>
                </div>
              </div>
              <div className="competition-card-section">
                <div className="competition-card-section-label">Second Chance</div>
                {c.secondChance ? (
                  <div className="competition-card-info-grid">
                    <div className="info-line">
                      <span className="info-line-label">Available From</span>
                      <span className="info-line-value">{shortDate(c.secondChance.availableFrom, true)}</span>
                    </div>
                    <div className="info-line">
                      <span className="info-line-label">Deadline</span>
                      <span className="info-line-value">{shortDate(c.secondChance.submissionDeadline)}</span>
                    </div>
                    <div className="info-line">
                      <span className="info-line-label">Starts</span>
                      <span className="info-line-value">{shortDate(c.secondChance.competitionStart, true)}</span>
                    </div>
                    <div className="info-line no-border">
                      <span className="info-line-label">Submissions</span>
                      <span className="info-line-value">
                        {data ? data.secondChance : <PullToLoad />}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="competition-card-section-empty">
                    No second chance for this competition
                  </span>
                )}
              </div>
              <div className="competition-card-section text-right">
                <TextLink
                  onClick={() =>
                    navigate(`/competitions?leaderboard=show&competitionID=${c._id}&groupID=all`)
                  }
                >
                  View Leaderboard
                </TextLink>
              </div>
            </div>
          </div>
        );
      })}
      {rows.length === 0 && (
        <div className="single-card text-center">
          <b>No competitions found.</b>
        </div>
      )}
    </div>
  );
};

export default AdminCompetitions;
