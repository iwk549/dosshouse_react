import React, { useState, useEffect, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import PredictionsHome from "./home/predictionsHome";
import PredictionMaker from "./maker/predictionsMaker";
import PredictionsLeaderboard from "./leaderboard/predictionsLeaderboard";

const PredictionsRedirect = ({}) => {
  const [Component, setComponent] = useState(<div />);
  const [searchParams] = useSearchParams();
  const predictionID = searchParams.get("id");
  const leaderboard = searchParams.get("leaderboard");
  const competitionID = searchParams.get("competitionID");
  const groupID = searchParams.get("groupID");

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
        <PredictionsHome />
      )
    );
  };

  useEffect(() => {
    redirect();
  }, [window.location.search]);

  return Component;
};

export default PredictionsRedirect;
