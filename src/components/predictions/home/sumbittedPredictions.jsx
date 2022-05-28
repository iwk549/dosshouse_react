import React, { useState, useContext } from "react";

import Confirm from "../../common/modal/confirm";
import RegistrationModalForm from "../../user/registrationModalForm";
import LoadingContext from "../../../context/loadingContext";
import GroupModalForm from "../groups/groupModalForm";
import PredictionInfo from "./predictionInfo";
import Header from "../../common/pageSections/header";

const SumbittedPredictions = ({
  predictions,
  onDelete,
  onLogin,
  onGroupSuccess,
  onRemoveGroup,
}) => {
  const { user } = useContext(LoadingContext);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const [groupFormOpen, setGroupFormOpen] = useState(false);

  const raiseLoginSuccess = () => {
    setRegisterFormOpen(false);
    onLogin();
  };

  const raiseGroupSuccess = () => {
    setGroupFormOpen(false);
    onGroupSuccess();
  };

  return user ? (
    <>
      {predictions.length > 0 ? (
        predictions.map((p) => (
          <React.Fragment key={p._id}>
            <PredictionInfo
              prediction={p}
              onRemoveGroup={onRemoveGroup}
              setSelectedSubmission={setSelectedSubmission}
              setConfirmDeleteOpen={setConfirmDeleteOpen}
              setGroupFormOpen={setGroupFormOpen}
              submissionsMade={
                predictions.filter(
                  (pred) => pred.competitionID?._id === p.competitionID?._id
                ).length
              }
            />
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
    </>
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
