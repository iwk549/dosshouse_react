import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../common/pageSections/header";
import LoadingContext from "../../../context/loadingContext";
import TabbedArea from "../../common/pageSections/tabbedArea";
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
import SumbittedPredictions from "./sumbittedPredictions";

const PredictionsHome = ({ paramTab }) => {
  const { setLoading, user } = useContext(LoadingContext);
  const [activeCompetitions, setActiveCompetitions] = useState([]);
  const [expiredCompetitions, setExpiredCompetitions] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedTab, setSelectedTab] = useState(
    paramTab || "active Competitions"
  );
  const tabs = ["active Competitions", "expired Competitions", "submissions"];

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
    if (predictionsRes.status === 200) setPredictions(predictionsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onTab = (tab) => {
    return selectedTab.toLowerCase().includes(tab);
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
        onSelectTab={setSelectedTab}
        tabPlacement="top"
      >
        {onTab("competitions") ? (
          <Competitions
            competitions={
              onTab("active")
                ? activeCompetitions
                : onTab("expired")
                ? expiredCompetitions
                : []
            }
            predictions={predictions}
            expired={onTab("expired")}
          />
        ) : onTab("submission") ? (
          <SumbittedPredictions
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
