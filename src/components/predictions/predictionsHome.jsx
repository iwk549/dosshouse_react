import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Header from "../common/pageSections/header";
import LoadingContext from "../../context/loadingContext";
import TabbedArea from "../common/pageSections/tabbedArea";
import { getCompetitions } from "../../services/competitionService";
import { getPredictions } from "../../services/predictionsService";
import { shortDate } from "../../utils/allowables";
import ActiveCompetitions from "./activeCompetitions";
import SumbittedPredictions from "./sumbittedPredictions";

const PredictionsHome = () => {
  const { setLoading } = useContext(LoadingContext);
  let navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedTab, setSelectedTab] = useState("active Competitions");
  const tabs = ["active Competitions", "submitted Brackets"];

  const loadData = async () => {
    setLoading(true);
    const competitionsRes = await getCompetitions();
    const predictionsRes = await getPredictions();
    if (competitionsRes.status === 200) {
      if (predictionsRes.status === 200) {
        setPredictions(predictionsRes.data);
        setCompetitions(competitionsRes.data);
      } else toast.error(predictionsRes.data);
    } else toast.error(competitionsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Header text="Predictions" />
      <TabbedArea
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        tabPlacement="top"
      >
        {selectedTab.toLowerCase().includes("competitions") ? (
          <>
            <ActiveCompetitions competitions={competitions} />
          </>
        ) : selectedTab.toLowerCase().includes("submitted") ? (
          <SumbittedPredictions predictions={predictions} />
        ) : null}
      </TabbedArea>
    </div>
  );
};

export default PredictionsHome;
