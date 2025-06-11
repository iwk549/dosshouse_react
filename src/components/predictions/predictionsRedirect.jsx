import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import PredictionsHome from "./home/predictionsHome";
import PredictionMaker from "./maker/predictionsMaker";
import PredictionsLeaderboard from "./leaderboard/predictionsLeaderboard";
import SubmittedPredictions from "./home/submittedPredictions";

const PredictionsRedirect = ({ page }) => {
  const [Component, setComponent] = useState(<div />);
  const [searchParams] = useSearchParams();
  const predictionID = searchParams.get("id");
  const leaderboard = searchParams.get("leaderboard");
  const competitionID = searchParams.get("competitionID");
  const groupID = searchParams.get("groupID");
  const selectedTab = searchParams.get("tab");
  const type = searchParams.get("type");
  const groupName = searchParams.get("groupName");
  const groupPasscode = searchParams.get("groupPasscode");

  const redirect = () => {
    setComponent(
      predictionID ? (
        <PredictionMaker
          predictionID={predictionID}
          competitionID={competitionID}
          groupName={groupName}
          groupPasscode={groupPasscode}
        />
      ) : leaderboard ? (
        <PredictionsLeaderboard
          competitionID={competitionID}
          groupID={groupID}
        />
      ) : page === "submissions" ? (
        <SubmittedPredictions />
      ) : (
        <PredictionsHome
          paramTab={selectedTab}
          type={type}
          groupName={groupName}
          groupPasscode={groupPasscode}
          competitionID={competitionID}
        />
      )
    );
  };

  useEffect(() => {
    redirect();
  }, [window.location.search, page]);

  return Component;
};

export default PredictionsRedirect;
