import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TabbedArea from "react-tabbed-area";

import Header from "../../common/pageSections/header";
import LoadingContext from "../../../context/loadingContext";
import {
  getActiveCompetitions,
  getExpiredCompetitions,
} from "../../../services/competitionService";
import {
  getPredictions,
  deletePrediction,
  addPredictionToGroup,
  removePredictionFromGroup,
} from "../../../services/predictionsService";
import Competitions from "./competitions";
import SubmittedPredictions from "./submittedPredictions";
import GroupAddFromLinkModal from "../groups/groupAddFromLinkModal";
import { titleCase } from "../../../utils/allowables";

const PredictionsHome = ({
  paramTab,
  type,
  groupName,
  groupPasscode,
  competitionID,
}) => {
  let navigate = useNavigate();
  const { setLoading, user } = useContext(LoadingContext);
  const [activeCompetitions, setActiveCompetitions] = useState([]);
  const [expiredCompetitions, setExpiredCompetitions] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const tabs = ["Active Competitions", "Expired Competitions", "Submissions"];
  const [selectedTab, setSelectedTab] = useState(
    titleCase(paramTab) || tabs[0]
  );
  const [groupAddFromLinkOpen, setGroupAddFromLinkOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const activeCompetitionsRes = await getActiveCompetitions();
    const expiredCompetitionsRes = await getExpiredCompetitions();
    const predictionsRes = await getPredictions();

    if (activeCompetitionsRes.status === 200) {
      if (expiredCompetitionsRes.status === 200) {
        setActiveCompetitions(activeCompetitionsRes.data);
        setExpiredCompetitions(expiredCompetitionsRes.data);
      } else toast.error(expiredCompetitionsRes.data);
    } else toast.error(activeCompetitionsRes.data);

    // no error displayed here
    // this is to gather users submissions, if not logged in will give error
    if (predictionsRes && predictionsRes.status === 200)
      setPredictions(predictionsRes.data);

    if (type === "groupLink") setGroupAddFromLinkOpen(true);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const isTab = (tab) => {
    return selectedTab.toLowerCase().includes(tab);
  };

  const handleSelectTab = (tab) => {
    navigate(`/predictions?tab=${tab}`, { replace: true });
    setSelectedTab(tab);
  };

  const handleDeletePrediction = async (prediction) => {
    setLoading(true);
    const deleteRes = await deletePrediction(prediction._id);
    if (deleteRes.status === 200) {
      toast.success("Prediction deleted");
      return loadData();
    } else toast.error(deleteRes.data);
    setLoading(false);
  };

  const handleRemoveGroup = async (prediction, group) => {
    setLoading(true);
    const res = await removePredictionFromGroup(prediction._id, group);
    if (res.status === 200) {
      toast.success("Group Removed");
      return loadData();
    } else toast.error(res.data);
    setLoading(false);
  };

  const handleAddPredictionToGroup = async (prediction, competitionID) => {
    if (prediction._id === "new") {
      navigate(
        `/predictions?id=new&competitionID=${competitionID}&groupName=${groupName}&groupPasscode=${groupPasscode}`
      );
    } else {
      setLoading(true);
      const res = await addPredictionToGroup(prediction._id, {
        name: groupName,
        passcode: groupPasscode,
        fromUrl: true,
      });
      if (res.status === 200) {
        toast.success("Prediction added to group");
        setGroupAddFromLinkOpen(false);
        handleSelectTab("Submissions");
        return loadData();
      }
      toast.error(res.data);
      setLoading(false);
    }
  };

  return (
    <div>
      <Header text="Predictions" />
      <TabbedArea
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={handleSelectTab}
        tabPlacement="top"
      >
        {isTab("competitions") ? (
          <Competitions
            competitions={
              isTab("active")
                ? activeCompetitions
                : isTab("expired")
                ? expiredCompetitions
                : []
            }
            predictions={predictions}
            expired={isTab("expired")}
          />
        ) : isTab("submission") ? (
          <SubmittedPredictions
            predictions={predictions}
            onDelete={handleDeletePrediction}
            onLogin={loadData}
            onGroupSuccess={loadData}
            onRemoveGroup={handleRemoveGroup}
          />
        ) : null}
      </TabbedArea>
      {groupName && (
        <GroupAddFromLinkModal
          isOpen={groupAddFromLinkOpen}
          setIsOpen={setGroupAddFromLinkOpen}
          groupName={groupName}
          groupPasscode={groupPasscode}
          competition={activeCompetitions.find((c) => c._id === competitionID)}
          onAddPredictionToGroup={handleAddPredictionToGroup}
        />
      )}
    </div>
  );
};

export default PredictionsHome;
