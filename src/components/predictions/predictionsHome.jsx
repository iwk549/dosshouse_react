import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../common/pageSections/header";
import LoadingContext from "../../context/loadingContext";
import TabbedArea from "../common/pageSections/tabbedArea";
import {
  getActiveCompetitions,
  getExpiredCompetitions,
} from "../../services/competitionService";
import {
  getPredictions,
  deletePrediction,
} from "../../services/predictionsService";
import Competitions from "./competitions";
import SumbittedPredictions from "./sumbittedPredictions";

const PredictionsHome = () => {
  const { setLoading, user } = useContext(LoadingContext);
  const [activeCompetitions, setActiveCompetitions] = useState([]);
  const [expiredCompetitions, setExpiredCompetitions] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedTab, setSelectedTab] = useState("active Competitions");
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
          />
        ) : null}
      </TabbedArea>
    </div>
  );
};

export default PredictionsHome;
