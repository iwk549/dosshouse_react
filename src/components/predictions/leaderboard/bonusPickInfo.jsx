import { useState } from "react";

import BasicModal from "../../common/modal/basicModal";
import SingleTeamView from "../maker/singleTeamView";

const BonusPickInfo = ({ isOpen, setIsOpen, result, submissions }) => {
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [submissionsListOpen, setSubmissionsListOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    key: "",
    team: "",
    label: "",
  });

  if (!result?.leaders?.length) return null;

  const getSubmissions = (key, team, label) => {
    console.log(submissions); // we don't have the misc key here
    setFilteredSubmissions(
      submissions.filter((sub) => sub.misc?.[key] === team)
    );
    setSubmissionsListOpen(true);
    setSelectedItem({ key, team, label });
  };

  return (
    <>
      <div style={{ height: 5 }} />
      <button
        className="btn btn-small btn-dark"
        onClick={() => setIsOpen(true)}
      >
        View Bonus Pick Leaderboard
      </button>
      <BasicModal isOpen={isOpen} onClose={setIsOpen}>
        {result.leaders.map((r, idx) => (
          <div key={idx} className="single-card light-bg">
            <div className="standout-header">{r.label}</div>
            {r.leaders?.map((l, idx2) => (
              <div
                key={idx2}
                className="single-card light-bg clickable"
                onClick={() => getSubmissions(r.key, l.team, r.label)}
              >
                <SingleTeamView teamName={l.team} />
                {l.player && <p>{l.player}</p>}
                {l.value}
              </div>
            ))}
          </div>
        ))}
      </BasicModal>
      <BasicModal isOpen={submissionsListOpen} onClose={setSubmissionsListOpen}>
        <div className="standout-header">{selectedItem.label}</div>
        <SingleTeamView teamName={selectedItem.team} />
        {filteredSubmissions.map((sub, idx) => (
          <div key={idx}>{sub.name}</div>
        ))}
      </BasicModal>
    </>
  );
};

export default BonusPickInfo;
