import React, { useState, useEffect, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import PredictionsHome from "./predictionsHome";
import PredictionMaker from "./predictionsMaker";

const PredictionsRedirect = ({}) => {
  const [Component, setComponent] = useState(<div />);
  const [searchParams] = useSearchParams();
  const predictionID = searchParams.get("id");
  const bracketCode = searchParams.get("bracketCode");

  const redirect = () => {
    setComponent(
      predictionID ? (
        <PredictionMaker
          predictionID={predictionID}
          bracketCode={bracketCode}
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
