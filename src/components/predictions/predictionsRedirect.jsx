import React, { useState, useEffect, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import PredictionsHome from "./predictionsHome";
import PredictionMaker from "./predictionsMaker";
import PredictionsLeaderboard from "./predictionsLeaderboard";

const PredictionsRedirect = ({}) => {
  const [Component, setComponent] = useState(<div />);
  const [searchParams] = useSearchParams();
  const predictionID = searchParams.get("id");
  const leaderboard = searchParams.get("leaderboard");
  const competitionID = searchParams.get("competitionID");

  const redirect = () => {
    setComponent(
      predictionID ? (
        <PredictionMaker
          predictionID={predictionID}
          competitionID={competitionID}
        />
      ) : leaderboard ? (
        <PredictionsLeaderboard competitionID={competitionID} />
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
