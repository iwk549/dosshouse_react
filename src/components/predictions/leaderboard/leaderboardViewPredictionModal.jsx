import React, { useState, useEffect, useContext } from "react";
import SegmentedControl from "../../common/pageSections/segmentedControl";

import BasicModal from "../../common/modal/basicModal";
import GroupPicker from "../maker/groupPicker";
import BracketPicker from "../maker/bracketPicker";
import Miscellaneous from "../maker/miscellaneous";
import { handlePopulateBracket } from "../../../utils/predictionsUtil";
import IconRender from "../../common/icons/iconRender";
import LoadingContext from "../../../context/loadingContext";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import StatusNote from "../../common/pageSections/statusNote";

const LeaderboardViewPredictionModal = ({
  prediction,
  isOpen,
  setIsOpen,
  originalMatches,
  competition,
  allTeams,
  result,
  setForceRemoveOpen,
  setSelectedPrediction,
  groupInfo,
  isSecondChance,
}) => {
  const { user } = useContext(LoadingContext);
  const { width } = useWindowDimensions();
  const [tabs, setTabs] = useState(["Playoff", "Bonus"]);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [groups, setGroups] = useState({});
  const [playoffMatches, setPlayoffMatches] = useState([]);
  const [orientation, setOrientation] = useState("portrait");

  const isTab = (tab) => {
    return selectedTab.toLowerCase().includes(tab.toLowerCase());
  };

  useEffect(() => {
    convertData();
  }, [prediction]);

  useEffect(() => {
    const newTabs = isSecondChance
      ? ["Playoff", "Bonus"]
      : ["Group", "Playoff", "Bonus"];
    setTabs(newTabs);
    setSelectedTab(newTabs[0]);
  }, [isSecondChance]);

  const convertData = () => {
    if (!prediction.playoffPredictions) return;
    const { groups: populatedGroups, playoffMatches: populatedPlayoffMatches } =
      handlePopulateBracket(
        prediction.groupPredictions,
        prediction.playoffPredictions,
        originalMatches,
        result,
        prediction.isSecondChance,
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
          {prediction.playoffPredictions && (
            <p className="status-note">Correct picks are highlighted</p>
          )}
        </>
      }
      style={{
        width: "80%",
        height: "85%",
      }}
    >
      {prediction.playoffPredictions ? (
        <>
          <SegmentedControl
            tabs={tabs}
            selectedTab={selectedTab}
            onSelectTab={setSelectedTab}
          />
          <div className="text-center">
            {isTab("group") ? (
              <GroupPicker
                groups={groups}
                isLocked={true}
                highlight={{
                  backgroundColor: "#66ff73",
                  color: "#000",
                  key: "correct",
                }}
                competition={competition}
                availableWidth={width * 0.8}
              />
            ) : isTab("playoff") ? (
              <BracketPicker
                matches={playoffMatches}
                misc={prediction.misc}
                isLocked={true}
                isPortrait={orientation}
                setIsPortrait={setOrientation}
                originalPlayoffMatches={originalMatches}
              />
            ) : isTab("bonus") ? (
              <Miscellaneous
                misc={prediction.misc}
                playoffMatches={playoffMatches}
                competition={competition}
                allTeams={allTeams}
                isLocked={true}
              />
            ) : null}
          </div>
        </>
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
