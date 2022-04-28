import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { renderInfoLine } from "../../../utils/textUtils";
import Confirm from "../../common/modal/confirm";
import RegistrationModalForm from "../../user/registrationModalForm";
import LoadingContext from "../../../context/loadingContext";
import GroupModalForm from "../groups/groupModalForm";
import PredictionGroupList from "../groups/predictionGroupList";

const SumbittedPredictions = ({
  predictions,
  onDelete,
  onLogin,
  onGroupSuccess,
  onRemoveGroup,
}) => {
  const { user } = useContext(LoadingContext);
  let navigate = useNavigate();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const [groupFormOpen, setGroupFormOpen] = useState(false);

  const renderInfo = (prediction) => {
    return (
      <div className="col">
        <h4>
          <b>Info</b>
        </h4>
        {renderInfoLine("Submission Name", prediction.name)}
        {renderInfoLine("Competition", prediction.competitionID?.name)}
        {renderInfoLine(
          "Submissions Allowed",
          prediction.competitionID?.maxSubmissions
        )}
        {renderInfoLine(
          "Submissions Made",
          predictions.filter(
            (p) => p.competitionID?._id === prediction.competitionID?._id
          ).length
        )}
      </div>
    );
  };

  const renderPoints = (points, totalPoints) => {
    return (
      <div className="col">
        <h4>
          <b>Points</b>
        </h4>
        {renderInfoLine("Total", totalPoints)}
        {renderInfoLine("Group", points.group.points)}
        {renderInfoLine("Bracket", points.playoff.points)}
        {renderInfoLine("Champion", points.champion.points)}
        {renderInfoLine("Miscellaneous", points.misc.points)}
      </div>
    );
  };

  const raiseLoginSuccess = () => {
    setRegisterFormOpen(false);
    onLogin();
  };

  const raiseGroupSuccess = () => {
    setGroupFormOpen(false);
    onGroupSuccess();
  };

  return user ? (
    <div>
      {predictions.length > 0 ? (
        predictions.map((p) => (
          <React.Fragment key={p._id}>
            <div className="row">
              {renderInfo(p)}
              {renderPoints(p.points, p.totalPoints)}
              <div className="col-2">
                <br />
                <button
                  className="btn btn-sm btn-dark"
                  onClick={() =>
                    navigate(
                      `/predictions?id=${p._id}&competitionID=${p.competitionID?._id}`
                    )
                  }
                >
                  Edit
                </button>
                <div style={{ height: 50 }} />
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setSelectedSubmission(p);
                    setConfirmDeleteOpen(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mini-div-line" />
            <PredictionGroupList
              prediction={p}
              setSelectedSubmission={setSelectedSubmission}
              setGroupFormOpen={setGroupFormOpen}
              onRemoveGroup={(group) => onRemoveGroup(p, group)}
            />
            <hr />
          </React.Fragment>
        ))
      ) : (
        <p>You have not made any submissions</p>
      )}
      {selectedSubmission && (
        <>
          <GroupModalForm
            isOpen={groupFormOpen}
            setIsOpen={setGroupFormOpen}
            header="Manage Groups"
            submission={selectedSubmission}
            onSuccess={raiseGroupSuccess}
          />
          <Confirm
            header="Confirm Delete Submission"
            isOpen={confirmDeleteOpen}
            setIsOpen={() => setConfirmDeleteOpen(false)}
            focus="cancel"
            onConfirm={() => onDelete(selectedSubmission)}
          >
            <b>{selectedSubmission.name}</b>
            <br />
            Are you sure you want to delete this submission?
            <br />
            This cannot be undone.
          </Confirm>
        </>
      )}
    </div>
  ) : (
    <>
      <p>Login to view your submissions</p>
      <button
        className="btn btn-sm btn-dark"
        onClick={() => setRegisterFormOpen(true)}
      >
        Login
      </button>
      <RegistrationModalForm
        header="Login or Register to View Your Submissions"
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSuccess={raiseLoginSuccess}
        selectedTab="login"
      />
    </>
  );
};

export default SumbittedPredictions;
