import React, { useState, useEffect, useContext } from "react";
import TabbedArea from "react-tabbed-area";

import BasicModal from "../../common/modal/basicModal";
import GroupPicker from "../maker/groupPicker";
import BracketPicker from "../maker/bracketPicker";
import Miscellaneous from "../maker/miscellaneous";
import { handlePopulateBracket } from "../../../utils/predictionsUtil";
import IconRender from "../../common/icons/iconRender";
import LoadingContext from "../../../context/loadingContext";

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
}) => {
  const { user } = useContext(LoadingContext);
  const tabs = prediction?.isSecondChance
    ? ["Playoff", "Bonus"]
    : ["Group", "Playoff", "Bonus"];
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

  const convertData = () => {
    if (!prediction.playoffPredictions) return;
    const { groups: populatedGroups, playoffMatches: populatedPlayoffMatches } =
      handlePopulateBracket(
        prediction.groupPredictions,
        prediction.playoffPredictions,
        originalMatches,
        result,
        prediction.isSecondChance
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
          <h3>
            <b>{prediction.name}</b>
          </h3>
          <h2>{prediction.totalPoints} Points</h2>
          <h3>{prediction.totalPicks} Correct Picks</h3>
          {/* {prediction.potentialPoints ? (
            <>
              <h4>{prediction.potentialPoints.realistic} Potential</h4>
            </>
          ) : null} */}
          {groupInfo &&
            groupInfo.ownerID &&
            groupInfo.ownerID._id === user?._id && (
              <button
                className="btn btn-block btn-danger"
                onClick={() => {
                  setSelectedPrediction(prediction);
                  setForceRemoveOpen(true);
                }}
              >
                <IconRender type="remove" />
              </button>
            )}
          {prediction.playoffPredictions && (
            <p>Correct picks are highlighted</p>
          )}
        </>
      }
      style={{
        width: "80%",
        height: "85%",
      }}
    >
      {prediction.playoffPredictions ? (
        <TabbedArea
          tabs={tabs}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          tabPlacement="top"
        >
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
        </TabbedArea>
      ) : (
        <p className="text-center">
          You will be able to view all the picks once the submission deadline
          has passed
        </p>
      )}
    </BasicModal>
  );
};

export default LeaderboardViewPredictionModal;
