import { useContext, useState } from "react";

import BasicModal from "../../common/modal/basicModal";
import SingleTeamView from "../maker/singleTeamView";
import { getSubmissionsByMisc } from "../../../services/predictionsService";
import { toast } from "react-toastify";
import LoadingContext from "../../../context/loadingContext";

const BonusPickInfo = ({
  competition,
  isOpen,
  setIsOpen,
  result,
  setSinglePredictionOpen,
  setSelectedPrediction,
}) => {
  const { setLoading } = useContext(LoadingContext);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [submissionsListOpen, setSubmissionsListOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    key: "",
    team: "",
    label: "",
  });

  if (!result?.leaders?.length) return null;

  const deadlinePassed = new Date(competition.submissionDeadline) < new Date();

  const getSubmissions = async (key, team, label) => {
    if (!deadlinePassed) return;
    setLoading(true);
    const submissionsRes = await getSubmissionsByMisc(
      competition._id,
      key,
      team
    );
    if (submissionsRes.status === 200) {
      setFilteredSubmissions(submissionsRes.data);
      setSubmissionsListOpen(true);
      setSelectedItem({ key, team, label });
    } else toast.error(submissionsRes.data);
    setLoading(false);
  };

  return (
    <>
      <div style={{ height: 5 }} />
      <button
        className="btn btn-small btn-dark"
        onClick={() => setIsOpen(true)}
      >
        View Current Bonus Pick Leaders
      </button>
      <BasicModal isOpen={isOpen} onClose={setIsOpen}>
        {result.leaders.map((r, idx) => (
          <div key={idx} className="single-card light-bg">
            <div className="standout-header">{r.label}</div>
            {r.leaders?.map((l, idx2) => (
              <div
                key={idx2}
                className={"single-card" + (deadlinePassed ? " clickable" : "")}
                onClick={() => getSubmissions(r.key, l.team, r.label)}
              >
                <SingleTeamView teamName={l.team} />
                {l.player ? <b>{l.player}: </b> : ""}
                {l.value}
                {l.eliminated && (
                  <div className="custom-alert danger">Eliminated</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </BasicModal>
      <BasicModal isOpen={submissionsListOpen} onClose={setSubmissionsListOpen}>
        <div className="standout-header">{selectedItem.label}</div>
        <SingleTeamView teamName={selectedItem.team} />
        {!filteredSubmissions.length ? (
          <p>No submissions have picked this team</p>
        ) : (
          filteredSubmissions.map((sub, idx) => (
            <div
              key={idx}
              className="single-card clickable"
              onClick={() => {
                setSelectedPrediction(sub);
                setSinglePredictionOpen(true);
              }}
            >
              <b>{sub.userID?.name}: </b>
              {sub.name}
            </div>
          ))
        )}
      </BasicModal>
    </>
  );
};

export default BonusPickInfo;
