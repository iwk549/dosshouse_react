import React, { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";

import BasicModal from "../../common/modal/basicModal";
import LoadingContext from "../../../context/loadingContext";
import SingleTeamView from "../maker/singleTeamView";
import IconRender from "../../common/icons/iconRender";
import { getTeamEliminations } from "../../../services/predictionsService";

const ROUND_ORDER = [
  "Group Stage",
  "Round of 128",
  "Round of 64",
  "Round of 32",
  "Round of 16",
  "Quarter Final",
  "Semi Final",
  "Third Place",
  "Runner-Up",
  "Winner",
];

const LeaderboardTeamEliminationsModal = ({
  isOpen,
  setIsOpen,
  team,
  competitionID,
  groupID,
  groupName,
  isSecondChance,
  onSetEliminations,
  eliminations,
}) => {
  const { setLoading } = useContext(LoadingContext);
  const [expandedRound, setExpandedRound] = useState(null);

  useEffect(() => {
    if (isOpen && team) {
      setExpandedRound(null);
      loadEliminations();
    }
  }, [isOpen, team]);

  const loadEliminations = async () => {
    setLoading(true);
    const res = await getTeamEliminations(
      competitionID,
      groupID,
      team,
      isSecondChance,
    );
    if (res.status === 200) onSetEliminations(res.data);
    else toast.error(res.data);
    setLoading(false);
  };

  const grouped = {};
  (eliminations || []).forEach((p) => {
    const round = p.eliminationRound || "Unknown";
    if (!grouped[round]) grouped[round] = 0;
    grouped[round]++;
  });

  const sortedRounds = [
    ...ROUND_ORDER.filter((r) => grouped[r]),
    ...(grouped["Unknown"] ? ["Unknown"] : []),
  ];

  return (
    <BasicModal
      isOpen={isOpen}
      onClose={setIsOpen}
      header={
        <>
          <div className="standout-header">
            {team && <SingleTeamView teamName={team} />}
          </div>
          <p>
            Breakdown of predicted elimination rounds across all{" "}
            {groupName ? <b>{groupName}</b> : null} submissions
          </p>
        </>
      }
      style={{ width: "60%", maxHeight: "80%" }}
    >
      {sortedRounds.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table className="custom-table table-full-width">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Round</th>
              <th className="table-header-cell">Picks</th>
              <th className="table-header-cell">%</th>
              <th className="table-header-cell" />
            </tr>
          </thead>
          <tbody>
            {sortedRounds.map((round, idx) => (
              <React.Fragment key={round + idx}>
                <tr
                  key={round}
                  className={
                    "table-row clickable" + (idx % 2 === 1 ? " alternate" : "")
                  }
                  onClick={() =>
                    setExpandedRound(expandedRound === round ? null : round)
                  }
                >
                  <td className="table-cell">{round}</td>
                  <td className="table-cell">{grouped[round]}</td>
                  <td className="table-cell">
                    {Math.round((grouped[round] / eliminations.length) * 100)}%
                  </td>
                  <td className="table-cell">
                    <IconRender
                      type={expandedRound === round ? "up" : "down"}
                      size={14}
                    />
                  </td>
                </tr>
                {expandedRound === round &&
                  eliminations
                    .filter((p) => (p.eliminationRound || "Unknown") === round)
                    .map((p) => (
                      <tr key={p._id} className="table-row expanded-sub">
                        <td className="table-cell expanded-name" colSpan={2}>
                          {p.name}
                        </td>
                        <td className="table-cell expanded-points">
                          {p.totalPoints ?? "—"} pts
                        </td>
                        <td className="table-cell expanded-user">
                          {p.userID?.name}
                        </td>
                      </tr>
                    ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </BasicModal>
  );
};

export default LeaderboardTeamEliminationsModal;
