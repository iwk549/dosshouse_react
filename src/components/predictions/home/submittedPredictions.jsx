import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
import TabbedArea from "react-tabbed-area";
import { titleCase } from "../../../utils/allowables";
import { submissionsMadeByCompetition } from "../../../utils/competitionsUtil";
import SearchBox from "../../common/searchSort/searchBox";

const SubmittedPredictions = ({ paramTab, competitionID }) => {
  let navigate = useNavigate();
  const { user, setLoading } = useContext(LoadingContext);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [submissionsCountObj, setSubmissionsCountObj] = useState({});
  const [activeSubmissions, setActiveSubmissions] = useState([]);
  const [expiredSubmissions, setExpiredSubmissions] = useState([]);
  const tabs = ["Active", "Expired"];
  const [selectedTab, setSelectedTab] = useState(
    titleCase(paramTab) || tabs[0]
  );

  const loadData = async () => {
    setLoading(true);
    const predictionsRes = await getPredictions();
    if (predictionsRes && predictionsRes.status === 200) {
      let active = [];
      let expired = [];
      let searched = "";
      let tab = "Active";
      predictionsRes.data
        .sort(
          (a, b) =>
            new Date(b.competitionID?.competitionStart) -
            new Date(a.competitionID?.competitionStart)
        )
        .forEach((pred) => {
          if (new Date(pred.competitionID?.competitionEnd) < new Date()) {
            expired.push(pred);
          } else active.push(pred);

          if (competitionID) {
            if (pred.competitionID?._id === competitionID) {
              tab =
                new Date(pred.competitionID?.competitionEnd) < new Date()
                  ? "Expired"
                  : "Active";
              searched = pred.competitionID?.name || "";
            }
          }
        });

      handleSelectTab(tab, searched);
      setSubmissionsCountObj(submissionsMadeByCompetition(predictionsRes.data));
      setActiveSubmissions(active);
      setExpiredSubmissions(expired);
    }
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

  const handleSelectTab = (tab, search = "") => {
    navigate(`/submissions?tab=${tab}`, { replace: true });
    setSearchQuery(search);
    setSelectedTab(tab);
  };

  const filterCompetitions = () => {
    let displayed =
      selectedTab === "Active" ? activeSubmissions : expiredSubmissions;

    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      displayed = displayed.filter((sub) => {
        if (
          sub.competitionID?.name.toLowerCase().includes(s) ||
          sub.name.toLowerCase().includes(s)
        ) {
          return true;
        }
      });
    }

    return displayed;
  };

  return user ? (
    <div>
      <Header text="Submissions" />
      <SearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by competition or submission name..."
      />
      <TabbedArea
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={handleSelectTab}
        tabPlacement="top"
      >
        {filterCompetitions().length ? (
          filterCompetitions().map((p) => (
            <div key={p._id}>
              <PredictionInfo
                prediction={p}
                onRemoveGroup={handleRemoveGroup}
                setSelectedSubmission={setSelectedSubmission}
                setConfirmDeleteOpen={setConfirmDeleteOpen}
                setGroupFormOpen={setGroupFormOpen}
                submissionsMade={submissionsCountObj[p.competitionID?._id]}
              />
            </div>
          ))
        ) : (
          <p>There are no submissions to display</p>
        )}
      </TabbedArea>
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
