import React, { useState, useContext, useEffect } from "react";

import Confirm from "../../common/modal/confirm";
import RegistrationModalForm from "../../user/registrationModalForm";
import LoadingContext from "../../../context/loadingContext";
import GroupModalForm from "../groups/groupModalForm";
import PredictionInfo from "./predictionInfo";

import {
  getPredictions,
  deletePrediction,
  removePredictionFromGroup,
} from "../../../services/predictionsService";
import { toast } from "react-toastify";
import Header from "../../common/pageSections/header";

const SubmittedPredictions = () => {
  const { user, setLoading } = useContext(LoadingContext);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [predictions, setPredictions] = useState([]);

  const loadData = async () => {
    setLoading(true);
    const predictionsRes = await getPredictions();
    if (predictionsRes && predictionsRes.status === 200)
      setPredictions(
        predictionsRes.data.sort(
          (a, b) =>
            new Date(b.competitionID?.competitionStart) -
            new Date(a.competitionID?.competitionStart)
        )
      );
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveGroup = async (prediction, group) => {
    setLoading(true);
    const res = await removePredictionFromGroup(prediction._id, group);
    if (res.status === 200) {
      toast.success("Group Removed");
      return loadData();
    } else toast.error(res.data);
    setLoading(false);
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

  return user ? (
    <>
      <Header text="Submissions" />
      {predictions.length > 0 ? (
        predictions.map((p) => (
          <React.Fragment key={p._id}>
            <PredictionInfo
              prediction={p}
              onRemoveGroup={handleRemoveGroup}
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
            onSuccess={() => {
              setGroupFormOpen(false);
              loadData();
            }}
          />
          <Confirm
            header="Confirm Delete Submission"
            isOpen={confirmDeleteOpen}
            setIsOpen={() => setConfirmDeleteOpen(false)}
            focus="cancel"
            onConfirm={() => handleDeletePrediction(selectedSubmission)}
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
        header="Login or Register to View your Submissions"
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSuccess={() => {
          setRegisterFormOpen(false);
          loadData();
        }}
        selectedTab="login"
      />
    </>
  );
};

export default SubmittedPredictions;
