import React, { useEffect, useState, useContext } from "react";

import BasicModal from "../../common/modal/basicModal";
import LoadingContext from "../../../context/loadingContext";
import { getPredictionsByCompetition } from "../../../services/predictionsService";
import ExternalImage from "../../common/image/externalImage";
import logos from "../../../textMaps/logos";
import RegistrationModalForm from "../../user/registrationModalForm";

const GroupAddFromLinkModal = ({
  isOpen,
  setIsOpen,
  groupName,
  competition,
  onAddPredictionToGroup,
}) => {
  const { user, setLoading } = useContext(LoadingContext);

  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [loginFormOpen, setLoginFormOpen] = useState(false);

  const loadPredictionsForCompetition = async () => {
    setLoading(true);
    if (competition) {
      const res = await getPredictionsByCompetition(competition._id);
      if (res.status === 200) {
        setPredictions(res.data);
      }
      // don't display error message
      // user may not be logged in, will throw "Invalid Token" as route is autthenticated
      // if error occurs user can still create a new submission
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPredictionsForCompetition();
  }, [competition]);

  const handleSelectPrediction = (prediction) => {
    if (prediction._id === selectedPrediction?._id) setSelectedPrediction(null);
    else setSelectedPrediction(prediction);
  };

  const renderPrediction = (prediction) => {
    return (
      <div
        key={prediction._id}
        className={
          "single-card clickable" +
          (prediction._id === selectedPrediction?._id ? " selected" : "")
        }
        onClick={() => handleSelectPrediction(prediction)}
      >
        <div>
          <b>{prediction.name}</b>
        </div>
        <div>
          <ExternalImage
            uri={logos[prediction.misc?.winner]}
            width={25}
            height={25}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <BasicModal
        isOpen={isOpen}
        onClose={setIsOpen}
        header={
          <>
            <h4>
              You&apos;ve been invited to join a group for {competition?.name}
            </h4>
            <h2 className="pop-box">
              <b>{groupName}</b>
            </h2>
          </>
        }
      >
        <br />
        <button
          className="btn btn-block btn-md btn-dark"
          onClick={() =>
            onAddPredictionToGroup(selectedPrediction, competition._id)
          }
          disabled={!selectedPrediction}
        >
          {selectedPrediction
            ? selectedPrediction._id === "new"
              ? "Start a New Prediction"
              : "Add Selected Prediction to Group"
            : "Select Option to Add to Group"}
        </button>
        <br />
        <br />
        {competition?.maxSubmissions > predictions.length &&
          renderPrediction({ _id: "new", name: "Create New Prediction" })}
        {predictions.map((p) => renderPrediction(p))}
        <br />
        <br />
        {!user && (
          <button
            className="btn btn-block btn-sm btn-dark"
            onClick={() => setLoginFormOpen(true)}
          >
            Don&apos;t see your predictions? Click here to log in
          </button>
        )}
      </BasicModal>
      <RegistrationModalForm
        header="Login to Add Your Predictions to a Group"
        selectedTab="login"
        isOpen={loginFormOpen}
        setIsOpen={setLoginFormOpen}
        onSuccess={() => {
          setLoginFormOpen(false);
          loadPredictionsForCompetition;
        }}
      />
    </>
  );
};

export default GroupAddFromLinkModal;
