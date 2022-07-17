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
  removePredictionFromGroup,
} from "../../../services/predictionsService";
import Competitions from "./competitions";
import SubmittedPredictions from "./submittedPredictions";
import { titleCase } from "../../../utils/allowables";

const PredictionsHome = ({ paramTab }) => {
  let navigate = useNavigate();
  const { setLoading, user } = useContext(LoadingContext);
  const [activeCompetitions, setActiveCompetitions] = useState([]);
  const [expiredCompetitions, setExpiredCompetitions] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const tabs = ["Active Competitions", "Expired Competitions", "Submissions"];
  const [selectedTab, setSelectedTab] = useState(
    titleCase(paramTab) || tabs[0]
  );

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
    </div>
  );
};

export default PredictionsHome;
