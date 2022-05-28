import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import PredictionsHome from "./home/predictionsHome";
import PredictionMaker from "./maker/predictionsMaker";
import PredictionsLeaderboard from "./leaderboard/predictionsLeaderboard";

const PredictionsRedirect = () => {
  const [Component, setComponent] = useState(<div />);
  const [searchParams] = useSearchParams();
  const predictionID = searchParams.get("id");
  const leaderboard = searchParams.get("leaderboard");
  const competitionID = searchParams.get("competitionID");
  const groupID = searchParams.get("groupID");
  const selectedTab = searchParams.get("tab");

  const redirect = () => {
    setComponent(
      predictionID ? (
        <PredictionMaker
          predictionID={predictionID}
          competitionID={competitionID}
        />
      ) : leaderboard ? (
        <PredictionsLeaderboard
          competitionID={competitionID}
          groupID={groupID}
        />
      ) : (
        <PredictionsHome paramTab={selectedTab} />
      )
    );
  };

  useEffect(() => {
    redirect();
  }, [window.location.search]);

  return Component;
};

export default PredictionsRedirect;
