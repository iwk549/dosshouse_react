import React, { useState, useEffect, useContext } from "react";

import BasicModal from "../../common/modal/basicModal";
import { handlePopulateBracket } from "../../../utils/predictionsUtil";
import IconRender from "../../common/icons/iconRender";
import LoadingContext from "../../../context/loadingContext";
import StatusNote from "../../common/pageSections/statusNote";
import SubmissionListView from "../maker/submissionListView";

const LeaderboardViewPredictionModal = ({
  prediction,
  isOpen,
  setIsOpen,
  originalMatches,
  competition,
  result,
  setForceRemoveOpen,
  setSelectedPrediction,
  groupInfo,
}) => {
  const { user } = useContext(LoadingContext);
  const [groups, setGroups] = useState({});
  const [playoffMatches, setPlayoffMatches] = useState([]);

  useEffect(() => {
    convertData();
  }, [prediction]);

  const convertData = () => {
    if (!prediction.playoffPredictions) return;
    const { groups: populatedGroups, playoffMatches: populatedPlayoffMatches } =
      handlePopulateBracket(
        prediction.groupPredictions,
        prediction.playoffPredictions,
        originalMatches,
        result,
        prediction.isSecondChance,
        competition,
      );
    setGroups(populatedGroups);
    setPlayoffMatches(populatedPlayoffMatches);
  };

  if (!prediction) return null;
  return (
    <BasicModal
      isOpen={isOpen}
      onClose={setIsOpen}
      header={
        <>
          <div className="standout-header">{prediction.name}</div>
          <div className="modal-stats-row">
            <span>
              <b>{prediction.totalPoints}</b> pts
            </span>
            <span>
              <b>{prediction.totalPicks}</b> correct picks
            </span>
          </div>
          {user && groupInfo?.ownerID?._id === user?._id && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                setSelectedPrediction(prediction);
                setForceRemoveOpen(true);
              }}
            >
              <IconRender type="remove" /> Remove from group
            </button>
          )}
        </>
      }
      style={{
        width: "80%",
        height: "85%",
      }}
    >
      {prediction.playoffPredictions ? (
        <SubmissionListView
          groups={groups}
          playoffMatches={playoffMatches}
          misc={prediction.misc}
          result={result}
          competition={competition}
        />
      ) : (
        <StatusNote>
          You will be able to view all the picks once the submission deadline
          has passed
        </StatusNote>
      )}
    </BasicModal>
  );
};

export default LeaderboardViewPredictionModal;
