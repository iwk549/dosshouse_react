import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { useNavigate } from "react-router-dom";

import { splitName } from "../../utils/allowables";
import BracketPicker from "./bracketPicker";
import GroupPicker from "./groupPicker";
import { toast } from "react-toastify";
import LoadingContext from "../../context/loadingContext";
import RegistrationModalForm from "../user/registrationModalForm";
import { getMatches } from "../../services/matchService";
import { predictionReducer } from "../../utils/predictionsUtil";
import {
  savePredictions,
  getPrediction,
} from "../../services/predictionsService";
import { getCompetition } from "../../services/competitionService";
import HeaderLine from "./headerLine";
import TabbedArea from "../common/pageSections/tabbedArea";
import Miscellaneous from "./miscellaneous";

const PredictionMaker = ({ competitionID, predictionID }) => {
  let navigate = useNavigate();
  const { user, setLoading } = useContext(LoadingContext);
  const [predictions, dispatchPredictions] = useReducer(predictionReducer, {
    groups: {},
    playoffs: [],
    playoffMatches: [],
    competition: {},
    misc: {
      winner: "",
    },
    isSaved: false,
    isLocked: false,
    missingItems: [],
  });
  const [groupMatches, setGroupMatches] = useState({});
  const [predictionName, setPredictionName] = useState("");
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const tabs = ["group", "bracket", "miscellaneous", "rules"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const loadData = async () => {
    setLoading(true);
    let isLocked = false;

    // get matches from db
    const filtered = {
      groups: {},
      groupMatches: {},
      playoffMatches: [],
    };
    let addedTeamTracker = [];
    const matchesRes = await getMatches(competitionID);
    // get competition info
    const competitionRes = await getCompetition(competitionID);
    if (competitionRes.status !== 200) toast.error(competitionRes.data);

    if (matchesRes.status === 200) {
      matchesRes.data.forEach((m) => {
        if (m.locked) isLocked = true;
        if (m.type === "Group") {
          if (!filtered.groups[m.groupName]) {
            filtered.groups[m.groupName] = [];
            filtered.groupMatches[m.groupName] = [m];
          } else {
            filtered.groupMatches[m.groupName].push(m);
          }
          ["home", "away"].forEach((t) => {
            const teamName = m[t + "TeamName"];
            if (!addedTeamTracker.includes(teamName)) {
              addedTeamTracker.push(teamName);
              filtered.groups[m.groupName].push({
                name: teamName,
              });
            }
          });
        } else if (m.type === "Playoff") filtered.playoffMatches.push(m);
      });
      setGroupMatches(filtered.groupMatches);

      // get saved predictions or set new predictions
      if (predictionID !== "new") {
        // grab predictions from db
        const predictionsRes = await getPrediction(predictionID);
        if (predictionsRes.status === 200) {
          dispatchPredictions({
            type: "populate",
            groups: predictionsRes.data.groupPredictions,
            playoffs: predictionsRes.data.playoffPredictions,
            playoffMatches: filtered.playoffMatches,
            competition: competitionRes.data,
            isLocked,
          });
          setPredictionName(predictionsRes.data.name);
        } else toast.error(predictionsRes.data);
      } else {
        dispatchPredictions({
          type: "initial",
          groups: filtered.groups,
          playoffs: [],
          playoffMatches: filtered.playoffMatches,
          competition: competitionRes.data,
          isLocked,
        });
        if (user) setPredictionName(splitName(user.name) + "'s Bracket");
      }
    } else toast.error(matchesRes.data);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePredictions = async () => {
    if (!user) return setRegisterFormOpen(true);
    setLoading(true);
    const groupPredictions = [];
    Object.keys(predictions.groups).forEach((k) => {
      groupPredictions.push({
        groupName: k,
        teamOrder: predictions.groups[k].map((t) => t.name),
      });
    });
    const res = await savePredictions(predictionID, {
      name: predictionName,
      competitionID,
      groupPredictions,
      playoffPredictions: predictions.playoffs,
    });
    if (res.status === 200) {
      dispatchPredictions({ type: "save" });
      toast.success("Predictions saved");
      navigate(`/predictions?id=${res.data}&competitionID=${competitionID}`, {
        replace: true,
      });
    } else toast.error(res.data);
    setLoading(false);
  };

  const handleSelectTeam = (match, team) => {
    dispatchPredictions({ type: "winner", match, winner: team });
  };

  return (
    <div>
      <HeaderLine
        onSave={handleSavePredictions}
        predictionName={predictionName}
        setPredictionName={(value) => {
          setPredictionName(value);
          dispatchPredictions({ type: "edit" });
        }}
        isSaved={predictions.isSaved}
        competition={predictions.competition}
        missingItems={predictions.missingItems}
      />
      <br />
      <TabbedArea
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        tabPlacement="top"
      >
        <div className="text-center">
          {selectedTab.includes("group") ? (
            <GroupPicker
              groups={predictions.groups}
              onDrop={dispatchPredictions}
              onReorder={dispatchPredictions}
              isLocked={predictions.isLocked}
              groupMatches={groupMatches}
            />
          ) : selectedTab.includes("bracket") ? (
            <BracketPicker
              matches={predictions.playoffMatches}
              onSelectTeam={handleSelectTeam}
              isLocked={predictions.isLocked}
              misc={predictions.misc}
            />
          ) : selectedTab.includes("misc") ? (
            <Miscellaneous
              misc={predictions.misc}
              playoffMatches={predictions.playoffMatches}
            />
          ) : null}
        </div>
      </TabbedArea>
      <div style={{ float: "right" }}>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => navigate("/predictions")}
        >
          Exit
        </button>
      </div>
      <RegistrationModalForm
        header="Login or Register to Save Your Predictions"
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSuccess={() => {
          setRegisterFormOpen(false);
          handleSavePredictions();
        }}
      />
    </div>
  );
};

export default PredictionMaker;
